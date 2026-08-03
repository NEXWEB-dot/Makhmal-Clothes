import { defineField, defineType } from 'sanity'

export const inspirationPost = defineType({
  name: 'inspirationPost',
  title: 'Inspiration Post',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'Where should this image link to? (e.g., clothes.html or an Instagram URL)',
      initialValue: 'clothes.html',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order of appearance (1, 2, 3...)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'link',
      media: 'image',
      subtitle: 'order'
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title || 'No Link',
        subtitle: `Order: ${subtitle}`,
        media,
      }
    },
  },
})
