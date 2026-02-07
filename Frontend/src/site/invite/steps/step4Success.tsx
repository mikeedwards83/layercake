import { Button } from 'react-bootstrap'
import { LuArrowRight } from 'react-icons/lu'
import { WorkflowSuccess } from '@/components/Workflow/workflowSuccess'

interface Step4SuccessProps {
  displayName: string
}

export const Step4Success = ({ displayName }: Step4SuccessProps) => {
  return (
    <WorkflowSuccess title={`Welcome, ${displayName}!`}>
      <p className="text-muted mb-4">
        Your account has been successfully created. You're now ready to start using Layer Cake.
      </p>
      <Button variant="primary" size="lg" href="/projects">
        Go to Projects
        <LuArrowRight className="ms-2" />
      </Button>
    </WorkflowSuccess>
  )
}
