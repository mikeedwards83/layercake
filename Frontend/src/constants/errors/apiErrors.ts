/**
 * API Client Errors
 *
 * Errors related to API communication and authentication.
 */
export const ApiErrors = {
  AUTH: {
    REQUIRED: 'Authentication required but no user is logged in',
    TOKEN_FAILED: 'Failed to get authentication token',
  },
  HTTP: {
    REQUEST_FAILED: 'Request failed',
  },
} as const
