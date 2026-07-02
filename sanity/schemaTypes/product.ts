import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'text',
      description: 'Detailed description of the product',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      description: 'Upload multiple images of the product (e.g. model wearing the clothes). The first image will be the main display image.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'variants',
      title: 'Sizes and Inventory',
      type: 'array',
      description: 'Define available sizes and their current stock quantity.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small (S)', value: 'S' },
                  { title: 'Medium (M)', value: 'M' },
                  { title: 'Large (L)', value: 'L' },
                  { title: 'Extra Large (XL)', value: 'XL' },
                ],
              },
            },
            {
              name: 'stock',
              title: 'In Stock Quantity',
              type: 'number',
              description: 'Number of items available for this size. If 0, it will show as Out of Stock.',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
          preview: {
            select: {
              title: 'size',
              subtitle: 'stock',
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              return {
                title: `Size: ${title}`,
                subtitle: subtitle > 0 ? `${subtitle} in stock` : 'Out of Stock',
              };
            },
          },
        },
      ],
    }),
  ],
});
