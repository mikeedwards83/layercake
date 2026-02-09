/**
 * Form Validation Error Messages
 *
 * Organized by feature and field for use in Yup validation schemas.
 */
export const ValidationErrors = {
  PROJECT: {
    NAME: {
      REQUIRED: 'Project name is required',
      MAX_LENGTH: 'Project name must be 50 characters or less',
    },
    KEY: {
      REQUIRED: 'Project key is required',
      MAX_LENGTH: 'Project key must be 10 characters or less',
      INVALID_FORMAT: 'Project key can only contain uppercase letters and numbers',
    },
    DESCRIPTION: {
      REQUIRED: 'Project description is required',
      MAX_LENGTH: 'Description must be 500 characters or less',
    },
    ICON: {
      REQUIRED: 'Project icon is required',
    },
    COLOR: {
      REQUIRED: 'Project color is required',
    },
    OWNER: {
      REQUIRED: 'Project owner is required',
    },
  },
  LOGICAL_APP: {
    NAME: {
      REQUIRED: 'Application name is required',
      MAX_LENGTH: 'Application name must be 100 characters or less',
    },
    KEY: {
      REQUIRED: 'Application key is required',
      MAX_LENGTH: 'Application key must be 20 characters or less',
      INVALID_FORMAT: 'Application key can only contain uppercase letters, numbers, hyphens, and underscores',
    },
    DESCRIPTION: {
      REQUIRED: 'Application description is required',
      MAX_LENGTH: 'Description must be 500 characters or less',
    },
    OWNER: {
      REQUIRED: 'Application owner is required',
    },
    APPLICATION_TYPE: {
      REQUIRED: 'Application type is required',
    },
    CUSTOM_TYPE: {
      REQUIRED: 'Custom type name is required when "Other" is selected',
      MAX_LENGTH: 'Custom type must be 50 characters or less',
    },
  },
  USER: {
    EMAIL: {
      REQUIRED: 'Email is required',
      INVALID_FORMAT: 'Invalid email format',
      MAX_LENGTH: 'Email must be 100 characters or less',
    },
    FIRST_NAME: {
      REQUIRED: 'First name is required',
      MAX_LENGTH: 'First name must be 50 characters or less',
    },
    LAST_NAME: {
      REQUIRED: 'Last name is required',
      MAX_LENGTH: 'Last name must be 50 characters or less',
    },
    ROLE: {
      REQUIRED: 'Role is required',
    },
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 8 characters',
    LOWERCASE: 'Password must include at least one lowercase letter',
    UPPERCASE: 'Password must include at least one uppercase letter',
    NUMBER: 'Password must include at least one number',
    SPECIAL_CHAR: 'Password must include at least one special character (!@#$%^&*)',
    CONFIRM_REQUIRED: 'Please confirm your password',
    MISMATCH: 'Passwords do not match',
  },
  WIKI_PAGE: {
    TITLE: {
      REQUIRED: 'Page title is required',
      MAX_LENGTH: 'Page title must be 100 characters or less',
    },
  },
  INVITE: {
    EMAIL: {
      REQUIRED: 'Email is required',
      INVALID_FORMAT: 'Invalid email format',
    },
    ROLE: {
      REQUIRED: 'Role is required',
    },
  },
} as const
