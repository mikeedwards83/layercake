import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import UserAddWorkflow from './UserAddWorkflow'

const Page = () => {
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('/admin/users')
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Add New User" subtitle="Create a new user account" />
      <Row>
        <Col>
          <UserAddWorkflow onCancel={handleCancel} />
        </Col>
      </Row>
    </Container>
  )
}

export default Page
