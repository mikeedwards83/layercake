import { generateId } from '@/components/Form/formhelps'
import { Form } from 'react-bootstrap'

interface ColorReviewProps {
  label: string
  value?: string
}

export const ColorReview = ({ label, value }: ColorReviewProps) => {
  const id = generateId(label)

  return (
    <div className="mb-3">
      <Form.Label htmlFor={id} className="text-muted">
        {label}
      </Form.Label>
      <div className="d-flex align-items-center gap-2">
        <div
          className="rounded border"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: value,
          }}
        />
        <div>
          <div id={id} className="fw-semibold">{value}</div>
        </div>
      </div>
    </div>
  )
}
