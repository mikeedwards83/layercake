import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { UsersTopBar } from './components/usersTopBar'
import { UsersApiClient, type IUsersGetResponse } from '@/services/users/usersApiClient'
import { TbUsers, TbMail, TbCalendar, TbClock } from 'react-icons/tb'
import { getStatusBadge } from '@/helpers/user'

const ITEMS_PER_PAGE = 20

const UsersPage = () => {
  const [usersResponse, setUsersResponse] = useState<IUsersGetResponse | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const loadUsers = async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const client = new UsersApiClient()
      const data = await client.getAll({
        search: searchQuery || undefined,
        page,
        pageSize: ITEMS_PER_PAGE,
      })

      if (append && usersResponse) {
        // Append new users to existing list
        setUsersResponse({
          ...data,
          users: [...usersResponse.users, ...data.users],
        })
      } else {
        setUsersResponse(data)
      }
      setError(null)
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Failed to load users. Please try again later.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    loadUsers(1, false)
  }, [searchQuery])

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    loadUsers(nextPage, true)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const hasMore = usersResponse && usersResponse.users.length < usersResponse.totalCount

  return (
    <Container fluid>
      <PageBreadcrumb title="User Management" subtitle="Manage user accounts and permissions" />
      <UsersTopBar onSearch={handleSearch} />

        {loading && !loadingMore && (
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
                    <h5 className="mb-0">
                      {searchQuery
                        ? `Filtered Users (${usersResponse.totalCount} total)`
                        : `All Users (${usersResponse.totalCount})`}
                    </h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {usersResponse.users.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <TbUsers size={48} className="mb-3 opacity-50" />
                      <p className="mb-0">
                        {searchQuery
                          ? 'No users found matching the search criteria'
                          : 'No users found in the system'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table className="mb-0" hover>
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Email</th>
                              <th>Name</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Updated</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersResponse.users.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                                    style={{ width: '32px', height: '32px' }}
                                  >
                                    <span className="text-primary fw-semibold">{user.initials}</span>
                                  </div>
                                  <div>
                                    <div className="fw-semibold">
                                      {user.displayName}
                                    </div>
                                    <small className="text-muted">{user.id}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <TbMail className="me-2 text-muted" />
                                  {user.email}
                                </div>
                              </td>
                              <td>
                                <div>
                                  {user.firstName} {user.lastName}
                                </div>
                              </td>
                              <td>
                                {(() => {
                                  const statusInfo = getStatusBadge(user.status)
                                  const StatusIcon = statusInfo.icon
                                  return (
                                    <Badge bg={statusInfo.variant} className="d-inline-flex align-items-center">
                                      <StatusIcon size={14} className="me-1" />
                                      {statusInfo.label}
                                    </Badge>
                                  )
                                })()}
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
                                  <small>{formatDate(user.updatedAt)}</small>
                                </div>
                              </td>
                            </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {hasMore && (
                        <div className="text-center p-3 border-top">
                          <Button
                            variant="primary"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                          >
                            {loadingMore ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Loading...
                              </>
                            ) : (
                              `Load More (${usersResponse.totalCount - usersResponse.users.length} remaining)`
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
    </Container>
  )
}

export default UsersPage
