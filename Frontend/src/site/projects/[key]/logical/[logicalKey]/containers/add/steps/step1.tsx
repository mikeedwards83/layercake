import { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { FormDivider } from '@/components/Form/FormDivider'
import { TextInput } from '@/components/Form/TextInput'
import { RichTextInput } from '@/components/Form/RichTextInput/RichTextInput'
import { IconSelector } from '@/components/Form/IconSelectorInput'
import type { IContainersPostRequest } from '@/services/containers/containersApiClient'
import { ContainerTypesApiClient } from '@/services/containers/containersApiClient'
import type { IContainerType } from '@/types/container'

interface ContainerAddStep1Props {
  containerData: IContainersPostRequest
  errors: Partial<Record<keyof IContainersPostRequest, string>>
  updateContainerData: (field: keyof IContainersPostRequest, value: string | undefined) => void
}

export const ContainerAddStep1 = ({ containerData, errors, updateContainerData }: ContainerAddStep1Props) => {
  const [containerTypes, setContainerTypes] = useState<IContainerType[]>([])

  useEffect(() => {
    const loadContainerTypes = async () => {
      try {
        const client = new ContainerTypesApiClient()
        const data = await client.getAll()
        setContainerTypes(data.containerTypes)
      } catch (err) {
        console.error('Error loading container types:', err)
      }
    }

    loadContainerTypes()
  }, [])

  return (
    <div>
      <Form>
        <Row className="g-3">
          <Col md={12}>
            <TextInput
              label="Name"
              placeholder="Enter container name"
              maxChars={100}
              onChange={(value) => updateContainerData('name', value)}
              error={errors.name}
              value={containerData.name}
              required
            />
          </Col>
          <Col md={12}>
            <TextInput
              label="Key"
              placeholder="Enter container key (max 10 characters, automatically capitalized)"
              maxChars={10}
              onChange={(value) => {
                const upperValue = value?.toUpperCase().replace(/[^A-Z0-9]/g, '')
                updateContainerData('key', upperValue)
              }}
              error={errors.key}
              hint="Letters and numbers only (automatically capitalized)"
              value={containerData.key}
              required
            />
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>
                Container Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={containerData.type || ''}
                onChange={(e) => {
                  const value = e.target.value
                  updateContainerData('type', value ? value : undefined)
                }}
                isInvalid={!!errors.type}
              >
                <option value="">Select a container type</option>
                {containerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
              {errors.type && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.type}
                </Form.Control.Feedback>
              )}
              {containerData.type && containerTypes.length > 0 && (
                <Form.Text className="text-muted">
                  {containerTypes.find((t) => t.id === containerData.type)?.description}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col md={12}>
            <RichTextInput
              label="Description"
              placeholder="Enter container description"
              onChange={(value) => updateContainerData('description', value)}
              error={errors.description}
              value={containerData.description}
              hint="Use the toolbar to format your text"
            />
          </Col>
          <FormDivider />
          <Col md={12}>
            <IconSelector
              label="Icon"
              value={containerData.icon}
              onChange={(value: string) => updateContainerData('icon', value)}
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
