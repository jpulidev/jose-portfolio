import { defineField, defineType } from 'sanity';
import { TextIcon as icon } from '@sanity/icons';

/**
 * A personal note or short essay, rendered on /about.
 *
 * The type name stays `person` and the fields keep their original names, so the
 * five existing documents keep resolving — but the title no longer says "Team",
 * which never matched the content. The entries are notes like "The Journey",
 * "Hobbies" and "A Path to Growth and Confidence".
 */
export const person = defineType({
  name: 'person',
  title: 'Notes',
  type: 'document',
  icon,

  fields: [
    defineField({
      name: 'name',
      title: 'Title',
      type: 'string',
      description: 'The note\'s heading, e.g. "A Path to Growth and Confidence".',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'Body',
      type: 'text',
      rows: 8,
      description:
        '⚠️ Check these for stale claims — one entry still says "5 years of experience". The site computes years from a single date, so any number written here will drift.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
  ],

  preview: {
    select: { title: 'name', subtitle: 'description', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? 'Untitled',
      subtitle: subtitle ? `${String(subtitle).slice(0, 70)}…` : '',
      media,
    }),
  },
});
