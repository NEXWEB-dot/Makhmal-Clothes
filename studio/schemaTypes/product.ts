import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      description: 'Is this a full set, a top/kurta, or a separate bottom? (Like Khaadi — list bottoms as their own product)',
      options: {
        list: [
          { title: 'Kurta / Top', value: 'kurta' },
          { title: 'Bottom (Trouser / Shalwar / Farshi)', value: 'bottom' },
          { title: 'Full Set (Kurta + Bottom)', value: 'set' },
          { title: 'Dupatta', value: 'dupatta' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'matchingPieces',
      title: 'Matching Pieces (Complete the Look)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Select products that complete the look (e.g. matching trousers, dupattas).',
    }),
    defineField({
      name: 'matchingBottom',
      title: 'Matching Bottom (Add-On Toggle)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Link the matching bottom (trouser/shalwar) that can be added as an optional add-on on the product page. When set, a toggle will appear on the product page letting customers add the bottom to their cart.',
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sizeStock',
          fields: [
            { name: 'size', title: 'Size', type: 'string' },
            { name: 'stock', title: 'Stock', type: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Corset Kurtis', value: 'Corset Kurtis' },
          { title: 'Printed Kurtis', value: 'Printed Kurtis' },
          { title: 'Bottoms', value: 'Bottoms' },
          { title: 'Duppatas', value: 'Duppatas' },
          { title: 'Luxe wear', value: 'Luxe wear' },
          { title: 'Farshi shalwar set', value: 'Farshi shalwar set' },
          { title: 'Angrakhas', value: 'Angrakhas' },
          { title: 'Basic Kurtis', value: 'Basic Kurtis' },
          { title: 'Unstitched', value: 'Unstitched' },
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'collectionTag',
      title: 'Collection Tag',
      type: 'string',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
})

