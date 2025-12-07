import { Icon } from '@/components/Icon'
import { icons } from '@/components/Icon/icons'
import { useState } from 'react'
import { Form } from 'react-bootstrap'


interface IconSelectorProps {
  value: string
  onChange: (iconName: string) => void
  color?: string,
  label:string
}

export const IconSelector = ({ value, onChange, color = '#000', label }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Form.Label onClick={() =>setIsOpen(true)}>{label}</Form.Label>
      <div className="position-relative">
        <div className="form-control d-flex align-items-center" style={{ cursor: 'pointer', height: '60px' }} onClick={() => setIsOpen(!isOpen)}>
          <Icon size={32} color={color} iconName={value} />
        </div>

        {isOpen && (
          <div
            className="position-absolute card mt-2 w-75 border-3 shadow"
            style={{
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2  ">
                <h6 className="mb-0">Select an Icon</h6>
                <button type="button" className="btn-close" onClick={() => setIsOpen(false)} />
              </div>
              <div className="d-grid gap-2" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(50px,50px))'}}>
                {icons.map((icon) => {
                  const IconComponent = icon.component
                  return (
                    <div key={icon.name} className='ratio ratio-1x1 d-flex justify-content-between align-items-center' style={{width:'50px'}}>
                      <div
                        title={icon.name} 
                        className={`border rounded p-2 text-center ${value === icon.name ? 'bg-primary-subtle border-primary' : ''}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => {
                          onChange(icon.name)
                          setIsOpen(false)
                        }}
                        onMouseEnter={(e) => {
                          if (value !== icon.name) {
                            e.currentTarget.style.backgroundColor = '#f8f9fa'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (value !== icon.name) {
                            e.currentTarget.style.backgroundColor = ''
                          }
                        }}>
                        <IconComponent size={24} style={{ color: value === icon.name ? color : '#6c757d' }} />
                        <div className="visually-hidden">{icon.name}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Form.Text className="text-muted">Click to select an icon for your project</Form.Text>
    </div>
  )
}

export default IconSelector
