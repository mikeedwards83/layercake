import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Container, Spinner, Alert, Tab, Nav, TabContainer, Row, Col, TabPane, TabContent } from 'react-bootstrap'
import { LogicalApplicationsApiClient, type ILogicalApplicationResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { TbHome } from 'react-icons/tb'
import { LogicalApplicationOverview } from './components/logicalApplicationOverview'
import { LogicalApplicationDocumentation } from './components/logicalApplicationDocumentation'
import { LogicalApplicationContainers } from './components/logicalApplicationContainers'
import { LogicalApplicationPhysical } from './components/logicalApplicationPhysical'

const LogicalApplicationPage = () => {
  const { key, logicalKey } = useParams<{ key: string; logicalKey: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [logicalApplicationResponse, setLogicalApplicationResponse] = useState<ILogicalApplicationResponse | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  useEffect(() => {
    const loadLogicalApplication = async () => {
      if (!key || !logicalKey) {
        setError('Project key or logical application key is missing')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const client = new LogicalApplicationsApiClient()
        const data = await client.getByKey(key, logicalKey)
        setLogicalApplicationResponse(data)
        setError(null)
      } catch (err) {
        console.error('Error loading logical application:', err)
        setError('Failed to load logical application. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadLogicalApplication()
  }, [key, logicalKey])

  // Sync active tab with URL
  useEffect(() => {
    const pathParts = location.pathname.split('/')
    const lastPart = pathParts[pathParts.length - 1]

    if (lastPart && ['overview', 'documentation', 'containers', 'physical'].includes(lastPart)) {
      setActiveTab(lastPart)
    } else if (pathParts.includes('documentation')) {
      setActiveTab('documentation')
    } else {
      setActiveTab('overview')
    }
  }, [location])

  const handleTabSelect = (tab: string | null) => {
    if (!tab || !key || !logicalKey) return
    setActiveTab(tab)

    if (tab === 'overview') {
      navigate(`/projects/${key}/logical/${logicalKey}`)
    } else {
      navigate(`/projects/${key}/logical/${logicalKey}/${tab}`)
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb
        title={logicalApplicationResponse?.name || 'Logical Application'}
        subtitle={logicalApplicationResponse?.description || ''}
      />

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

      {!loading && !error && logicalApplicationResponse && (
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
                    <Nav.Link eventKey="containers">Containers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="physical">Physical</Nav.Link>
                  </Nav.Item>
                </Nav>

                <TabContent>
                  <TabPane eventKey="overview">
                    <LogicalApplicationOverview
                      logicalApplicationResponse={logicalApplicationResponse}
                      isActive={activeTab === 'overview'}
                    />
                  </TabPane>
                  <Tab.Pane eventKey="documentation">
                    <LogicalApplicationDocumentation
                      logicalApplicationResponse={logicalApplicationResponse}
                      isActive={activeTab === 'documentation'}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="containers">
                    <LogicalApplicationContainers
                      logicalApplicationResponse={logicalApplicationResponse}
                      isActive={activeTab === 'containers'}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="physical">
                    <LogicalApplicationPhysical
                      logicalApplicationResponse={logicalApplicationResponse}
                      isActive={activeTab === 'physical'}
                    />
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

export default LogicalApplicationPage
