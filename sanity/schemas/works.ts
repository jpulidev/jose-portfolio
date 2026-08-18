import { defineArrayMember, defineField, defineType } from 'sanity';
import { DocumentsIcon as icon } from '@sanity/icons';

/**
 * A project.
 *
 * The type name stays `works` — renaming it would orphan all 24 existing
 * documents. Everything new is optional, so nothing breaks while content is
 * filled in gradually; the site falls back to the legacy fields until then.
 */
export const works = defineType({
  name: 'works',
  title: 'Projects',
  type: 'document',
  icon,

  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'caseStudy', title: 'Case study' },
    { name: 'meta', title: 'Credits & links' },
  ],

  fields: [
    defineField({
      name: 'name',
      title: 'Project name',
      type: 'string',
      group: 'basics',
      description:
        'Just the name. Put the designer in "Design credit" rather than in brackets here.',
      validation: (Rule) => Rule.required().max(80),
    }),

    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'basics',
      description:
        '⚠️ On older entries this field wrongly holds the live site URL. Click "Generate" to replace it with a real slug (e.g. "kairos"), and move the URL to "Live site URL" below. Until then the site derives a slug from the name.',
      options: { source: 'name', maxLength: 96 },
    }),

    defineField({
      name: 'image',
      title: 'Screenshot',
      type: 'image',
      group: 'basics',
      description:
        'Export at 2x (at least 1600px wide) so it stays sharp on high-density screens.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'What the screenshot shows, for screen readers.',
        }),
      ],
    }),

    defineField({
      name: 'summary',
      title: 'One-line summary',
      type: 'string',
      group: 'basics',
      description:
        'One sentence a recruiter can skim. Replaces the old free-text "Project" field.',
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'basics',
      description:
        'Featured projects get a full card and a written case study. Aim for about six — depth on a few beats a thin grid of everything.',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      group: 'basics',
      description: 'Lower numbers first. Leave empty to sort by newest.',
    }),

    defineField({
      name: 'projects',
      title: 'Technologies',
      type: 'array',
      group: 'basics',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
    }),

    // -----------------------------------------------------------------------
    // Case study — the fields that turn a nameplate into evidence
    // -----------------------------------------------------------------------

    defineField({
      name: 'role',
      title: 'Your role',
      type: 'string',
      group: 'caseStudy',
      description:
        'Be specific: "Sole developer", "Frontend lead, team of 4", "Backend + integrations".',
    }),

    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      group: 'caseStudy',
      description: 'e.g. "6 weeks, 2023" or "Ongoing since 2024".',
    }),

    defineField({
      name: 'problem',
      title: 'The problem',
      type: 'array',
      group: 'caseStudy',
      description:
        'What did the client actually need, and why was it hard? Write it so someone outside the project understands the stakes.',
      of: [defineArrayMember({ type: 'block' })],
    }),

    defineField({
      name: 'approach',
      title: 'What you did',
      type: 'array',
      group: 'caseStudy',
      description:
        'The decisions you made and why — including trade-offs and anything you rejected. This is the part that reads as senior.',
      of: [defineArrayMember({ type: 'block' })],
    }),

    defineField({
      name: 'outcome',
      title: 'The outcome',
      type: 'array',
      group: 'caseStudy',
      description: 'What changed as a result, for the client and for users.',
      of: [defineArrayMember({ type: 'block' })],
    }),

    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'caseStudy',
      description:
        'Numbers beat adjectives. Load time, conversion rate, revenue, bugs closed — whatever you can honestly claim.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g. "+38%", "1.2s", "3x".',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        }),
      ],
    }),

    // -----------------------------------------------------------------------
    // Credits & links
    // -----------------------------------------------------------------------

    defineField({
      name: 'liveUrl',
      title: 'Live site URL',
      type: 'url',
      group: 'meta',
      description:
        'Where the project is live. This is where the URL belongs — not in the slug.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Must be a full http(s) URL.',
        ),
    }),

    defineField({
      name: 'repoUrl',
      title: 'Repository URL',
      type: 'url',
      group: 'meta',
      description: 'Only if the code is public.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),

    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'meta',
    }),

    defineField({
      name: 'designCredit',
      title: 'Design credit',
      type: 'string',
      group: 'meta',
      description:
        'Who designed it, if not you. e.g. "DBL Media". Previously written in brackets inside the project name.',
    }),

    // -----------------------------------------------------------------------
    // Legacy — kept so old content still reads, hidden from the editor
    // -----------------------------------------------------------------------

    defineField({
      name: 'project',
      title: 'Summary (legacy)',
      type: 'string',
      group: 'meta',
      description:
        'Superseded by "One-line summary". Kept so existing content still renders; copy it across and leave this empty.',
      readOnly: true,
    }),

    defineField({
      name: 'imageUrl',
      title: 'Image URL (legacy, unused)',
      type: 'url',
      group: 'meta',
      readOnly: true,
      hidden: ({ value }) => !value,
    }),
  ],

  orderings: [
    {
      title: 'Featured first',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      featured: 'featured',
      summary: 'summary',
      legacySummary: 'project',
      hasCaseStudy: 'approach',
    },
    prepare({ title, media, featured, summary, legacySummary, hasCaseStudy }) {
      const written = Array.isArray(hasCaseStudy) && hasCaseStudy.length > 0;
      return {
        title: `${featured ? '★ ' : ''}${title ?? 'Untitled'}`,
        // Flags at a glance which featured projects still need writing.
        subtitle:
          summary ||
          legacySummary ||
          (featured && !written ? 'Featured — case study not written yet' : ''),
        media,
      };
    },
  },
});
