import { Notice } from '@/components/Notice'

interface IValidationSummaryProps {
  errors?: Record<string, string[]>
}

export const ValidationSummary = ({ errors }: IValidationSummaryProps) => {
  const hasErrors = errors && Object.keys(errors).length > 0

  return (
    <>
      {hasErrors && (
        <Notice heading="Validation Errors" variant="danger">
          <p className="mb-2">Please correct the following errors:</p>
          <ul className="mb-0">
            {Object.entries(errors).map(([field, messages]) =>
              messages.map((message, index) => (
                <li key={`${field}-${index}`}>
                  <strong>{field}:</strong> {message}
                </li>
              )),
            )}
          </ul>
        </Notice>
      )}
    </>
  )
}
