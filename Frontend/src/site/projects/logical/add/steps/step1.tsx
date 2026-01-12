import { Form, Row, Col } from 'react-bootstrap'
import { UserSelectorInput } from '@/components/Form/UserSelectorInput'
import type { User } from '@/types/user'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { FormDivider } from '@/components/Form/FormDivider'
import { TextInput } from '@/components/Form/TextInput'
import { RichTextInput } from '@/components/Form/RichTextInput/RichTextInput'
import type { ILogicalApplicationsPostRequest } from '@/services/logicalApplications/logicalApplicationsApiClient'

interface LogicalApplicationAddStep1Props {
  logicalApplicationData: ILogicalApplicationsPostRequest
  errors: Partial<Record<keyof ILogicalApplicationsPostRequest, string>>
  updateLogicalApplicationData: (field: keyof ILogicalApplicationsPostRequest, value: string | undefined) => void
}

export const LogicalApplicationAddStep1 = ({ logicalApplicationData, errors, updateLogicalApplicationData }: LogicalApplicationAddStep1Props) => {
  return (
    <div>
      <Form>
        <Row className="g-3">
          <Col md={12}>
            <TextInput
              label="Name"
              placeholder="Enter logical application name"
              maxChars={100}
              onChange={(value) => updateLogicalApplicationData('name', value)}
              error={errors.name}
              value={logicalApplicationData.name}
              required
            />
          </Col>
          <Col md={12}>
            <RichTextInput
              label="Description"
              placeholder="Enter logical application description"
              onChange={(value) => updateLogicalApplicationData('description', value)}
              error={errors.description}
              value={logicalApplicationData.description}
              hint="Use the toolbar to format your text"
            />
          </Col>
          <FormDivider />
          <Col md={12}>
            <UserSelectorInput
              label="Logical Application Owner"
              onChange={function (user?: User): void {
                updateLogicalApplicationData('ownerId', user?.id)
              }}
              users={fakeUsers}
              value={logicalApplicationData.ownerId}
              error={errors.ownerId}
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
