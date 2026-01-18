import type { ILogicalApplicationResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { Card, CardBody } from 'react-bootstrap'

interface ILogicalApplicationContainersProps {
  logicalApplicationResponse: ILogicalApplicationResponse
  isActive: boolean
}

export const LogicalApplicationContainers = ({
  logicalApplicationResponse,
}: ILogicalApplicationContainersProps) => {
  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardBody className="p-4">
        <h4>Containers</h4>
        <p className="text-muted">
          Container information for {logicalApplicationResponse.name} will be displayed here.
        </p>
      </CardBody>
    </Card>
  )
}
