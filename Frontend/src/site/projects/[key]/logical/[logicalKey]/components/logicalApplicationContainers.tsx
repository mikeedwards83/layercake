import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import type { ILogicalApplicationResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { ContainersApiClient } from '@/services/containers/containersApiClient'
import type { IContainer } from '@/types/container'
import { Card, CardBody, Button, Row, Col, Badge } from 'react-bootstrap'
import { TbPlus, TbBox } from 'react-icons/tb'

interface ILogicalApplicationContainersProps {
  logicalApplicationResponse: ILogicalApplicationResponse
  isActive: boolean
}

export const LogicalApplicationContainers = ({ logicalApplicationResponse }: ILogicalApplicationContainersProps) => {
  const { key: projectKey } = useParams<{ key: string }>()
  const [containers, setContainers] = useState<IContainer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContainers = async () => {
      if (!projectKey) return

      try {
        setLoading(true)
        const client = new ContainersApiClient()
        const data = await client.getAll(projectKey, logicalApplicationResponse.key)
        setContainers(data.containers)
      } catch (err) {
        console.error('Error loading containers:', err)
      } finally {
        setLoading(false)
      }
    }

    loadContainers()
  }, [projectKey, logicalApplicationResponse.key])

  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardBody className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Containers</h4>
          <Button
            variant="primary"
            size="sm"
            href={`/projects/${projectKey}/logical/${logicalApplicationResponse.key}/containers/add`}
          >
            <TbPlus className="me-1" />
            Add Container
          </Button>
        </div>

        {loading ? (
          <p className="text-muted">Loading containers...</p>
        ) : containers.length === 0 ? (
          <div className="text-center py-5">
            <TbBox size={48} className="text-muted mb-3" />
            <p className="text-muted mb-3">No containers have been created yet for {logicalApplicationResponse.name}.</p>
            <Button variant="outline-primary" href={`/projects/${projectKey}/logical/${logicalApplicationResponse.key}/containers/add`}>
              <TbPlus className="me-1" />
              Add Your First Container
            </Button>
          </div>
        ) : (
          <Row className="g-3">
            {containers.map((container) => (
              <Col md={6} lg={4} key={container.id}>
                <Card className="h-100 border">
                  <Card.Body>
                    <div className="d-flex align-items-start mb-2">
                      {container.icon && <span className="me-2 fs-4">{container.icon}</span>}
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{container.name}</h5>
                        <Badge bg="secondary" className="mb-2">
                          {container.key}
                        </Badge>
                      </div>
                    </div>
                    {container.description && (
                      <div className="text-muted small" dangerouslySetInnerHTML={{ __html: container.description }} />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </CardBody>
    </Card>
  )
}
