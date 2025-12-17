import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Container, Spinner, Alert, Tab, Nav, TabContainer, Row, Col, TabPane, TabContent, CardBody, CardHeader, Card } from 'react-bootstrap'
import { ProjectApiClient, type IProjectGetByKeyResponse } from '@/services/project/projectApiClient'
import { Icon } from '@/components/Icon'
import { RichTextReview } from '@/components/Review/RichTextReview/RichTextReview'
import { TbHome } from 'react-icons/tb'

const ProjectPage = () => {
  const { key } = useParams<{ key: string }>()
  const [projectResponse, setProjectResponse] = useState<IProjectGetByKeyResponse | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      if (!key) {
        setError('Project key is missing')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const client = new ProjectApiClient()
        const data = await client.getByKey(key)
        setProjectResponse(data)
        setError(null)
      } catch (err) {
        console.error('Error loading project:', err)
        setError('Failed to load project. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [key])

  return (
    <Container fluid>
      <PageBreadcrumb title={projectResponse?.project.name || 'Project'} subtitle={projectResponse?.project.description || ''} />

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      )}

      {!loading && !error && projectResponse && (
        <div className="my-3">
          <Row className="justify-content-center">
            <Col xxl={10}>
              <TabContainer defaultActiveKey="overview">
                <Nav className="nav-tabs nav-bordered nav-bordered-secondary">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">
                      <span className="d-none d-md-block">
                        <TbHome className="fs-lg me-md-1 align-middle" />
                        Overview
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="documentation">Documentation</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="logical">Logical</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="containers">Containers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="physical">Physical</Nav.Link>
                  </Nav.Item>
                </Nav>

                <TabContent>
                  <TabPane eventKey="overview">
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
                  </TabPane>
                  <Tab.Pane eventKey="documentation">
                    <div className="p-3">
                      <h4>Documentation</h4>
                      <p>Documentation content goes here</p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="logical">
                    <div className="p-3">
                      <h4>Logical</h4>
                      <p>Logical content goes here</p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="containers">
                    <div className="p-3">
                      <h4>Containers</h4>
                      <p>Containers content goes here</p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="physical">
                    <div className="p-3">
                      <h4>Physical</h4>
                      <p>Physical content goes here</p>
                    </div>
                  </Tab.Pane>
                </TabContent>
              </TabContainer>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  )
}

export default ProjectPage
