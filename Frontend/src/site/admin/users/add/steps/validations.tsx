import * as Yup from 'yup'
import { ValidationErrors } from '@/constants'

export const step1Schema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required(ValidationErrors.USER.EMAIL.REQUIRED)
    .email(ValidationErrors.USER.EMAIL.INVALID_FORMAT)
    .max(256, 'Email must be 256 characters or less'),
  firstName: Yup.string()
    .trim()
    .required(ValidationErrors.USER.FIRST_NAME.REQUIRED)
    .max(100, 'First name must be 100 characters or less'),
  lastName: Yup.string()
    .trim()
    .required(ValidationErrors.USER.LAST_NAME.REQUIRED)
    .max(100, 'Last name must be 100 characters or less'),
})
