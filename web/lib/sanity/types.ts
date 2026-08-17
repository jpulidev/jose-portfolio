import type { PortableTextBlock } from '@portabletext/react';

/**
 * Two layers of types, on purpose.
 *
 * `Raw*` mirrors exactly what the CMS returns, warts included — nullable fields,
 * untrimmed strings, and a legacy `slug` that may hold a live site URL. The
 * domain types are the clean shapes the app renders. Everything between them
 * lives in `normalize.ts`, so the messiness stops at one boundary instead of
 * leaking into every component.
 *
 * Several fields come in pairs: a new one added in the Studio migration, and the
 * legacy one it replaces. The normaliser reads both, so content can be migrated
 * one document at a time without the site breaking in between.
 */

export type RawImageDimensions = {
  width: number | null;
  height: number | null;
};

export type RawMetric = {
  label: string | null;
  value: string | null;
};

export type RawWork = {
  _id: string;
  name: string | null;
  /** Legacy: on older documents this holds the live URL rather than a slug. */
  legacySlug: string | null;
  /** New, explicit field. Preferred over `legacySlug` when set. */
  liveUrl: string | null;
  repoUrl: string | null;
  /** New one-line summary. Falls back to `legacySummary`. */
  summary: string | null;
  /** Legacy free-text `project` field. */
  legacySummary: string | null;
  /** New explicit field; otherwise parsed out of the name's parenthetical. */
  designCredit: string | null;
  client: string | null;
  role: string | null;
  timeline: string | null;
  featured: boolean | null;
  order: number | null;
  problem: PortableTextBlock[] | null;
  approach: PortableTextBlock[] | null;
  outcome: PortableTextBlock[] | null;
  metrics: RawMetric[] | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageDimensions: RawImageDimensions | null;
  /** Low-quality image placeholder, for a blur while the real image loads. */
  imageLqip: string | null;
  tagNames: (string | null)[] | null;
};

export type RawTag = {
  _id: string;
  name: string | null;
  shopify: boolean | null;
  /** How many works reference this tag. Several tags are referenced by none. */
  useCount: number;
};

export type RawNote = {
  _id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageDimensions: RawImageDimensions | null;
  imageLqip: string | null;
};

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------

export type ProjectImage = {
  url: string;
  width: number;
  height: number;
  /** Blur placeholder, when the CMS provided one. */
  lqip: string | null;
  alt: string | null;
};

export type Metric = {
  label: string;
  value: string;
};

/** The written part of a project page. Empty until someone writes it. */
export type CaseStudy = {
  role: string | null;
  timeline: string | null;
  client: string | null;
  problem: PortableTextBlock[] | null;
  approach: PortableTextBlock[] | null;
  outcome: PortableTextBlock[] | null;
  metrics: Metric[];
  /** True once there is enough written content to be worth calling a case study. */
  isWritten: boolean;
};

export type Project = {
  id: string;
  /** Clean slug: the CMS slug when usable, otherwise derived from the name. */
  slug: string;
  /** Display name, with any credit parenthetical removed. */
  name: string;
  designCredit: string | null;
  liveUrl: string | null;
  /**
   * True when the CMS has a live URL but the site no longer loads, so the page
   * can say so instead of offering a dead link. See OFFLINE_HOSTS in
   * normalize.ts.
   */
  liveUrlOffline: boolean;
  repoUrl: string | null;
  summary: string | null;
  image: ProjectImage | null;
  /** Display names, de-duplicated. */
  tags: string[];
  featured: boolean;
  caseStudy: CaseStudy;
};

export type Tag = {
  id: string;
  name: string;
  /** Comparison key that merges near-duplicates ("React" / "React.js"). */
  key: string;
  slug: string;
  count: number;
  isShopify: boolean;
};

export type Note = {
  id: string;
  slug: string;
  title: string;
  body: string;
  image: ProjectImage | null;
};
