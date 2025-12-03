import { Form, Row, Col } from 'react-bootstrap'
import { IconSelector } from '@/components/IconSelector'
import { ColorPicker } from '@/components/ColorPicker'

interface ProjectData {
  name: string
  description: string
  icon: string
  color: string
  ownerId: string
}

interface ProjectDetailsStepProps {
  projectData: ProjectData
  errors: Partial<Record<keyof ProjectData, string>>
  updateProjectData: (field: keyof ProjectData, value: string) => void
}

export const ProjectDetailsStep = ({ projectData, errors, updateProjectData }: ProjectDetailsStepProps) => {
  return (
    <div>
      <h5 className="mb-4">Project Details</h5>
      <Form>
        <Row className="g-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>
                Project Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectData.name}
                onChange={(e) => updateProjectData('name', e.target.value)}
                isInvalid={!!errors.name}
                maxLength={50}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              <Form.Text className="text-muted">{projectData.name.length}/50 characters</Form.Text>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter project description"
                value={projectData.description}
                onChange={(e) => updateProjectData('description', e.target.value)}
                isInvalid={!!errors.description}
                maxLength={300}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              <Form.Text className="text-muted">{projectData.description.length}/300 characters</Form.Text>
            </Form.Group>
          </Col>

          <Col md={12}>
            <IconSelector value={projectData.icon} onChange={(icon) => updateProjectData('icon', icon)} color={projectData.color} />
          </Col>

          <Col md={12}>
            <ColorPicker value={projectData.color} onChange={(color) => updateProjectData('color', color)} />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
