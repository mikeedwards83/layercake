import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import AddProjectWorkflow from './ProjectAddWorkflow'


const Page = () => {
  const navigate = useNavigate()

  const handleCancel = () => {
    // Navigate back to projects list
    navigate('/projects')
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Add New Project" subtitle="Create a new project" />
      <Row>
        <Col>
          <AddProjectWorkflow
            onCancel={handleCancel}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Page
