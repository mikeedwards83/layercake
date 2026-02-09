/**
 * Context Hook Validation Errors
 *
 * Errors thrown when context hooks are used outside their providers.
 */
export const ContextErrors = {
  ERROR: {
    MISSING_PROVIDER: 'useError must be used within ErrorProvider',
  },
  NOTIFICATION: {
    MISSING_PROVIDER: 'useNotification must be used within NotificationProvider',
  },
  LAYOUT: {
    MISSING_PROVIDER: 'useLayout must be used within LayoutProvider',
  },
  KANBAN: {
    MISSING_PROVIDER: 'useKanban must be used within KanbanProvider',
  },
} as const
