import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/sanity/types';

/**
 * A project in the grid.
 *
 * The whole card is one link target rather than a card containing several
 * links — fewer tab stops, and no ambiguity about what a click does. The card
 * points at the case study on this site, not the client's URL; the old grid did
 * the latter, so every click sent the visitor away before they had read anything
 * Jose wrote about the work.
 */
export function ProjectCard({
  project,
  priority = false,
  index = 0,
  headingLevel = 'h3',
}: {
  project: Project;
  priority?: boolean;
  index?: number;
  /**
   * The card sits directly under the page h1 on /projects, but under an h2
   * ("Selected work") on the home page. Hardcoding h3 skipped a level on
   * /projects, which axe flags as heading-order.
   */
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  return (
    <article
      className="animate-rise group"
      // Staggered only slightly, and only for the first row — a long cascade
      // makes a page feel slow rather than considered.
      style={{ animationDelay: `${Math.min(index, 3) * 60}ms` }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong"
      >
        <div className="overflow-hidden border-b border-line">
          {project.image ? (
            <Image
              src={project.image.url}
              alt={project.image.alt ?? `${project.name} — screenshot`}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
              placeholder={project.image.lqip ? 'blur' : 'empty'}
              blurDataURL={project.image.lqip ?? undefined}
              priority={priority}
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="aspect-[16/10] w-full bg-line" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <Heading className="font-display text-step-1 font-semibold">
            {project.name}
          </Heading>

          {project.summary ? (
            <p className="text-step--1 text-ink-muted">{project.summary}</p>
          ) : null}

          <p className="mt-auto pt-3 font-mono text-step--1 text-ink-muted">
            {project.tags.join(' · ')}
          </p>

          {project.caseStudy.isWritten ? (
            <p className="font-display text-step--1 font-medium text-accent">
              Read the case study →
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
