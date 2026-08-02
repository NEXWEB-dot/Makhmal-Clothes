import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
      initialValue: 'MONOCHROME MUST-HAVES'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Text',
      type: 'string',
      validation: (rule) => rule.required(),
      initialValue: 'Shop Now'
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero CTA Link URL',
      type: 'string',
      validation: (rule) => rule.required(),
      initialValue: 'clothes.html'
    }),
  ],
})
