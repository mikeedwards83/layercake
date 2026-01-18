import * as Yup from 'yup'

export const step1Schema = Yup.object().shape({
  name: Yup.string().trim().required('Logical application name is required').max(100, 'Logical application name must be 100 characters or less'),
  key: Yup.string()
    .trim()
    .required('Logical application key is required')
    .max(10, 'Key must be 10 characters or less')
    .matches(/^[A-Z0-9]+$/, 'Key must contain only uppercase letters and numbers'),
  description: Yup.string().trim().max(500, 'Description must be 500 characters or less'),
  ownerId: Yup.string().required('Owner is required'),
  applicationTypeId: Yup.string().test(
    'application-type-required',
    'Application type is required',
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
