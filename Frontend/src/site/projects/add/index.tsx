import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import AddProjectWorkflow from './ProjectAddWorkflow'

interface ProjectData {
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
}

const Page = () => {
  const navigate = useNavigate()

  const handleProjectComplete = (projectData: ProjectData) => {
    console.log('Project created:', projectData)
    // Here you would typically save the project to your backend
    // For example:
    // await api.post('/projects', projectData)

    // Show success message
    alert(`Project "${projectData.name}" created successfully!`)

    // Navigate back to projects list
    navigate('/projects')
  }

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
            onComplete={handleProjectComplete}
            onCancel={handleCancel}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Page
