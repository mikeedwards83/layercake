import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void,
  label:string
}

export const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
  const [hexColor, setHexColor] = useState(value)
  const [isValid, setIsValid] = useState(true)

  const handleColorChange = (hex: string) => {
    setHexColor(hex)
    onChange(hex)

    setIsValid(true)
  }

  return (
    <div>
      <Form.Label>{label}</Form.Label>
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
