import * as Yup from 'yup'

export function serverPostValidationHandler(error: unknown, setValidationErrors: (errors: Record<string, string[]>) => void): boolean {
  console.error('Error making request')
  // Handle validation errors from the server
  if (error instanceof Error && 'status' in error && error.status == 400) {
    console.error('Error status', error.status)

    const validationError = error as Error & { status: number; validationErrors: Record<string, string[]> }

    if (validationError.status === 400 && validationError.validationErrors) {
      setValidationErrors(validationError.validationErrors)
    }

    return false
  }

  // For other errors, re-throw
  throw error
}

export function clientValidationHandler<T>(err: unknown, setErrors: (errors: Partial<Record<keyof T, string>>) => void): boolean {
  if (err instanceof Yup.ValidationError) {
    const validationErrors: Partial<Record<keyof T, string>> = {}
    err.inner.forEach((error) => {
      if (error.path) {
        validationErrors[error.path as keyof T] = error.message
      }
    })
    setErrors(validationErrors)
  }
  
  return false;
}
