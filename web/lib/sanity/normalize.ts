import { curatedSummary } from '@/lib/project-copy';
import { parseProjectName, slugify, tagKey } from '@/lib/slug';
import type {
  CaseStudy,
  Metric,
  Note,
  Project,
  ProjectImage,
  RawImageDimensions,
  RawMetric,
  RawNote,
  RawTag,
  RawWork,
  Tag,
} from './types';

/**
 * Raw CMS documents in, clean domain objects out.
 *
 * Every known defect in the dataset is handled here and nowhere else:
 *
 *  - `works.slug` may hold a full live URL, so real slugs are derived from names
 *    when the stored slug isn't usable as one.
 *  - Names embed design credits — "Kairos (Design by DBL Media)".
 *  - Some names carry trailing whitespace ("Chameleon ").
 *  - Tags include near-duplicates ("React" / "React.js") and six orphans that
 *    no work references.
 *
 * It also bridges the Studio migration: each field that moved reads the new
 * location first and falls back to the legacy one, so content can be migrated a
 * document at a time without the site breaking in between.
 *
 * These are pure functions: no network, no framework. That makes them directly
 * unit-testable, which matters because they encode assumptions about content
 * that only a human editing Sanity can change.
 */

function toImage(
  url: string | null,
  dimensions: RawImageDimensions | null,
  lqip: string | null,
  alt: string | null,
): ProjectImage | null {
  if (!url || !dimensions?.width || !dimensions?.height) return null;
  return {
    url,
    width: dimensions.width,
    height: dimensions.height,
    lqip: lqip ?? null,
    alt: cleanText(alt),
  };
}

/**
 * Client sites that no longer load, checked 17 August 2026.
 *
 * A "Visit the live site" button that leads nowhere is worse than no button:
 * it's the detail that makes a reviewer distrust everything else on the page.
 * Rather than silently dropping the link, the project page says the store is
 * offline, which is both honest and explains the absence.
 *
 * Verified individually, because the failure modes differ and a plain HTTP
 * check misreads some of them:
 *   - beamena.com      — domain no longer resolves
 *   - thecomuna.com    — resolves to Cloudflare, origin never answers
 *   - shopimmer.com    — on Shopify, but the TLS certificate is invalid, so
 *                        browsers refuse to load it at all
 *
 * Not in this list, despite failing a naive check: qualitylawyers.es refuses
 * curl but loads fine in a browser, and holy-shakes.com answers 403 to
 * automated requests. Both are live.
 *
 * This is a manual snapshot — re-check it before launch, and drop entries that
 * come back.
 */
const OFFLINE_HOSTS = new Set([
  'beamena.com',
  'thecomuna.com',
  'shopimmer.com',
]);

function isOfflineHost(url: string): boolean {
  try {
    return OFFLINE_HOSTS.has(new URL(url).hostname.replace(/^www\./, ''));
  } catch {
    return false;
  }
}

/** Keeps only http(s) URLs, so a malformed field can't produce a broken link. */
function toUrl(value: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function cleanText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * True when a stored slug is actually a slug rather than a URL.
 *
 * Older documents keep the project's live URL in the slug field, which is why
 * this check exists: a slug that parses as a URL is not one.
 */
export function isUsableSlug(value: string | null | undefined): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  if (trimmed.includes('/') || trimmed.includes(':')) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(trimmed);
}

function nonEmptyBlocks<T>(blocks: T[] | null | undefined): T[] | null {
  return Array.isArray(blocks) && blocks.length > 0 ? blocks : null;
}

function toMetrics(raw: RawMetric[] | null): Metric[] {
  return (raw ?? [])
    .map((m) => ({ label: cleanText(m?.label), value: cleanText(m?.value) }))
    .filter((m): m is Metric => Boolean(m.label && m.value));
}

function toCaseStudy(work: RawWork): CaseStudy {
  const problem = nonEmptyBlocks(work.problem);
  const approach = nonEmptyBlocks(work.approach);
  const outcome = nonEmptyBlocks(work.outcome);
  const metrics = toMetrics(work.metrics);

  return {
    role: cleanText(work.role),
    timeline: cleanText(work.timeline),
    client: cleanText(work.client),
    problem,
    approach,
    outcome,
    metrics,
    // "Written" means there is real prose, not just a role string. `approach` is
    // the load-bearing section — a case study without it explains nothing.
    isWritten: Boolean(approach && (problem || outcome)),
  };
}

