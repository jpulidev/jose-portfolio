import { absoluteUrl, site, yearsOfExperience } from './site';
import type { Project } from './sanity/types';

/**
 * JSON-LD structured data.
 *
 * The old site emitted none at all — nothing machine-readable said who Jose is
 * or what he does. This is also the lever for the branded query
 * ("jose pulido developer"), which is the one search result that matters most:
 * it's what a recruiter types after reading a CV.
 *
 * Kept as plain objects so they can be unit-tested without a browser.
 */

type Json = Record<string, unknown>;

/** Stable @id so the graph nodes can reference each other. */
const PERSON_ID = `${site.url}/#person`;
const SITE_ID = `${site.url}/#website`;

export function personSchema(skills: string[] = []): Json {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: 'Shopify Developer & Tech Lead',
    description: site.description,
    image: absoluteUrl('/jose-pulido.jpg'),
    nationality: { '@type': 'Country', name: 'Venezuela' },
    // The profiles a search engine can use to confirm this is the same person.
    sameAs: [site.social.github, site.social.linkedin, site.social.instagram],
    knowsAbout: skills,
  };
}

export function websiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}

/**
 * A project, as a CreativeWork.
 *
 * `dateCreated` is deliberately absent: the CMS has no reliable date for these,
 * and a guessed one is worse than none.
 */
export function projectSchema(project: Project): Json {
  const schema: Json = {
    '@type': 'CreativeWork',
    '@id': absoluteUrl(`/projects/${project.slug}#work`),
    name: project.name,
    url: absoluteUrl(`/projects/${project.slug}`),
    creator: { '@id': PERSON_ID },
    keywords: project.tags.join(', '),
  };

  if (project.summary) schema.description = project.summary;
  if (project.image) schema.image = project.image.url;
  // The live site is a different resource from the case study page.
  if (project.liveUrl) schema.sameAs = project.liveUrl;
  if (project.caseStudy.role) schema.creditText = project.caseStudy.role;

  return schema;
}

/** A breadcrumb trail, so search results can show the path to a project. */
export function breadcrumbSchema(
  trail: Array<{ name: string; path: string }>,
): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * Wraps nodes into a single @graph document.
 *
 * One script tag per page with everything in it, rather than several competing
 * blocks — that is what lets the nodes cross-reference by @id.
 */
export function graph(nodes: Json[]): Json {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

/** Convenience for the home page, where the person is the subject. */
export function homeGraph(skills: string[]): Json {
  return graph([
    personSchema(skills),
    {
      ...websiteSchema(),
      about: { '@id': PERSON_ID },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${site.url}/#profilepage`,
      url: site.url,
      mainEntity: { '@id': PERSON_ID },
      // A concrete, checkable fact rather than an adjective.
      description: `${site.name} — Shopify developer and tech lead, ${yearsOfExperience()} years building for the web.`,
    },
  ]);
}
