import { Card, Row, Col } from 'react-bootstrap'
import { TbMail, TbUser } from 'react-icons/tb'
import type { IInviteDetailsResponse } from '@/services/invites/invitesApiClient'

interface Step1WelcomeProps {
  inviteDetails: IInviteDetailsResponse
}

export const Step1Welcome = ({ inviteDetails }: Step1WelcomeProps) => {
  return (
    <div>
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <TbMail size={40} className="text-primary" />
            </div>
            <h2 className="mb-3">Welcome to Layer Cake</h2>
            <p className="text-muted fs-5">
              You have been invited to join <strong>{inviteDetails.tenantName}</strong>
            </p>
          </div>

          <Card className="border mb-4">
            <Card.Body>
              <h5 className="mb-3">About Layer Cake</h5>
              <p>
                Layer Cake is a powerful platform for managing and visualizing your software architecture
                using the C4 model. It helps teams document, understand, and communicate the structure
                of their software systems through clear, hierarchical diagrams.
              </p>
              <p className="mb-0">
                With Layer Cake, you can create and manage C4 architecture diagrams, collaborate with
                your team on architectural documentation, and maintain living documentation that evolves
                with your system.
              </p>
            </Card.Body>
          </Card>

          <Card className="border bg-light-subtle">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <TbUser size={24} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Invited by</small>
                      <strong>{inviteDetails.invitedByName}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <TbMail size={24} className="text-success" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Your email</small>
                      <strong>{inviteDetails.email}</strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
