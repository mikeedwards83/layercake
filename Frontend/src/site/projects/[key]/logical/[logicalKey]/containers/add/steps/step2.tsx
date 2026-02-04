import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { TextReview } from '@/components/Review/TextReview'
import { RichTextReview } from '@/components/Review/RichTextReview/RichTextReview'
import { IconReview } from '@/components/Review/IconReview'
import { Notice } from '@/components/Notice'
import type { IContainersPostRequest } from '@/services/containers/containersApiClient'
import { ValidationSummary } from '@/components/Form/ValidationSummary/validationSummary'
import { ContainerTypesApiClient } from '@/services/containers/containersApiClient'
import type { IContainerType } from '@/types/container'

interface ContainerAddStep2Props {
  containerData: IContainersPostRequest
  validationErrors?: Record<string, string[]>
}

export const ContainerAddStep2 = ({ containerData, validationErrors = {} }: ContainerAddStep2Props) => {
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

  const getContainerTypeName = () => {
    if (containerData.type) {
      const type = containerTypes.find((t) => t.id === containerData.type)
      return type?.name || '-'
    }
    return '-'
  }

  return (
    <div>
      <Row className="g-4">
        <Col md={12}>
          <ValidationSummary errors={validationErrors} />
        </Col>
        <Col md={12}>
          <Card className="border">
            <Card.Body>
              <h4 className="mb-3 text-primary">Container Details</h4>
              <Row>
                <Col md={6}>
                  <TextReview label="Name" value={containerData.name} />
                  <TextReview label="Key" value={containerData.key} />
                  <TextReview label="Type" value={getContainerTypeName()} />
                  <RichTextReview label="Description" value={containerData.description} />
                </Col>
                <Col md={6}>
                  <IconReview label="Icon" value={containerData.icon} color="#0d6efd" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Notice heading="Ready to Create?" variant="info">
            <p className="mb-0">Click "Create Container" below to finalize and create your new container. You can click "Previous" to make any changes.</p>
          </Notice>
        </Col>
      </Row>
    </div>
  )
}
