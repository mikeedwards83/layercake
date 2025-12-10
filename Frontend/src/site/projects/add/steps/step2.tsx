import { Row, Col, Card } from 'react-bootstrap'
import type { User } from '@/types/user'
import { TextReview } from '@/components/Review/TextReview'
import { IconReview } from '@/components/Review/IconReview'
import { ColorReview } from '@/components/Review/ColorReview'
import { UsersReview } from '@/components/Review/UsersReview'
import { Notice } from '@/components/Notice'
import type { IProjectsPostRequest } from '@/services/projects/projectsApiClient'
import { ValidationSummary } from '@/components/Form/ValidationSummary/validationSummary'

interface ProjectAddStep1Props {
  projectData: IProjectsPostRequest
  users: User[]
  validationErrors?:Record<string, string[]>
}

export const ProjectAddStep2 = ({ projectData, users, validationErrors = {} }: ProjectAddStep1Props) => {

  return (
    <div>
      <Row className="g-4">
          <Col md={12}>
            <ValidationSummary errors={validationErrors} />
          </Col>
        <Col md={12}>
          <Card className="border">
            <Card.Body>
              <h4 className="mb-3 text-primary">Project Details</h4>
              <Row>
                <Col md={6}>
                  <TextReview label="Name" value={projectData.name} />
                  <TextReview label="Description" value={projectData.description} />
                  <TextReview label="Key" value={projectData.key} />
                </Col>
                <Col md={6}>
                  <IconReview label="Icon" value={projectData.icon} color={projectData.color} />
                  <ColorReview label="Colour" value={projectData.color} />
                </Col>
                <Col md={6}>
                  <UsersReview users={users} label="Owner" values={projectData.ownerId ? [projectData.ownerId] : []} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
          <Col md={12}>
            <Notice heading="Ready to Create?" variant="info">
              <p className="mb-0">
                Click "Create Project" below to finalize and create your new project. You can click "Previous" to make any changes.
              </p>
            </Notice>
          </Col>
      </Row>
    </div>
  )
}
