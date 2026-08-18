import { describe, expect, it } from 'vitest';
import {
  breadcrumbSchema,
  graph,
  homeGraph,
  personSchema,
  projectSchema,
  websiteSchema,
} from './jsonld';
import type { Project } from './sanity/types';

const project: Project = {
  id: 'p1',
  slug: 'kairos',
  name: 'Kairos',
  designCredit: 'DBL Media',
  liveUrl: 'https://kairos-re.net/',
  liveUrlOffline: false,
  repoUrl: null,
  summary: 'Wordpress Site, Real Estate site.',
  image: {
    url: 'https://cdn.sanity.io/img.png',
    width: 573,
    height: 336,
    lqip: null,
    alt: null,
  },
  tags: ['CSS', 'HTML5'],
  featured: false,
  caseStudy: {
    role: null,
    timeline: null,
    client: null,
    problem: null,
    approach: null,
    outcome: null,
    metrics: [],
    isWritten: false,
  },
};

/** Every URL in structured data has to be absolute to be usable. */
function allUrls(value: unknown, found: string[] = []): string[] {
  if (typeof value === 'string') {
    if (value.startsWith('/')) found.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => allUrls(v, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => allUrls(v, found));
  }
  return found;
}

describe('personSchema', () => {
  it('links the profiles that let a search engine confirm identity', () => {
    const person = personSchema(['Shopify']);
    expect(person.sameAs).toEqual([
      'https://github.com/jpulidev',
      'https://www.linkedin.com/in/joseclementepulido/',
      'https://www.instagram.com/jpulidev/',
    ]);
    expect(person.knowsAbout).toEqual(['Shopify']);
    expect(person['@id']).toBe('https://jpulidev.com/#person');
  });
});

describe('websiteSchema', () => {
  it('points its publisher at the person node by id', () => {
    expect(websiteSchema().publisher).toEqual({
      '@id': 'https://jpulidev.com/#person',
    });
  });
});

describe('projectSchema', () => {
  it('describes the work and credits the person node', () => {
    const schema = projectSchema(project);
    expect(schema['@type']).toBe('CreativeWork');
    expect(schema.name).toBe('Kairos');
    expect(schema.url).toBe('https://jpulidev.com/projects/kairos');
    expect(schema.creator).toEqual({ '@id': 'https://jpulidev.com/#person' });
    expect(schema.sameAs).toBe('https://kairos-re.net/');
    expect(schema.keywords).toBe('CSS, HTML5');
  });

  it('omits fields with nothing behind them rather than emitting empties', () => {
    const bare = projectSchema({
      ...project,
      summary: null,
      image: null,
      liveUrl: null,
    });
    expect(bare).not.toHaveProperty('description');
    expect(bare).not.toHaveProperty('image');
    expect(bare).not.toHaveProperty('sameAs');
    // No invented date: the CMS has none, and a guess is worse than nothing.
    expect(bare).not.toHaveProperty('dateCreated');
  });
});

describe('breadcrumbSchema', () => {
  it('numbers positions from one and uses absolute urls', () => {
    const crumbs = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
    ]) as { itemListElement: Array<{ position: number; item: string }> };
    expect(crumbs.itemListElement.map((c) => c.position)).toEqual([1, 2]);
    expect(crumbs.itemListElement[1].item).toBe(
      'https://jpulidev.com/projects',
    );
  });
});

describe('graph', () => {
  it('wraps nodes with a context', () => {
    const g = graph([{ '@type': 'Thing' }]);
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(1);
  });
});

describe('no relative urls anywhere', () => {
  it('home graph', () => {
    expect(allUrls(homeGraph(['Shopify']))).toEqual([]);
  });
  it('project graph', () => {
    expect(
      allUrls(
        graph([
          projectSchema(project),
          breadcrumbSchema([{ name: 'Home', path: '/' }]),
        ]),
      ),
    ).toEqual([]);
  });
});
