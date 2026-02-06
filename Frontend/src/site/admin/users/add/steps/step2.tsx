import { Row, Col, Card } from 'react-bootstrap'
import { TextReview } from '@/components/Review/TextReview'
import { Notice } from '@/components/Notice'
import type { IUserCreateRequest } from '@/services/users/usersApiClient'
import { ValidationSummary } from '@/components/Form/ValidationSummary/validationSummary'

interface UserAddStep2Props {
  userData: IUserCreateRequest
  validationErrors?: Record<string, string[]>
}

export const UserAddStep2 = ({ userData, validationErrors = {} }: UserAddStep2Props) => {
  return (
    <div>
      <Row className="g-4">
        <Col md={12}>
          <ValidationSummary errors={validationErrors} />
        </Col>
        <Col md={12}>
          <Card className="border">
            <Card.Body>
              <h4 className="mb-3 text-primary">User Details</h4>
              <Row>
                <Col md={6}>
                  <TextReview label="Email" value={userData.email} />
                </Col>
                <Col md={6}>
                  <TextReview label="Display Name" value={`${userData.firstName} ${userData.lastName}`} />
                </Col>
                <Col md={6}>
                  <TextReview label="First Name" value={userData.firstName} />
                </Col>
                <Col md={6}>
                  <TextReview label="Last Name" value={userData.lastName} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Notice heading="Ready to Create?" variant="info">
            <p className="mb-0">
              Click "Create User" below to create the user account. The user will receive an email to set their password.
            </p>
          </Notice>
        </Col>
      </Row>
    </div>
  )
}
