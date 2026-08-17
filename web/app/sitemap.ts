import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/sanity/data';
import { absoluteUrl } from '@/lib/site';

/**
 * The site had no sitemap at all — /sitemap.xml returned 404. This one is
 * generated from the CMS, so a new project appears without anyone remembering
 * to add it.
 *
 * Note what is absent: the per-tag pages. Filtered views live at
 * `/projects?tag=…` now, and a filter is not a separate document worth indexing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const now = new Date();

  return [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/projects'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/cv'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
