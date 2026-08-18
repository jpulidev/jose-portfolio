import { describe, expect, it } from 'vitest';
import {
  dedupeTagNames,
  isUsableSlug,
  normalizeNotes,
  normalizeProjects,
  normalizeTags,
  projectHasTag,
} from './normalize';
import type { RawNote, RawTag, RawWork } from './types';

/**
 * These tests pin down two things: the defects the normaliser absorbs, and the
 * legacy fallbacks that let content migrate one document at a time.
 *
 * Each defect case mirrors real data in the `xom53qc4` production dataset — if
 * someone "cleans up" the normaliser without fixing the CMS, these fail.
 */

function work(overrides: Partial<RawWork> = {}): RawWork {
  return {
    _id: 'id-1',
    name: 'Example',
    legacySlug: null,
    liveUrl: null,
    repoUrl: null,
    summary: null,
    legacySummary: null,
    designCredit: null,
    client: null,
    role: null,
    timeline: null,
    featured: null,
    order: null,
    problem: null,
    approach: null,
    outcome: null,
    metrics: null,
    imageUrl: 'https://cdn.sanity.io/img.png',
    imageAlt: null,
    imageDimensions: { width: 1200, height: 705 },
    imageLqip: 'data:image/jpeg;base64,abc',
    tagNames: ['Shopify'],
    ...overrides,
  };
}

/** A block of portable text, minimal but structurally valid. */
const block = (text: string) => ({
  _type: 'block' as const,
  children: [{ _type: 'span' as const, text }],
});

describe('isUsableSlug', () => {
  it('accepts real slugs', () => {
    expect(isUsableSlug('kairos')).toBe(true);
    expect(isUsableSlug('the-weaver-adjustment-group')).toBe(true);
  });

  it('rejects the live URLs older documents store in the slug field', () => {
    expect(isUsableSlug('https://kairos-re.net/')).toBe(false);
    expect(isUsableSlug('http://avilabistro.us/')).toBe(false);
  });

  it('rejects empty and structurally invalid values', () => {
    expect(isUsableSlug(null)).toBe(false);
    expect(isUsableSlug('  ')).toBe(false);
    expect(isUsableSlug('has spaces')).toBe(false);
    expect(isUsableSlug('a/b')).toBe(false);
  });
});

describe('normalizeProjects — slug resolution', () => {
  it('derives a slug when the CMS field still holds a URL', () => {
    const [project] = normalizeProjects([
      work({ name: "Pet's Table", legacySlug: 'https://petstable.mx/' }),
    ]);
    expect(project.slug).toBe('pets-table');
  });

  it('uses the CMS slug once it has been fixed to a real slug', () => {
    const [project] = normalizeProjects([
      work({ name: 'Some Long Marketing Name', legacySlug: 'kairos' }),
    ]);
    expect(project.slug).toBe('kairos');
  });

  it('suffixes colliding slugs so routes stay unique', () => {
    const projects = normalizeProjects([
      work({ _id: 'a', name: 'Muna' }),
      work({ _id: 'b', name: 'muna' }),
      work({ _id: 'c', name: 'MUNA' }),
    ]);
    expect(projects.map((p) => p.slug)).toEqual(['muna', 'muna-2', 'muna-3']);
  });
});

describe('normalizeProjects — legacy fallbacks', () => {
  it('prefers the explicit liveUrl but falls back to the legacy slug', () => {
    expect(
      normalizeProjects([work({ legacySlug: 'https://old.example/' })])[0]
        .liveUrl,
    ).toBe('https://old.example/');

    expect(
      normalizeProjects([
        work({
          legacySlug: 'https://old.example/',
          liveUrl: 'https://new.example/',
        }),
      ])[0].liveUrl,
    ).toBe('https://new.example/');
  });

  it('prefers the new summary but falls back to the legacy one', () => {
    expect(
      normalizeProjects([work({ legacySummary: 'Wordpress Site' })])[0].summary,
    ).toBe('Wordpress Site');

    expect(
      normalizeProjects([
        work({ legacySummary: 'Wordpress Site', summary: 'A better line' }),
      ])[0].summary,
    ).toBe('A better line');
  });

  it('prefers the designCredit field but falls back to parsing the name', () => {
    expect(
      normalizeProjects([work({ name: 'Kairos (Design by DBL Media)' })])[0]
        .designCredit,
    ).toBe('DBL Media');

    const [explicit] = normalizeProjects([
      work({ name: 'Kairos (Design by DBL Media)', designCredit: 'Someone' }),
    ]);
    expect(explicit.designCredit).toBe('Someone');
    // The name is still cleaned regardless of where the credit came from.
    expect(explicit.name).toBe('Kairos');
  });

  it('normalises empty-ish summaries to null', () => {
    expect(
      normalizeProjects([work({ summary: '   ', legacySummary: null })])[0]
        .summary,
    ).toBeNull();
  });
});