export function normalizeProjects(raw: RawWork[]): Project[] {
  const seenSlugs = new Map<string, number>();

  return raw.map((work) => {
    const parsed = parseProjectName(work.name);
    const name = parsed.name;

    // Prefer a real slug from the CMS; derive one when the field still holds a
    // URL (or anything else unusable).
    const base = isUsableSlug(work.legacySlug)
      ? slugify(work.legacySlug!)
      : slugify(name);

    // Slugs may be derived, so collisions are possible. Suffixing keeps routes
    // unique either way.
    const priorCount = seenSlugs.get(base) ?? 0;
    seenSlugs.set(base, priorCount + 1);
    const slug = priorCount === 0 ? base : `${base}-${priorCount + 1}`;

    const tags = dedupeTagNames(
      (work.tagNames ?? []).filter((t): t is string => Boolean(t?.trim())),
    );

    // The explicit field wins; otherwise fall back to the legacy location.
    const resolvedUrl = toUrl(work.liveUrl) ?? toUrl(work.legacySlug);
    const liveUrlOffline = Boolean(resolvedUrl && isOfflineHost(resolvedUrl));
    // Dropped rather than rendered as a dead link.
    const liveUrl = liveUrlOffline ? null : resolvedUrl;
    // CMS field first, then the curated line, then the legacy field. The legacy
    // one comes last because it holds the tech stack as prose ("Wordpress
    // Site"), which the "Built with" row already says.
    const summary =
      cleanText(work.summary) ??
      curatedSummary(slug) ??
      cleanText(work.legacySummary);
    const designCredit = cleanText(work.designCredit) ?? parsed.designCredit;

    return {
      id: work._id,
      slug,
      name,
      designCredit,
      liveUrl,
      liveUrlOffline,
      repoUrl: toUrl(work.repoUrl),
      summary,
      image: toImage(
        work.imageUrl,
        work.imageDimensions,
        work.imageLqip,
        work.imageAlt,
      ),
      tags,
      featured: Boolean(work.featured),
      caseStudy: toCaseStudy(work),
    };
  });
}

/**
 * Collapses near-duplicate tag names, keeping the longest spelling of each.
 * "React" and "React.js" share a key; the more specific label wins.
 */
export function dedupeTagNames(names: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const raw of names) {
    const name = raw.trim();
    const key = tagKey(name);
    const existing = byKey.get(key);
    if (!existing || name.length > existing.length) byKey.set(key, name);
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * Live tags only, merged and ordered by how much work backs them.
 *
 * Orphans are dropped: a tag no project references is not a filter, it's a
 * dead end that the old site turned into an indexable page.
 */
export function normalizeTags(raw: RawTag[], projects: Project[]): Tag[] {
  // Count from the normalised projects rather than the CMS `useCount`, so the
  // numbers shown always match the merged tags actually rendered.
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.tags) {
      const key = tagKey(tag);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  // When several documents share a key, the label comes from the one projects
  // actually reference, then from the shorter spelling. Preferring the *longer*
  // name would surface "React.js" — the orphan document — over "React", which
  // is both the canonical name and the one 2 projects are tagged with.
  const ordered = [...raw].sort((a, b) => {
    const byUse = (b.useCount ?? 0) - (a.useCount ?? 0);
    if (byUse !== 0) return byUse;
    return (a.name ?? '').length - (b.name ?? '').length;
  });

  const byKey = new Map<string, Tag>();
  for (const doc of ordered) {
    const name = doc.name?.trim();
    if (!name) continue;
    const key = tagKey(name);
    const count = counts.get(key) ?? 0;
    if (count === 0) continue; // orphan: no project references it

    const existing = byKey.get(key);
    if (existing) {
      // Keep the winning label; only merge the Shopify flag across duplicates.
      byKey.set(key, {
        ...existing,
        isShopify: existing.isShopify || Boolean(doc.shopify),
      });
      continue;
    }
    byKey.set(key, {
      id: doc._id,
      name,
      key,
      slug: slugify(name),
      count,
      isShopify: Boolean(doc.shopify),
    });
  }

  return [...byKey.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

export function normalizeNotes(raw: RawNote[]): Note[] {
  return raw
    .map((doc) => {
      const title = doc.name?.trim() ?? '';
      const body = doc.description?.trim() ?? '';
      return {
        id: doc._id,
        slug: doc.slug?.trim() || slugify(title),
        title,
        body,
        image: toImage(
          doc.imageUrl,
          doc.imageDimensions,
          doc.imageLqip,
          doc.imageAlt,
        ),
      };
    })
    .filter((note) => note.title && note.body);
}

/** Case-insensitive tag match, tolerant of the "React" / "React.js" split. */
export function projectHasTag(project: Project, tag: string): boolean {
  const key = tagKey(tag);
  return project.tags.some((t) => tagKey(t) === key);
}
