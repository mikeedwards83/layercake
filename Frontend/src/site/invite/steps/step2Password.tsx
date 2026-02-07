import { Form, Row, Col, Card } from 'react-bootstrap'
import { TbLock } from 'react-icons/tb'

interface Step2PasswordProps {
  password: string
  confirmPassword: string
  errors: { password?: string; confirmPassword?: string }
  onPasswordChange: (password: string) => void
  onConfirmPasswordChange: (confirmPassword: string) => void
}

export const Step2Password = ({
  password,
  confirmPassword,
  errors,
  onPasswordChange,
  onConfirmPasswordChange,
}: Step2PasswordProps) => {
  return (
    <div>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <TbLock size={40} className="text-primary" />
            </div>
            <h4 className="mb-2">Create Your Password</h4>
            <p className="text-muted">
              Choose a secure password to protect your account
            </p>
          </div>

          <Card className="border">
            <Card.Body className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 special character
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
