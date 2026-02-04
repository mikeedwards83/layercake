import { Button } from 'react-bootstrap'
import { LuArrowRight } from 'react-icons/lu'
import type { IContainersPostRequest } from '@/services/containers/containersApiClient'
import { WorkflowSuccess } from '@/components/Workflow/workflowSuccess'

interface ContainerAddStep3Props {
  containerData: IContainersPostRequest
  projectKey: string
  logicalKey: string
}

export const ContainerAddStep3 = ({ containerData, projectKey, logicalKey }: ContainerAddStep3Props) => {
  return (
    <WorkflowSuccess title={`Container Created - ${containerData.name}`}>
      <Button variant="primary" size="lg" href={`/projects/${projectKey}/logical/${logicalKey}`}>
        Go to Logical Application
        <LuArrowRight className="ms-2" />
      </Button>
      <Button variant="outline-primary" size="lg" href={`/projects/${projectKey}/logical/${logicalKey}/containers/add`}>
        Create Another Container
      </Button>
    </WorkflowSuccess>
  )
}
