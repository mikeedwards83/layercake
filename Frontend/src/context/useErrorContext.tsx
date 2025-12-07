import { createContext, useContext, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useNotificationContext } from './useNotificationContext'

interface ErrorContextType {
    showError: (error: Error | string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export const useError = () => {
    const context = useContext(ErrorContext)
    if (!context) {
        throw new Error('useError must be used within ErrorProvider')
    }
    return context
}

interface ErrorProviderProps {
    children: ReactNode
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
    const { showNotification } = useNotificationContext()

    const showError = useCallback((error: Error | string) => {
        const message = error instanceof Error ? error.message : error
        showNotification({
            title: 'Error',
            message,
            variant: 'danger',
            delay: 5000
        })
    }, [showNotification])

    useEffect(() => {
        // Global error handler for uncaught errors
        const handleError = (event: ErrorEvent) => {
            event.preventDefault()
            showError(event.error || event.message)
        }

        // Global handler for unhandled promise rejections
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            event.preventDefault()
            const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
            showError(error)
        }

        window.addEventListener('error', handleError)
        window.addEventListener('unhandledrejection', handleUnhandledRejection)

        return () => {
            window.removeEventListener('error', handleError)
            window.removeEventListener('unhandledrejection', handleUnhandledRejection)
        }
    }, [showError])

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
        </ErrorContext.Provider>
    )
}
