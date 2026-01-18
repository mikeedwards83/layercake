import { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { UserSelectorInput } from '@/components/Form/UserSelectorInput'
import type { User } from '@/types/user'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { FormDivider } from '@/components/Form/FormDivider'
import { TextInput } from '@/components/Form/TextInput'
import { RichTextInput } from '@/components/Form/RichTextInput/RichTextInput'
import type { ILogicalApplicationsPostRequest } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { ApplicationTypesApiClient, type IApplicationTypeResponse } from '@/services/applicationTypes/applicationTypesApiClient'

interface LogicalApplicationAddStep1Props {
  logicalApplicationData: ILogicalApplicationsPostRequest
  errors: Partial<Record<keyof ILogicalApplicationsPostRequest, string>>
  updateLogicalApplicationData: (field: keyof ILogicalApplicationsPostRequest, value: string | undefined) => void
}

const OTHER_TYPE_VALUE = 'other'

export const LogicalApplicationAddStep1 = ({ logicalApplicationData, errors, updateLogicalApplicationData }: LogicalApplicationAddStep1Props) => {
  const [applicationTypes, setApplicationTypes] = useState<IApplicationTypeResponse[]>([])
  const [showCustomInput, setShowCustomInput] = useState(false)

  useEffect(() => {
    const loadApplicationTypes = async () => {
      try {
        const client = new ApplicationTypesApiClient()
        const data = await client.getAll()
        setApplicationTypes(data.applicationTypes)
      } catch (err) {
        console.error('Error loading application types:', err)
      }
    }

    loadApplicationTypes()
  }, [])

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (value === OTHER_TYPE_VALUE) {
      setShowCustomInput(true)
      updateLogicalApplicationData('applicationTypeId', undefined)
    } else {
      setShowCustomInput(false)
      updateLogicalApplicationData('applicationTypeId', value)
      updateLogicalApplicationData('customApplicationTypeName', undefined)
    }
  }

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
            <TextInput
              label="Key"
              placeholder="Enter logical application key (max 10 characters, automatically capitalized)"
              maxChars={10}
              onChange={(value) => {
                const upperValue = value?.toUpperCase().replace(/[^A-Z0-9]/g, '')
                updateLogicalApplicationData('key', upperValue)
              }}
              error={errors.key}
              hint="Letters and numbers only (automatically capitalized)"
              value={logicalApplicationData.key}
              required
            />
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>
                Application Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={showCustomInput ? OTHER_TYPE_VALUE : (logicalApplicationData.applicationTypeId || '')}
                onChange={handleTypeChange}
                isInvalid={!!errors.applicationTypeId}
              >
                <option value="">Select an application type</option>
                {applicationTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
                <option value={OTHER_TYPE_VALUE}>Other</option>
              </Form.Select>
              {errors.applicationTypeId && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.applicationTypeId}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          {showCustomInput && (
            <Col md={12}>
              <TextInput
                label="Custom Application Type"
                placeholder="Enter custom application type"
                maxChars={100}
                onChange={(value) => updateLogicalApplicationData('customApplicationTypeName', value)}
                error={errors.customApplicationTypeName}
                value={logicalApplicationData.customApplicationTypeName}
                required
              />
            </Col>
          )}
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
