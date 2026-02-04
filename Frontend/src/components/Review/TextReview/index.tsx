import { generateId } from '@/components/Form/formhelps'
import { Form } from 'react-bootstrap'

interface TextReviewProps {
  label: string
  value?: string
}

export const TextReview = ({ label, value }: TextReviewProps) => {
  const id = generateId(label)
  return (
    <div className="mb-3">
      <Form.Label htmlFor={id} className='text-muted'>{label}</Form.Label>
      <div id={id}>{value}</div>
    </div>
  )
}
