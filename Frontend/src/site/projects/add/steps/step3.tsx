import { Button } from 'react-bootstrap'
import {
  LuArrowRight,
} from 'react-icons/lu'
import type { User } from '@/types/user'
import type { ProjectsPostRequest } from '@/services/projects/projectsApiClient'
import { WorkflowSuccess } from '@/components/Workflow/workflowSuccess'

interface ProjectAddStep3Props {
  projectData: ProjectsPostRequest
  users: User[]
}

export const ProjectAddStep3 = ({ projectData }: ProjectAddStep3Props) => {
  return (
    <WorkflowSuccess title={`Project Created - ${projectData.name} (${projectData.key})`}>
        <Button variant="primary" size="lg" href={`/projects/${projectData.key}`}>
            Go to Project
            <LuArrowRight className="ms-2" />
          </Button>
          <Button variant="outline-primary" size="lg" href="/projects/add">
            Create Another Project
          </Button>
    </WorkflowSuccess>
  )
}
