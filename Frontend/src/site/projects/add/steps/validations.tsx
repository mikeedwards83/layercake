import * as Yup from 'yup'
import { ValidationErrors } from '@/constants'

export const step1Schema = Yup.object().shape({
  name: Yup.string().trim().required(ValidationErrors.PROJECT.NAME.REQUIRED).max(50, ValidationErrors.PROJECT.NAME.MAX_LENGTH),
  key: Yup.string()
    .trim()
    .required(ValidationErrors.PROJECT.KEY.REQUIRED)
    .max(10, ValidationErrors.PROJECT.KEY.MAX_LENGTH)
    .matches(/^[A-Z0-9]+$/, ValidationErrors.PROJECT.KEY.INVALID_FORMAT),
  description: Yup.string().trim().required(ValidationErrors.PROJECT.DESCRIPTION.REQUIRED).max(300, 'Description must be 300 characters or less'),
  icon: Yup.string().required(ValidationErrors.PROJECT.ICON.REQUIRED),
  color: Yup.string().required(ValidationErrors.PROJECT.COLOR.REQUIRED),
  ownerId: Yup.string().required(ValidationErrors.PROJECT.OWNER.REQUIRED),
})