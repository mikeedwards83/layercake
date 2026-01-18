import type { ILogicalApplicationResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { Card, CardBody } from 'react-bootstrap'

interface ILogicalApplicationDocumentationProps {
  logicalApplicationResponse: ILogicalApplicationResponse
  isActive: boolean
}

export const LogicalApplicationDocumentation = ({
  logicalApplicationResponse,
}: ILogicalApplicationDocumentationProps) => {
  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardBody className="p-4">
        <h4>Documentation</h4>
        <p className="text-muted">Documentation for {logicalApplicationResponse.name} will be displayed here.</p>
      </CardBody>
    </Card>
  )
}
