import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'productDetail',
  title: 'Product Detail',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Ready to Wear', 'Unstitched', 'Accessories', 'Luxury Pret', 'Formals'],
      },
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'string',
      options: {
        list: ['Summer 2026', 'Winter 2026', 'Festive', 'Bridal', 'New Arrivals'],
      },
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare At Price',
      type: 'number',
      description: 'Original price before discount',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'A short summary (max 200 characters)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
    }),
    defineField({
      name: 'colour',
      title: 'Colour',
      type: 'string',
    }),
    defineField({
      name: 'fit',
      title: 'Fit',
      type: 'string',
      options: {
        list: ['Regular', 'Relaxed', 'Slim', 'Oversized'],
      },
    }),
    defineField({
      name: 'pieces',
      title: 'Pieces',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'variants',
      title: 'Sizes and Inventory',
      type: 'array',
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
                  { title: 'Extra Small (XS)', value: 'XS' },
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
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isNew',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
    },
    prepare(selection) {
      const { title, media, price } = selection;
      return {
        title: title,
        subtitle: `Rs. ${price}`,
        media: media,
      };
    },
  },
});
