import type { ILogicalApplicationResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { Card, CardBody } from 'react-bootstrap'

interface ILogicalApplicationPhysicalProps {
  logicalApplicationResponse: ILogicalApplicationResponse
  isActive: boolean
}

export const LogicalApplicationPhysical = ({ logicalApplicationResponse }: ILogicalApplicationPhysicalProps) => {
  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardBody className="p-4">
        <h4>Physical</h4>
        <p className="text-muted">
          Physical deployment information for {logicalApplicationResponse.name} will be displayed here.
        </p>
      </CardBody>
    </Card>
  )
}
