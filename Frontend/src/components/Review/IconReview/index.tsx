import { generateId } from '@/components/Form/formhelps'
import { Icon } from '@/components/Icon'
import { Form } from 'react-bootstrap'

interface IconReviewProps {
  label: string
  value?: string
  color: string
}

export const IconReview = ({ label, value, color }: IconReviewProps) => {
  const id = generateId(label)

  return (
    <div className="mb-3">
      <Form.Label for={id} className="text-muted">
        {label}
      </Form.Label>
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded border d-flex align-items-center justify-content-center"
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: color,
          }}>
          {value && <Icon size={32} color="#fff" iconName={value} />}
        </div>
        <div>
          {value && <div id={id} className="fw-semibold">{value}</div>}
          <small className="text-muted">Icon</small>
        </div>
      </div>
    </div>
  )
}
