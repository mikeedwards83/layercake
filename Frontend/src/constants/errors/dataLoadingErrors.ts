/**
 * Data Loading Error Messages
 *
 * Errors displayed when data fetching fails.
 */
export const DataLoadingErrors = {
  PROJECT: {
    LOAD_FAILED: 'Failed to load project. Please try again later.',
    LIST_FAILED: 'Failed to load projects. Please try again later.',
  },
  LOGICAL_APP: {
    LOAD_FAILED: 'Failed to load logical applications. Please try again later.',
  },
  WIKI_PAGE: {
    LOAD_FAILED: 'Failed to load wiki page. Please try again later.',
    LIST_FAILED: 'Failed to load wiki pages. Please try again later.',
  },
  USER: {
    LOAD_FAILED: 'Failed to load user data. Please try again later.',
    LIST_FAILED: 'Failed to load users. Please try again later.',
  },
  INVITE: {
    LOAD_FAILED: 'Failed to load invite. The invitation may have expired or is invalid.',
    VALIDATION_FAILED: 'Failed to validate invite. Please check the invite link.',
  },
} as const
