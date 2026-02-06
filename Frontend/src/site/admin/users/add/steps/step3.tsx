import { Button } from 'react-bootstrap'
import { LuArrowRight } from 'react-icons/lu'
import type { IUserCreateRequest } from '@/services/users/usersApiClient'
import { WorkflowSuccess } from '@/components/Workflow/workflowSuccess'

interface UserAddStep3Props {
  userData: IUserCreateRequest
}

export const UserAddStep3 = ({ userData }: UserAddStep3Props) => {
  return (
    <WorkflowSuccess title={`User Created - ${userData.firstName} ${userData.lastName}`}>
      <Button variant="primary" size="lg" href="/admin/users">
        Go to Users
        <LuArrowRight className="ms-2" />
      </Button>
      <Button variant="outline-primary" size="lg" href="/admin/users/add">
        Create Another User
      </Button>
    </WorkflowSuccess>
  )
}
