import * as Yup from 'yup'

export const step1Schema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required('Email is required')
    .email('Invalid email format')
    .max(256, 'Email must be 256 characters or less'),
  firstName: Yup.string()
    .trim()
    .required('First name is required')
    .max(100, 'First name must be 100 characters or less'),
  lastName: Yup.string()
    .trim()
    .required('Last name is required')
    .max(100, 'Last name must be 100 characters or less'),
})
