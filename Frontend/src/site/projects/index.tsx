import { useState, useEffect } from 'react'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { ProjectsTopBar } from './components/projectsTopBar'
import { ProjectCard } from '@/components/Projects/Card/ProjectCard'
import { ProjectsApiClient, type IProjectsGetResponse } from '@/services/projects/projectsApiClient'
import { Notice } from '@/components/Notice'

const Page = () => {
  const [projectsResponse, setProjectsResponse] = useState<IProjectsGetResponse|undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const client = new ProjectsApiClient()
        const data = await client.getAll()
        setProjectsResponse(data)
        setError(null)
      } catch (err) {
        console.error('Error loading projects:', err)
        setError('Failed to load projects. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <Container fluid>
      <PageBreadcrumb title="Projects" subtitle="" />
      <ProjectsTopBar />

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

      {!loading && !error && projectsResponse && (
        <Row className="g-3">
          {projectsResponse.projects.length === 0 ? (
            <Col xs={12}>
              <Notice heading="No Projects Found" variant="info">
                <p className="mb-0">
                  You haven't created any projects yet. Click the "Add New Project" button above to create your first project and get started!
                </p>
              </Notice>
            </Col>
          ) : (
            projectsResponse.projects.map((project) => (
              <Col key={project.id} xs={12} md={6} lg={4}>
                <ProjectCard
                  name={project.name}
                  projectKey={project.key}
                  description={project.description}
                  ownerId={project.ownerId}
                  icon={project.icon}
                  color={project.color}
                />
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  )
}

export default Page
