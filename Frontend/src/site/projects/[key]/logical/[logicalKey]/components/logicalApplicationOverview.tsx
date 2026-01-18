import { RichTextReview } from '@/components/Review'
import type { ILogicalApplicationResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { Card, CardBody, CardHeader, Row, Col } from 'react-bootstrap'
import { TextReview } from '@/components/Review/TextReview'

interface ILogicalApplicationOverviewProps {
  logicalApplicationResponse: ILogicalApplicationResponse
  isActive: boolean
}

export const LogicalApplicationOverview = ({ logicalApplicationResponse }: ILogicalApplicationOverviewProps) => {

  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardHeader className="align-items-start p-4">
        <div className="d-flex align-items-center gap-3">
          <h3 className="mb-0">{logicalApplicationResponse.name}</h3>
          <span className="badge bg-primary">{logicalApplicationResponse.key}</span>
        </div>
      </CardHeader>
      <CardBody className="px-4">
        <Row>
          <Col md={6}>
            <TextReview label="Name" value={logicalApplicationResponse.name} />
            <TextReview label="Key" value={logicalApplicationResponse.key} />
          </Col>
          <Col md={6}>
            <TextReview label="Application Type ID" value={logicalApplicationResponse.applicationTypeId || '-'} />
            <TextReview label="Owner ID" value={logicalApplicationResponse.ownerId || '-'} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <RichTextReview label="Description" value={logicalApplicationResponse.description} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
