import { useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { HexColorPicker } from 'react-colorful'
import { TbCheck } from 'react-icons/tb'

const predefinedColors = [
  { name: 'Primary Blue', value: '#0d6efd' },
  { name: 'Success Green', value: '#198754' },
  { name: 'Danger Red', value: '#dc3545' },
  { name: 'Warning Yellow', value: '#ffc107' },
  { name: 'Info Cyan', value: '#0dcaf0' },
  { name: 'Purple', value: '#6f42c1' },
  { name: 'Pink', value: '#d63384' },
  { name: 'Orange', value: '#fd7e14' },
  { name: 'Teal', value: '#20c997' },
  { name: 'Indigo', value: '#6610f2' },
  { name: 'Dark Blue', value: '#0b5ed7' },
  { name: 'Dark Green', value: '#146c43' },
  { name: 'Dark Red', value: '#b02a37' },
  { name: 'Gray', value: '#6c757d' },
  { name: 'Dark Gray', value: '#495057' },
  { name: 'Light Gray', value: '#adb5bd' },
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [hexColor, setHexColor] = useState(value)
  const [isValid, setIsValid] = useState(true)

  const handleColorChange = (hex: string) => {
    setHexColor(hex)
    onChange(hex)

    setIsValid(true)
  }

  return (
    <div>
      <Form.Label>Project Color</Form.Label>
      <div className="d-flex gap-2">
        <HexColorPicker color={hexColor} onChange={handleColorChange} />
        <div
          className="rounded"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: hexColor,
            border: '2px solid #dee2e6',
          }}
        />
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter project name"
            value={hexColor}
            onChange={(e) => handleColorChange(e.target.value)}
            isInvalid={!isValid}
            maxLength={50}
          />
          <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>
      </div>
      <Form.Text className="text-muted">Choose a color to represent your project</Form.Text>
    </div>
  )
}

export default ColorPicker
