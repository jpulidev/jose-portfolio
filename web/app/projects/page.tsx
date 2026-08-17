import { ProjectsBrowser } from '@/components/ProjectsBrowser';
import { pageMetadata } from '@/lib/metadata';
import { getProjects, getTags } from '@/lib/sanity/data';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Projects',
  description:
    'Selected web and Shopify projects built by Jose Pulido — client stores, marketing sites and web applications, all live.',
  path: '/projects',
});

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const [projects, tags, params] = await Promise.all([
    getProjects(),
    getTags(),
    searchParams,
  ]);
  // Repeated params arrive as an array; only the first one means anything here.
  const raw = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  // Only accept a tag that exists, so a junk query can't render an empty page
  // that looks broken.
  const activeTag = tags.some((t) => t.slug === raw) ? (raw ?? null) : null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      <p className="eyebrow">Work</p>
      <h1 className="mt-4 text-step-4">Every project, still live.</h1>
      <p className="measure mt-5 text-step-1 text-ink-muted">
        {projects.length} client projects — Shopify storefronts, WordPress sites
        and web applications. Each one links to the site as it runs today.
      </p>

      <ProjectsBrowser projects={projects} tags={tags} activeTag={activeTag} />
    </div>
  );
}
