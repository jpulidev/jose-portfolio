import { defineField, defineType } from 'sanity';
import { CodeBlockIcon as icon } from '@sanity/icons';

/**
 * A technology tag.
 *
 * The type name stays `project` (the original scaffold's choice) so existing
 * references keep resolving, but the title now says what it actually is.
 *
 * Housekeeping worth doing in here: six of these are referenced by no project
 * at all — "Node", "Node.js", "React.js", "Sanity Studio Backend", plus
 * duplicate "React" and "Gatsby" documents. The site hides orphans and merges
 * the .js spelling variants, but deleting them is cleaner.
 */
export const project = defineType({
  name: 'project',
  title: 'Technologies',
  type: 'document',
  icon,

  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'Use the canonical spelling — "React", not "React.js"; "Node", not "Node.js".',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'shopify',
      title: 'Shopify-related',
      type: 'boolean',
      description: 'Groups the commerce skills together.',
      initialValue: false,
      options: { layout: 'checkbox' },
    }),
  ],

  preview: {
    select: { name: 'name', shopify: 'shopify' },
    prepare: ({ name, shopify }) => ({
      title: `${name ?? 'Untitled'} ${shopify ? '🛍' : ''}`.trim(),
    }),
  },
});
