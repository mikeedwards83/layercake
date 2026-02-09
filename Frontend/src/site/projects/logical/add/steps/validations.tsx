import * as Yup from 'yup'
import { ValidationErrors } from '@/constants'

export const step1Schema = Yup.object().shape({
  name: Yup.string().trim().required(ValidationErrors.LOGICAL_APP.NAME.REQUIRED).max(100, ValidationErrors.LOGICAL_APP.NAME.MAX_LENGTH),
  key: Yup.string()
    .trim()
    .required(ValidationErrors.LOGICAL_APP.KEY.REQUIRED)
    .max(10, 'Key must be 10 characters or less')
    .matches(/^[A-Z0-9]+$/, 'Key must contain only uppercase letters and numbers'),
  description: Yup.string().trim().max(500, ValidationErrors.LOGICAL_APP.DESCRIPTION.MAX_LENGTH),
  ownerId: Yup.string().required(ValidationErrors.LOGICAL_APP.OWNER.REQUIRED),
  applicationTypeId: Yup.string().test(
    'application-type-required',
    ValidationErrors.LOGICAL_APP.APPLICATION_TYPE.REQUIRED,
    function (value) {
      const { customApplicationTypeName } = this.parent
      // Valid if either applicationTypeId OR customApplicationTypeName is provided
      return !!(value && value.trim()) || !!(customApplicationTypeName && customApplicationTypeName.trim())
    }
  ),
  customApplicationTypeName: Yup.string().max(100, 'Custom type must be 100 characters or less').test(
    'custom-type-required',
    'Custom application type is required',
    function (value) {
      const { applicationTypeId } = this.parent
      // Valid if either applicationTypeId OR customApplicationTypeName is provided
      return !!(applicationTypeId && applicationTypeId.trim()) || !!(value && value.trim())
    }
  ),
})
