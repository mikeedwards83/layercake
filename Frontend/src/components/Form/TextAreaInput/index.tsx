import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { generateId } from '../formhelps'

interface TextAreaProps {
  error?: string
  label: string
  required: boolean
  value?: string
  onChange: (value?: string) => void
  maxChars: number,
  placeholder:string,
  hint?:string
  rows?:number
}

export const TextAreaInput = ({ error, label, placeholder, required = false, value, onChange, maxChars, hint, rows=4 }: TextAreaProps) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined)

  const handleOnChange = (value?: string) => {
    setCurrentValue(value);
    onChange(value)
  }

  const id = generateId(label);

  return (
    <Form.Group>
      <Form.Label htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        id={id}
        as="textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        isInvalid={!!error}
        maxLength={maxChars}
        rows={rows}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Form.Text className="text-muted">{currentValue?.length ?? 0}/{maxChars} characters {hint && " - "+hint}</Form.Text>
    </Form.Group>
  )
}
