import { Icon } from "@/components/Icon"
import { RichTextReview } from "@/components/Review"
import type { IProjectGetByKeyResponse } from "@/services/project/projectApiClient"
import { Card, CardBody, CardHeader } from "react-bootstrap"

interface IProjectOverviewProps{
    projectResponse: IProjectGetByKeyResponse
}

export const ProjectOverview = ({projectResponse}: IProjectOverviewProps) => {
  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardHeader className="align-items-start p-4">
        <div className="d-flex align-items-center gap-3 ">
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: projectResponse.project.color,
            }}>
            <Icon size={24} color="#fff" iconName={projectResponse.project.icon} />
          </div>
          <h3 className="mb-0">{projectResponse.project.name}</h3>
        </div>
      </CardHeader>
      <CardBody className="px-4">
        <RichTextReview label="Description" value={projectResponse.project.description} />
      </CardBody>
    </Card>
  )
}