describe('offline live URLs', () => {
  it('drops the link and flags it for sites known to be down', () => {
    // Checked manually 2026-08-17: the domain no longer resolves.
    const [dead] = normalizeProjects([
      work({ legacySlug: 'https://beamena.com/' }),
    ]);
    expect(dead.liveUrl).toBeNull();
    expect(dead.liveUrlOffline).toBe(true);
  });

  it('matches with or without a www prefix', () => {
    const [dead] = normalizeProjects([
      work({ liveUrl: 'https://www.shopimmer.com/' }),
    ]);
    expect(dead.liveUrlOffline).toBe(true);
  });

  it('leaves live sites alone', () => {
    // qualitylawyers.es refuses curl but loads in a browser — it is not down.
    const [ok] = normalizeProjects([
      work({ liveUrl: 'http://qualitylawyers.es/' }),
    ]);
    expect(ok.liveUrl).toBe('http://qualitylawyers.es/');
    expect(ok.liveUrlOffline).toBe(false);
  });

  it('is false when there is no URL at all', () => {
    const [none] = normalizeProjects([work({ legacySlug: null })]);
    expect(none.liveUrl).toBeNull();
    expect(none.liveUrlOffline).toBe(false);
  });
});

describe('normalizeProjects — urls and images', () => {
  it('rejects urls that are not http(s)', () => {
    expect(
      normalizeProjects([work({ liveUrl: 'javascript:alert(1)' })])[0].liveUrl,
    ).toBe(null);
    expect(normalizeProjects([work({ liveUrl: 'not a url' })])[0].liveUrl).toBe(
      null,
    );
    expect(
      normalizeProjects([work({ repoUrl: 'ftp://x.example' })])[0].repoUrl,
    ).toBe(null);
  });

  it('drops an image that has no usable dimensions', () => {
    // Without width/height there is nothing to reserve space with, and a
    // dimensionless next/image would throw at render time.
    expect(
      normalizeProjects([work({ imageDimensions: null })])[0].image,
    ).toBeNull();
    expect(
      normalizeProjects([work({ imageDimensions: { width: 0, height: 0 } })])[0]
        .image,
    ).toBeNull();
    expect(normalizeProjects([work({ imageUrl: null })])[0].image).toBeNull();
  });

  it('keeps dimensions, blur placeholder and alt text', () => {
    const [project] = normalizeProjects([work({ imageAlt: 'A storefront' })]);
    expect(project.image).toEqual({
      url: 'https://cdn.sanity.io/img.png',
      width: 1200,
      height: 705,
      lqip: 'data:image/jpeg;base64,abc',
      alt: 'A storefront',
    });
  });

  it('survives null tag entries', () => {
    const [project] = normalizeProjects([
      work({ tagNames: ['Shopify', null, '  ', 'CSS'] }),
    ]);
    expect(project.tags).toEqual(['CSS', 'Shopify']);
  });
});

describe('normalizeProjects — case study', () => {
  it('is not "written" when there is no prose', () => {
    const [project] = normalizeProjects([work({ role: 'Sole developer' })]);
    expect(project.caseStudy.role).toBe('Sole developer');
    expect(project.caseStudy.isWritten).toBe(false);
  });

  it('needs the approach section, not just a problem statement', () => {
    // A case study that states a problem but never says what was done explains
    // nothing, so it does not count as written.
    const [onlyProblem] = normalizeProjects([
      work({ problem: [block('It was slow.')] }),
    ]);
    expect(onlyProblem.caseStudy.isWritten).toBe(false);

    const [withApproach] = normalizeProjects([
      work({
        problem: [block('It was slow.')],
        approach: [block('Rebuilt the templates.')],
      }),
    ]);
    expect(withApproach.caseStudy.isWritten).toBe(true);
  });

  it('treats an empty array the same as a missing section', () => {
    const [project] = normalizeProjects([
      work({ approach: [], problem: [], outcome: [] }),
    ]);
    expect(project.caseStudy.approach).toBeNull();
    expect(project.caseStudy.isWritten).toBe(false);
  });

  it('keeps only metrics that have both a label and a value', () => {
    const [project] = normalizeProjects([
      work({
        metrics: [
          { label: 'Load time', value: '1.2s' },
          { label: 'Incomplete', value: null },
          { label: null, value: '99%' },
          { label: '  ', value: '  ' },
        ],
      }),
    ]);
    expect(project.caseStudy.metrics).toEqual([
      { label: 'Load time', value: '1.2s' },
    ]);
  });

  it('defaults featured to false rather than null', () => {
    expect(normalizeProjects([work()])[0].featured).toBe(false);
    expect(normalizeProjects([work({ featured: true })])[0].featured).toBe(
      true,
    );
  });
});

