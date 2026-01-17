import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import type { User } from '@/types/user'
import { TextReview } from '@/components/Review/TextReview'
import { RichTextReview } from '@/components/Review/RichTextReview/RichTextReview'
import { UsersReview } from '@/components/Review/UsersReview/UsersReview'
import { Notice } from '@/components/Notice'
import type { ILogicalApplicationsPostRequest } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { ValidationSummary } from '@/components/Form/ValidationSummary/validationSummary'
import { ApplicationTypesApiClient, type IApplicationTypeResponse } from '@/services/applicationTypes/applicationTypesApiClient'

interface LogicalApplicationAddStep2Props {
  logicalApplicationData: ILogicalApplicationsPostRequest
  users: User[]
  validationErrors?: Record<string, string[]>
}

export const LogicalApplicationAddStep2 = ({ logicalApplicationData, users, validationErrors = {} }: LogicalApplicationAddStep2Props) => {
  const [applicationTypes, setApplicationTypes] = useState<IApplicationTypeResponse[]>([])

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

  const getApplicationTypeName = () => {
    if (logicalApplicationData.customApplicationTypeName) {
      return logicalApplicationData.customApplicationTypeName
    }
    if (logicalApplicationData.applicationTypeId) {
      const type = applicationTypes.find(t => t.id === logicalApplicationData.applicationTypeId)
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
              <h4 className="mb-3 text-primary">Logical Application Details</h4>
              <Row>
                <Col md={6}>
                  <TextReview label="Name" value={logicalApplicationData.name} />
                  <TextReview label="Type" value={getApplicationTypeName()} />
                  <RichTextReview label="Description" value={logicalApplicationData.description} />
                </Col>
                <Col md={6}>
                  <UsersReview users={users} label="Owner" values={logicalApplicationData.ownerId ? [logicalApplicationData.ownerId] : []} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Notice heading="Ready to Create?" variant="info">
            <p className="mb-0">
              Click "Create Logical Application" below to finalize and create your new logical application. You can click "Previous" to make any changes.
            </p>
          </Notice>
        </Col>
      </Row>
    </div>
  )
}
