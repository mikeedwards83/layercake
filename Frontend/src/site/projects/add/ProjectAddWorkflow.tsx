import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Workflow, type WorkflowStep } from '@/components/Workflow';
import { IconSelector } from '@/components/IconSelector';
import { ColorPicker } from '@/components/ColorPicker';

interface ProjectData {
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
}

interface AddProjectWorkflowProps {
  onComplete: (data: ProjectData) => void;
  onCancel: () => void;
}

// Fake user data
const fakeUsers = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com' },
  { id: '4', name: 'Sarah Williams', email: 'sarah.williams@example.com' },
  { id: '5', name: 'David Brown', email: 'david.brown@example.com' },
  { id: '6', name: 'Emily Davis', email: 'emily.davis@example.com' },
];

export const AddProjectWorkflow = ({ onComplete, onCancel }: AddProjectWorkflowProps) => {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    icon: 'Folder',
    color: '#0d6efd',
    ownerId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectData, string>>>({});

  const updateProjectData = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof ProjectData, string>> = {};

    if (!projectData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (projectData.name.length > 50) {
      newErrors.name = 'Project name must be 50 characters or less';
    }

    if (!projectData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (projectData.description.length > 300) {
      newErrors.description = 'Description must be 300 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof ProjectData, string>> = {};

    if (!projectData.ownerId) {
      newErrors.ownerId = 'Project owner is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validateStep2()) {
      onComplete(projectData);
    }
  };

  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Project Details',
      description: 'Basic information about your project',
      content: (
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
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {projectData.name.length}/50 characters
                  </Form.Text>
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
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {projectData.description.length}/300 characters
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <IconSelector
                  value={projectData.icon}
                  onChange={(icon) => updateProjectData('icon', icon)}
                  color={projectData.color}
                />
              </Col>

              <Col md={12}>
                <ColorPicker
                  value={projectData.color}
                  onChange={(color) => updateProjectData('color', color)}
                />
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Team',
      description: 'Assign project owner',
      content: (
        <div>
          <h5 className="mb-4">Team Assignment</h5>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    Project Owner <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={projectData.ownerId}
                    onChange={(e) => updateProjectData('ownerId', e.target.value)}
                    isInvalid={!!errors.ownerId}
                  >
                    <option value="">Select a project owner</option>
                    {fakeUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.ownerId}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Select the person who will be responsible for this project
                  </Form.Text>
                </Form.Group>
              </Col>

              {projectData.ownerId && (
                <Col md={12}>
                  <div className="alert alert-info">
                    <h6 className="alert-heading mb-2">Selected Owner</h6>
                    <p className="mb-0">
                      <strong>{fakeUsers.find(u => u.id === projectData.ownerId)?.name}</strong>
                      <br />
                      <small className="text-muted">
                        {fakeUsers.find(u => u.id === projectData.ownerId)?.email}
                      </small>
                    </p>
                  </div>
                </Col>
              )}

              <Col md={12}>
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-3">Project Summary</h6>
                  <Row>
                    <Col md={6}>
                      <div className="mb-2">
                        <small className="text-muted">Project Name:</small>
                        <div className="fw-semibold">{projectData.name || '-'}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Description:</small>
                        <div className="text-truncate" title={projectData.description}>
                          {projectData.description || '-'}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <small className="text-muted">Icon & Color:</small>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded"
                            style={{
                              width: '32px',
                              height: '32px',
                              backgroundColor: projectData.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>
                              {projectData.icon}
                            </span>
                          </div>
                          <span>{projectData.color}</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <Workflow
      title="Add New Project"
      steps={steps}
      onComplete={handleComplete}
      onCancel={onCancel}
      completionButtonText="Create Project"
    />
  );
};

export default AddProjectWorkflow;
