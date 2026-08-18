import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Prose } from '@/components/Prose';
import { breadcrumbSchema, graph, projectSchema } from '@/lib/jsonld';
import { composeDescription, pageMetadata } from '@/lib/metadata';
import { getProjectBySlug, getProjects } from '@/lib/sanity/data';
import type { Project } from '@/lib/sanity/types';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

/** One statically generated page per project, at a clean canonical URL. */
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project)
    return pageMetadata({
      title: 'Project not found',
      description: 'This project does not exist.',
      path: `/projects/${slug}`,
    });

  // Lead with the summary; the stack and the framing sentence are only added
  // when the summary is short enough to leave room. See composeDescription.
  const lead = project.summary
    ? `${project.name} — ${project.summary}`
    : `${project.name}, a project by Jose Pulido.`;
  const description = composeDescription(
    lead,
    project.tags.length ? `Built with ${project.tags.join(', ')}.` : '',
    'One of 24 storefronts built by Jose Pulido, Shopify developer and tech lead.',
  );

  return pageMetadata({
    title: project.name,
    description,
    path: `/projects/${project.slug}`,
    // This route generates its own card (opengraph-image.tsx), which beats
    // using the screenshot: several are too small to render as a social card.
    routeImage: true,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // A real 404 for an unknown slug, with the correct status code.
  if (!project) notFound();

  const { caseStudy } = project;

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <JsonLd
        data={graph([
          projectSchema(project),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.name, path: `/projects/${project.slug}` },
          ]),
        ])}
      />
      <Link
        href="/projects"
        className="font-display text-step--1 text-ink-muted hover:text-accent"
      >
        ← All projects
      </Link>

      <header className="animate-rise mt-8">
        <h1 className="text-step-4">{project.name}</h1>
        {project.summary ? (
          <p className="measure mt-4 text-step-1 text-ink-muted">
            {project.summary}
          </p>
        ) : null}
      </header>

      <Facts project={project} />

      <div className="mt-8 flex flex-wrap gap-3">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display rounded-full bg-accent px-5 py-3 font-medium text-accent-ink"
          >
            Visit the live site ↗
          </a>
        ) : null}
        {project.liveUrlOffline ? (
          <p className="rounded-full border border-line px-5 py-3 text-step--1 text-ink-muted">
            This store is no longer online
          </p>
        ) : null}
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display rounded-full border border-line-strong px-5 py-3 font-medium hover:border-accent hover:text-accent"
          >
            View the code ↗
          </a>
        ) : null}
      </div>

      {project.image ? (
        <Image
          src={project.image.url}
          alt={project.image.alt ?? `${project.name} — screenshot`}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 768px) 768px, 100vw"
          placeholder={project.image.lqip ? 'blur' : 'empty'}
          blurDataURL={project.image.lqip ?? undefined}
          priority
          className="mt-12 h-auto w-full rounded-xl border border-line"
        />
      ) : null}

      {caseStudy.metrics.length > 0 ? (
        <dl className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {caseStudy.metrics.map((metric) => (
            <div key={metric.label} className="bg-ground px-5 py-6">
              <dd className="font-display text-step-3 font-semibold tabular-nums text-accent">
                {metric.value}
              </dd>
              <dt className="mt-1 text-step--1 text-ink-muted">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>
      ) : null}

      {caseStudy.problem ? (
        <Section title="The problem">
          <Prose value={caseStudy.problem} />
        </Section>
      ) : null}

      {caseStudy.approach ? (
        <Section title="What I did">
          <Prose value={caseStudy.approach} />
        </Section>
      ) : null}

      {caseStudy.outcome ? (
        <Section title="The outcome">
          <Prose value={caseStudy.outcome} />
        </Section>
      ) : null}

      {/* Shown only while the write-up is genuinely missing. Saying so is better
       * than padding the page with invented detail. */}
      {!caseStudy.isWritten ? (
        <aside className="mt-14 rounded-xl border border-line bg-surface p-6 text-step--1 text-ink-muted">
          A full write-up of this project — the brief, the technical decisions
          and the outcome — is in progress.
        </aside>
      ) : null}
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="eyebrow">{title}</h2>
      <div className="measure mt-4 text-step-0 leading-relaxed">{children}</div>
    </section>
  );
}

/** Role, timeline, stack — only the rows that have content. */
function Facts({ project }: { project: Project }) {
  const rows: Array<{ label: string; value: string }> = [];
  if (project.caseStudy.role)
    rows.push({ label: 'Role', value: project.caseStudy.role });
  if (project.caseStudy.timeline)
    rows.push({ label: 'Timeline', value: project.caseStudy.timeline });
  if (project.caseStudy.client)
    rows.push({ label: 'Client', value: project.caseStudy.client });
  if (project.tags.length)
    rows.push({ label: 'Built with', value: project.tags.join(', ') });
  if (project.designCredit)
    rows.push({ label: 'Design by', value: project.designCredit });

  if (rows.length === 0) return null;

  return (
    <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="eyebrow">{row.label}</dt>
          <dd className="mt-1.5">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
