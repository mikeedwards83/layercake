import { useState, useEffect } from 'react'
import { Card, CardBody, Button, CardHeader, Table, Spinner, Alert } from 'react-bootstrap'
import { TbPlus } from 'react-icons/tb'
import type { IProjectGetByKeyResponse } from '@/services/project/projectApiClient'
import { useNavigate } from 'react-router'
import { LogicalApplicationsApiClient, type ILogicalApplicationsGetResponse } from '@/services/logicalApplications/logicalApplicationsApiClient'
import { ApplicationTypesApiClient, type IApplicationTypeResponse } from '@/services/applicationTypes/applicationTypesApiClient'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { Notice } from '@/components/Notice'
import { DataLoadingErrors } from '@/constants'

interface IProjectLogicalProps {
  projectResponse: IProjectGetByKeyResponse
  isActive: boolean
}

export const ProjectLogical = ({ projectResponse, isActive }: IProjectLogicalProps) => {
  const navigate = useNavigate()
  const [logicalApplicationsResponse, setLogicalApplicationsResponse] = useState<ILogicalApplicationsGetResponse | undefined>(undefined)
  const [applicationTypes, setApplicationTypes] = useState<IApplicationTypeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!isActive) return

      try {
        setLoading(true)
        const logicalAppsClient = new LogicalApplicationsApiClient()
        const appTypesClient = new ApplicationTypesApiClient()

        const [logicalAppsData, appTypesData] = await Promise.all([
          logicalAppsClient.getAll(projectResponse.project.key),
          appTypesClient.getAll()
        ])

        setLogicalApplicationsResponse(logicalAppsData)
        setApplicationTypes(appTypesData.applicationTypes)
        setError(null)
      } catch (err) {
        console.error('Error loading logical applications:', err)
        setError(DataLoadingErrors.LOGICAL_APP.LOAD_FAILED)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectResponse.project.key, isActive])

  const handleAddLogical = () => {
    navigate(`/projects/${projectResponse.project.key}/logical/add`)
  }

  const getOwnerName = (ownerId?: string) => {
    if (!ownerId) return '-'
    const user = fakeUsers.find(u => u.id === ownerId)
    return user ? user.name : '-'
  }

  const getApplicationTypeName = (applicationTypeId?: string) => {
    if (!applicationTypeId) return '-'
    const type = applicationTypes.find(t => t.id === applicationTypeId)
    return type ? type.name : '-'
  }

  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center w-100">
          <h3 className="mb-0">Logical Applications</h3>
          <Button variant="success" size="sm" onClick={handleAddLogical}>
            <TbPlus className="me-1" />
            Add Logical
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-4">
        {loading && (
          <div className="text-center my-3">
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

        {!loading && !error && logicalApplicationsResponse && (
          <>
            {logicalApplicationsResponse.logicalApplications.length === 0 ? (
              <Notice heading="No Logical Applications Found" variant="info">
                <p className="mb-0">
                  You haven't created any logical applications yet. Click the "Add Logical" button above to create your first logical application!
                </p>
              </Notice>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {logicalApplicationsResponse.logicalApplications.map((logicalApp) => (
                    <tr key={logicalApp.id}>
                      <td>{logicalApp.name}</td>
                      <td>{getApplicationTypeName(logicalApp.applicationTypeId)}</td>
                      <td>{logicalApp.description || '-'}</td>
                      <td>{getOwnerName(logicalApp.ownerId)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        )}
      </CardBody>
    </Card>
  )
}
