import * as Yup from 'yup'

export const step1Schema = Yup.object().shape({
  name: Yup.string().trim().required('Logical application name is required').max(100, 'Logical application name must be 100 characters or less'),
  description: Yup.string().trim().max(500, 'Description must be 500 characters or less'),
  ownerId: Yup.string(),
})
