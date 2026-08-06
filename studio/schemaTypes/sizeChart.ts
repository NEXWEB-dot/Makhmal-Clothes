import { defineField, defineType } from 'sanity'

/**
 * sizeChart — one document per category.
 * The admin picks a category (matching the product schema), fills in a title,
 * adds an optional description, then builds rows dynamically.
 *
 * Each row has a size name (XS / S / M / L / XL …) and an array of
 * column-value pairs so that every category can have its own measurement columns
 * (e.g. Kurtis → Shoulder/Chest/Length/Sleeve; Bottoms → Waist/Length).
 */
export const sizeChart = defineType({
  name: 'sizeChart',
  title: 'Size Chart',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (internal label)',
      type: 'string',
      description: 'e.g. "Corset Kurtis Size Chart" — for your reference only, not shown to customers.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Which product category does this chart apply to? Must match the product category exactly.',
      options: {
        list: [
          { title: 'Corset Kurtis',       value: 'Corset Kurtis' },
          { title: 'Printed Kurtis',       value: 'Printed Kurtis' },
          { title: 'Bottoms',              value: 'Bottoms' },
          { title: 'Duppatas',             value: 'Duppatas' },
          { title: 'Luxe wear',            value: 'Luxe wear' },
          { title: 'Farshi shalwar set',   value: 'Farshi shalwar set' },
          { title: 'Angrakhas',            value: 'Angrakhas' },
          { title: 'Basic Kurtis',         value: 'Basic Kurtis' },
          { title: 'Unstitched',           value: 'Unstitched' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description (shown above table)',
      type: 'string',
      description: 'Optional note shown under the "Size Guide" heading, e.g. "All measurements are in inches."',
    }),

    defineField({
      name: 'columnHeaders',
      title: 'Column Headers',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Define the column headers for this chart. The first column is always "Size". Add your measurement columns here, e.g. Shoulder, Chest, Length, Sleeve.',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'rows',
      title: 'Size Rows',
      type: 'array',
      description: 'Add one entry per size (XS, S, M, L, XL, etc.).',
      of: [
        {
          type: 'object',
          name: 'sizeRow',
          title: 'Size Row',
          fields: [
            defineField({
              name: 'sizeName',
              title: 'Size',
              type: 'string',
              description: 'e.g. XS, S, M, L, XL, XXL',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'values',
              title: 'Measurement Values',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Enter values in the same order as your Column Headers above. e.g. 14", 18.5", 30", 21"',
            }),
          ],
          preview: {
            select: {
              title: 'sizeName',
              subtitle: 'values',
            },
            prepare({ title, subtitle }) {
              const vals = Array.isArray(subtitle) ? subtitle.join('  |  ') : ''
              return { title, subtitle: vals }
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Chart',
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category set',
      }
    },
  },
})
