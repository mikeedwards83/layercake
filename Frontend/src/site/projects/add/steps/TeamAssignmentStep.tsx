import { Form, Row, Col } from 'react-bootstrap';

interface ProjectData {
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface TeamAssignmentStepProps {
  projectData: ProjectData;
  errors: Partial<Record<keyof ProjectData, string>>;
  updateProjectData: (field: keyof ProjectData, value: string) => void;
  users: User[];
}

export const TeamAssignmentStep = ({ projectData, errors, updateProjectData, users }: TeamAssignmentStepProps) => {
  return (
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
                {users.map((user) => (
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
                  <strong>{users.find(u => u.id === projectData.ownerId)?.name}</strong>
                  <br />
                  <small className="text-muted">
                    {users.find(u => u.id === projectData.ownerId)?.email}
                  </small>
                </p>
              </div>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};
