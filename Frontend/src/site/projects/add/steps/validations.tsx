import * as Yup from 'yup'

export const step1Schema = Yup.object().shape({
  name: Yup.string().trim().required('Project name is required').max(50, 'Project name must be 50 characters or less'),
  key: Yup.string()
    .trim()
    .required('Project key is required')
    .max(10, 'Project key must be 10 characters or less')
    .matches(/^[A-Z0-9]+$/, 'Project key can only contain uppercase letters and numbers'),
  description: Yup.string().trim().required('Description is required').max(300, 'Description must be 300 characters or less'),
  icon: Yup.string().required('Icon is required'),
  color: Yup.string().required('Color is required'),
  ownerId: Yup.string().required('Project owner is required'),
})