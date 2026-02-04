import * as Yup from 'yup'

export const step1Schema = Yup.object().shape({
  name: Yup.string().trim().required('Container name is required').max(100, 'Container name must be 100 characters or less'),
  key: Yup.string()
    .trim()
    .required('Container key is required')
    .max(10, 'Key must be 10 characters or less')
    .matches(/^[A-Z0-9]+$/, 'Key must contain only uppercase letters and numbers'),
  description: Yup.string().trim().max(500, 'Description must be 500 characters or less'),
  type: Yup.number().required('Container type is required').min(1, 'Container type is required'),
  icon: Yup.string().trim().max(100, 'Icon must be 100 characters or less'),
})
