import { Card, Row, Col, Alert } from 'react-bootstrap'
import { TbCheck, TbMail, TbUser, TbBuilding } from 'react-icons/tb'
import type { IInviteDetailsResponse } from '@/services/invites/invitesApiClient'

interface Step3ConfirmProps {
  inviteDetails: IInviteDetailsResponse
  serverError?: string
}

export const Step3Confirm = ({ inviteDetails, serverError }: Step3ConfirmProps) => {
  return (
    <div>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <TbCheck size={40} className="text-success" />
            </div>
            <h4 className="mb-2">Confirm Your Details</h4>
            <p className="text-muted">
              Please review your information before completing your registration
            </p>
          </div>

          {serverError && (
            <Alert variant="danger" className="mb-4">
              {serverError}
            </Alert>
          )}

          <Card className="border">
            <Card.Body className="p-4">
              <Row className="g-4">
                <Col md={6}>
                  <div className="d-flex align-items-start">
                    <div
                      className="rounded bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <TbUser size={20} className="text-muted" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Full Name</small>
                      <strong>{inviteDetails.firstName} {inviteDetails.lastName}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-start">
                    <div
                      className="rounded bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <TbMail size={20} className="text-muted" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <strong>{inviteDetails.email}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-start">
                    <div
                      className="rounded bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <TbBuilding size={20} className="text-muted" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Organization</small>
                      <strong>{inviteDetails.tenantName}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-start">
                    <div
                      className="rounded bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <TbUser size={20} className="text-muted" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Invited By</small>
                      <strong>{inviteDetails.invitedByName}</strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              By clicking "Complete Registration", you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  )
}
