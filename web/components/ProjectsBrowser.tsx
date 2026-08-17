import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { projectHasTag } from '@/lib/sanity/normalize';
import type { Project, Tag } from '@/lib/sanity/types';

/**
 * Tag filtering, rendered on the server.
 *
 * The old site generated a separate page per tag — `/project/Shopify`,
 * `/project/React` — each a near-duplicate of the same list with no canonical
 * tag, and it built one for every tag document including the six no project
 * references. Filtering is query state here instead, so there is one canonical
 * URL for the work.
 *
 * This began as a client component reading `useSearchParams` inside a Suspense
 * boundary, on the assumption that the list would still be prerendered into the
 * static HTML. It was not: the served HTML contained only the 40px Suspense
 * fallback, with the project data sitting in the RSC payload as JSON. That cost
 * a 0.277 CLS — a placeholder replaced by a full grid — and meant the markup a
 * non-JS crawler sees had no projects in it at all.
 *
 * Reading `searchParams` on the server makes /projects dynamically rendered
 * rather than static. That is the deliberate trade: complete, correct HTML on
 * every request, no layout shift, and no client JavaScript for filtering.
 */
export function ProjectsBrowser({
  projects,
  tags,
  activeTag,
}: {
  projects: Project[];
  tags: Tag[];
  activeTag: string | null;
}) {
  const visible = activeTag
    ? projects.filter((project) => projectHasTag(project, activeTag))
    : projects;

  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  // Until projects are marked featured in the Studio, nothing is — so fall back
  // to showing everything as a card rather than an empty grid above a long list.
  const useSplit = featured.length > 0;
  const cards = useSplit ? featured : visible;
  const index = useSplit ? rest : [];

  const activeLabel = tags.find((t) => t.slug === activeTag)?.name ?? activeTag;

  return (
    <>
      <nav aria-label="Filter by technology" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          <FilterLink
            label="All"
            count={projects.length}
            isActive={!activeTag}
            href={{ pathname: '/projects' }}
          />
          {tags.map((tag) => (
            <FilterLink
              key={tag.key}
              label={tag.name}
              count={tag.count}
              isActive={activeTag === tag.slug}
              href={{ pathname: '/projects', query: { tag: tag.slug } }}
            />
          ))}
        </ul>
      </nav>

      <p className="mt-6 font-mono text-step--1 text-ink-muted">
        {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        {activeLabel ? ` · ${activeLabel}` : ''}
      </p>

      {visible.length === 0 ? (
        <p className="mt-8">
          Nothing matches that filter.{' '}
          <Link href="/projects" className="text-accent underline">
            Show all projects
          </Link>
          .
        </p>
      ) : null}

      {cards.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              priority={i === 0}
              headingLevel="h2"
            />
          ))}
        </div>
      ) : null}

      {index.length > 0 ? (
        <section className="mt-16">
          <h2 className="eyebrow">Also built</h2>
          <ul className="mt-5 border-t border-line">
            {index.map((project) => (
              <li key={project.id} className="border-b border-line">
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5 hover:text-accent"
                >
                  <span className="font-display font-medium">
                    {project.name}
                  </span>
                  <span className="font-mono text-step--1 text-ink-muted">
                    {project.tags.join(' · ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function FilterLink({
  label,
  count,
  isActive,
  href,
}: {
  label: string;
  count: number;
  isActive: boolean;
  // A UrlObject rather than a template string, so typedRoutes can check the
  // route and the query stays properly encoded.
  href: React.ComponentProps<typeof Link>['href'];
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'true' : undefined}
        className={`font-display inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-step--1 transition-colors ${
          isActive
            ? 'border-accent bg-accent text-accent-ink'
            : 'border-line hover:border-line-strong'
        }`}
      >
        {label}
        {/* No opacity here on purpose. `opacity-70` blended accent-ink toward
         * the accent background and landed at 4.44:1 — under AA, and invisible
         * to the token contrast test, which can only check solid pairs. The
         * mono face is enough to separate the count from the label. */}
        <span className="font-mono">{count}</span>
      </Link>
    </li>
  );
}
