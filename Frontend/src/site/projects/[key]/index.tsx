import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Container, Spinner, Alert, Tab, Nav } from 'react-bootstrap'
import { ProjectApiClient, type IProjectGetByKeyResponse } from '@/services/project/projectApiClient'

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
      <PageBreadcrumb
        title={projectResponse?.project.name || 'Project'}
        subtitle={projectResponse?.project.description || ''}
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

      {!loading && !error && projectResponse && (
        <div className="my-3">
          <h2>{projectResponse.project.name}</h2>
          <p className="text-muted">{projectResponse.project.description}</p>
          <p>
            <strong>Key:</strong> {projectResponse.project.key}
          </p>
          <p>
            <strong>ID:</strong> {projectResponse.project.id}
          </p>

          <Tab.Container defaultActiveKey="overview">
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="overview">Overview</Nav.Link>
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

            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <div className="p-3">
                  <h4>Overview</h4>
                  <p>Overview content goes here</p>
                </div>
              </Tab.Pane>
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
            </Tab.Content>
          </Tab.Container>
        </div>
      )}
    </Container>
  )
}

export default ProjectPage
