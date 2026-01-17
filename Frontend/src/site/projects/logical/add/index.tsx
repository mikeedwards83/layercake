import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import AddLogicalApplicationWorkflow from './logicalApplicationAddWorkflow'

const Page = () => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()

  const handleCancel = () => {
    // Navigate back to project details
    navigate(`/projects/${projectId}`)
  }

  // Get project key from the URL parameter
  const projectKey = projectId || ''

  return (
      <Container fluid>
        <PageBreadcrumb title="Add New Logical Application" subtitle="Create a new logical application" />
        <Row>
          <Col>
            <AddLogicalApplicationWorkflow
              projectKey={projectKey}
              projectId={projectKey}
              onCancel={handleCancel}
            />
          </Col>
        </Row>
      </Container>
  )
}

export default Page
