import {defineField, defineType} from 'sanity'
import {MdLocalPlay as icon} from 'react-icons/md'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Category Name',
      validation: rule=> rule.required()
    },
    {
      name: 'description',
      type: 'string',
      title: 'Category Description',
      validation: rule=> rule.required()
    },
    {
      name: 'image',
      type: 'image',
      title: 'Category Image'
    },
  ],
})