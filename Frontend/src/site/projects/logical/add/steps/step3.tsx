import { Button } from 'react-bootstrap'
import {
  LuArrowRight,
} from 'react-icons/lu'
import type { User } from '@/types/user'
import type { ILogicalApplicationsPostRequest } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { WorkflowSuccess } from '@/components/Workflow/workflowSuccess'

interface LogicalApplicationAddStep3Props {
  logicalApplicationData: ILogicalApplicationsPostRequest
  users: User[]
  projectKey: string
}

export const LogicalApplicationAddStep3 = ({ logicalApplicationData, projectKey }: LogicalApplicationAddStep3Props) => {
  return (
    <WorkflowSuccess title={`Logical Application Created - ${logicalApplicationData.name}`}>
      <Button variant="primary" size="lg" href={`/projects/${projectKey}`}>
        Go to Project
        <LuArrowRight className="ms-2" />
      </Button>
      <Button variant="outline-primary" size="lg" href={`/projects/${projectKey}/logical/add`}>
        Create Another Logical Application
      </Button>
    </WorkflowSuccess>
  )
}