describe('dedupeTagNames', () => {
  it('merges .js variants and sorts alphabetically', () => {
    expect(dedupeTagNames(['React.js', 'React', 'CSS'])).toEqual([
      'CSS',
      'React.js',
    ]);
  });
});

describe('normalizeTags', () => {
  const tag = (id: string, name: string, useCount: number): RawTag => ({
    _id: id,
    name,
    shopify: null,
    useCount,
  });

  it('drops tags no project references', () => {
    const projects = normalizeProjects([work({ tagNames: ['Shopify'] })]);
    const tags = normalizeTags(
      [
        tag('t1', 'Shopify', 1),
        tag('t2', 'Sanity Studio Backend', 0),
        tag('t3', 'Node.js', 0),
      ],
      projects,
    );
    expect(tags.map((t) => t.name)).toEqual(['Shopify']);
  });

  it('labels a merged tag with the spelling projects actually use', () => {
    // The dataset has a "React" doc referenced twice and an orphan "React.js".
    // Preferring the longer name would wrongly surface "React.js".
    const projects = normalizeProjects([
      work({ _id: 'a', name: 'A', tagNames: ['React'] }),
      work({ _id: 'b', name: 'B', tagNames: ['React'] }),
    ]);
    const tags = normalizeTags(
      [tag('t1', 'React.js', 0), tag('t2', 'React', 2)],
      projects,
    );
    expect(tags).toHaveLength(1);
    expect(tags[0].name).toBe('React');
    expect(tags[0].slug).toBe('react');
    expect(tags[0].count).toBe(2);
  });

  it('orders by count, then name', () => {
    const projects = normalizeProjects([
      work({ _id: 'a', name: 'A', tagNames: ['Shopify', 'CSS'] }),
      work({ _id: 'b', name: 'B', tagNames: ['Shopify'] }),
    ]);
    const tags = normalizeTags(
      [tag('t1', 'CSS', 1), tag('t2', 'Shopify', 2)],
      projects,
    );
    expect(tags.map((t) => [t.name, t.count])).toEqual([
      ['Shopify', 2],
      ['CSS', 1],
    ]);
  });

  it('preserves the Shopify flag across merged duplicates', () => {
    const projects = normalizeProjects([work({ tagNames: ['Liquid'] })]);
    const tags = normalizeTags(
      [
        { _id: 't1', name: 'Liquid', shopify: false, useCount: 1 },
        { _id: 't2', name: 'Liquid', shopify: true, useCount: 0 },
      ],
      projects,
    );
    expect(tags[0].isShopify).toBe(true);
  });
});

describe('projectHasTag', () => {
  it('matches across spelling variants and case', () => {
    const [project] = normalizeProjects([work({ tagNames: ['React'] })]);
    expect(projectHasTag(project, 'React.js')).toBe(true);
    expect(projectHasTag(project, 'react')).toBe(true);
    expect(projectHasTag(project, 'Redux')).toBe(false);
  });
});

describe('normalizeNotes', () => {
  const note = (overrides: Partial<RawNote> = {}): RawNote => ({
    _id: 'n1',
    name: 'Hobbies',
    slug: 'hobbies',
    description: 'I love barbecues.',
    imageUrl: 'https://cdn.sanity.io/n.png',
    imageAlt: null,
    imageDimensions: { width: 800, height: 600 },
    imageLqip: null,
    ...overrides,
  });

  it('keeps notes that have a title and a body', () => {
    const [result] = normalizeNotes([note()]);
    expect(result.title).toBe('Hobbies');
    expect(result.body).toBe('I love barbecues.');
  });

  it('drops notes missing a title or body', () => {
    expect(normalizeNotes([note({ name: '  ' })])).toHaveLength(0);
    expect(normalizeNotes([note({ description: null })])).toHaveLength(0);
  });

  it('falls back to a derived slug when the CMS slug is missing', () => {
    expect(
      normalizeNotes([note({ slug: null, name: 'The Journey' })])[0].slug,
    ).toBe('the-journey');
  });
});
