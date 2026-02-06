import { Form, Row, Col } from 'react-bootstrap'
import { TextInput } from '@/components/Form/TextInput'
import type { IUserCreateRequest } from '@/services/users/usersApiClient'

interface UserAddStep1Props {
  userData: IUserCreateRequest
  errors: Partial<Record<keyof IUserCreateRequest, string>>
  updateUserData: (field: keyof IUserCreateRequest, value: string | undefined) => void
}

export const UserAddStep1 = ({ userData, errors, updateUserData }: UserAddStep1Props) => {
  return (
    <div>
      <Form>
        <Row className="g-3">
          <Col md={12}>
            <TextInput
              label="Email"
              placeholder="Enter user's email address"
              maxChars={256}
              onChange={(value) => updateUserData('email', value)}
              error={errors.email}
              value={userData.email}
              required
            />
          </Col>
          <Col md={6}>
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              maxChars={100}
              onChange={(value) => updateUserData('firstName', value)}
              error={errors.firstName}
              value={userData.firstName}
              required
            />
          </Col>
          <Col md={6}>
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              maxChars={100}
              onChange={(value) => updateUserData('lastName', value)}
              error={errors.lastName}
              value={userData.lastName}
              required
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
