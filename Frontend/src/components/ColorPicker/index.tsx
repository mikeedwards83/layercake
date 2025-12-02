import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { TbCheck } from 'react-icons/tb';

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
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  return (
    <div>
      <Form.Label>Project Color</Form.Label>
      <div className="position-relative">
        <div
          className="border rounded p-3 d-flex align-items-center gap-3"
          style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="rounded"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: value,
              border: '2px solid #dee2e6'
            }}
          />
          <div>
            <div className="fw-semibold">{value}</div>
            <div className="text-muted fs-sm">Click to change color</div>
          </div>
        </div>

        {isOpen && (
          <div
            className="position-absolute bg-white border rounded shadow-lg p-3 mt-2"
            style={{
              zIndex: 1000,
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Select a Color</h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsOpen(false)}
              />
            </div>

            <div className="mb-3">
              <Form.Label className="fs-sm">Predefined Colors</Form.Label>
              <Row className="g-2">
                {predefinedColors.map((color) => (
                  <Col xs={3} key={color.value}>
                    <div
                      className="position-relative rounded border"
                      style={{
                        cursor: 'pointer',
                        height: '48px',
                        backgroundColor: color.value,
                        transition: 'transform 0.2s',
                      }}
                      onClick={() => handleColorSelect(color.value)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title={color.name}
                    >
                      {value === color.value && (
                        <div
                          className="position-absolute top-50 start-50 translate-middle"
                          style={{
                            color: '#fff',
                            textShadow: '0 0 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          <TbCheck size={24} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div>
              <Form.Label className="fs-sm">Custom Color</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  style={{ width: '60px', height: '40px', padding: '4px' }}
                />
                <Form.Control
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-grow-1"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => handleColorSelect(customColor)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Form.Text className="text-muted">
        Choose a color to represent your project
      </Form.Text>
    </div>
  );
};

export default ColorPicker;
