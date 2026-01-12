import { Card, CardBody, Button, CardHeader } from 'react-bootstrap'
import { TbPlus } from 'react-icons/tb'
import type { IProjectGetByKeyResponse } from '@/services/project/projectApiClient'
import { useNavigate } from 'react-router'

interface IProjectLogicalProps {
  projectResponse: IProjectGetByKeyResponse
  isActive: boolean
}

export const ProjectLogical = ({ projectResponse }: IProjectLogicalProps) => {
  const navigate = useNavigate()

  const handleAddLogical = () => {
    navigate(`/projects/${projectResponse.project.key}/logical/add`)
  }

  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center w-100">
          <h3 className="mb-0">Logical Applications</h3>
          <Button variant="success" size="sm" onClick={handleAddLogical}>
            <TbPlus className="me-1" />
            Add Logical
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-4">
        <p>Logical applications content goes here</p>
      </CardBody>
    </Card>
  )
}
