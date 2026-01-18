import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap'
import PageMetaData from '../../../components/PageMetaData'
import { UsersApiClient, type IUsersGetResponse } from '../../../services/users/usersApiClient'
import { TbUsers, TbMail, TbCalendar, TbClock } from 'react-icons/tb'

const UsersPage = () => {
  const [usersResponse, setUsersResponse] = useState<IUsersGetResponse | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const client = new UsersApiClient()
        const data = await client.getAll()
        setUsersResponse(data)
        setError(null)
      } catch (err) {
        console.error('Error loading users:', err)
        setError('Failed to load users. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <>
      <PageMetaData title="Users" />

      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-title-box">
              <h4 className="page-title">
                <TbUsers className="me-2" />
                User Management
              </h4>
              <p className="text-muted">Manage user accounts and permissions</p>
            </div>
          </Col>
        </Row>

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

        {!loading && !error && usersResponse && (
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">All Users ({usersResponse.users.length})</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {usersResponse.users.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <TbUsers size={48} className="mb-3 opacity-50" />
                      <p className="mb-0">No users found in the system</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="mb-0" hover>
                        <thead className="table-light">
                          <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Last Sign In</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersResponse.users.map((user) => (
                            <tr key={user.uid}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {user.photoUrl ? (
                                    <img
                                      src={user.photoUrl}
                                      alt={user.displayName || user.email}
                                      className="rounded-circle me-2"
                                      style={{ width: '32px', height: '32px' }}
                                    />
                                  ) : (
                                    <div
                                      className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                                      style={{ width: '32px', height: '32px' }}
                                    >
                                      <TbUsers className="text-primary" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="fw-semibold">
                                      {user.displayName || 'No name'}
                                    </div>
                                    <small className="text-muted">{user.uid}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <TbMail className="me-2 text-muted" />
                                  {user.email}
                                  {user.emailVerified && (
                                    <Badge bg="success" className="ms-2">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td>
                                {user.disabled ? (
                                  <Badge bg="danger">Disabled</Badge>
                                ) : (
                                  <Badge bg="success">Active</Badge>
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center text-muted">
                                  <TbCalendar className="me-2" size={14} />
                                  <small>{formatDate(user.createdAt)}</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center text-muted">
                                  <TbClock className="me-2" size={14} />
                                  <small>{formatDate(user.lastSignInAt)}</small>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

export default UsersPage
