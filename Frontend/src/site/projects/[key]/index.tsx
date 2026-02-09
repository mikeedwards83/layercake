import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Container, Spinner, Alert, Tab, Nav, TabContainer, Row, Col, TabPane, TabContent } from 'react-bootstrap'
import { ProjectApiClient, type IProjectGetByKeyResponse } from '@/services/project/projectApiClient'
import { TbHome } from 'react-icons/tb'
import { ProjectOverview } from './components/projectOverview'
import { ProjectDocumentation } from './components/projectDocumentation'
import { ProjectLogical } from './components/projectLogical'
import { DataLoadingErrors } from '@/constants'

const ProjectPage = () => {
  const { key } = useParams<{ key: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [projectResponse, setProjectResponse] = useState<IProjectGetByKeyResponse | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

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
        setError(DataLoadingErrors.PROJECT.LOAD_FAILED)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [key])

  // Sync active tab with URL
  useEffect(() => {
    const pathParts = location.pathname.split('/')
    const lastPart = pathParts[pathParts.length - 1]

    if (lastPart && ['overview', 'documentation', 'logical', 'containers', 'physical'].includes(lastPart)) {
      setActiveTab(lastPart)
    } else if (pathParts.includes('documentation')) {
      setActiveTab('documentation')
    } else {
      setActiveTab('overview')
    }
  }, [location])

  const handleTabSelect = (tab: string | null) => {
    if (!tab || !key) return
    setActiveTab(tab)

    if (tab === 'overview') {
      navigate(`/projects/${key}`)
    } else {
      navigate(`/projects/${key}/${tab}`)
    }
  }

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
              <TabContainer activeKey={activeTab} onSelect={handleTabSelect}>
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
                      <ProjectOverview projectResponse={projectResponse}  isActive={activeTab === "overview"}/>
                  </TabPane>
                  <Tab.Pane eventKey="documentation"  >
                      <ProjectDocumentation projectResponse={projectResponse}  isActive={activeTab === "documentation"}  />
                  </Tab.Pane>
                  <Tab.Pane eventKey="logical">
                    <ProjectLogical projectResponse={projectResponse} isActive={activeTab === "logical"} />
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
