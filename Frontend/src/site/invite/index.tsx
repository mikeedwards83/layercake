import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import { Container, Row, Col, Card, Spinner, Button, Image } from 'react-bootstrap'
import { TbAlertCircle, TbCheck, TbClock } from 'react-icons/tb'
import PageMetaData from '@/components/PageMetaData'
import { InvitesApiClient, type IInviteDetailsResponse } from '@/services/invites/invitesApiClient'
import { InviteWorkflow } from './InviteWorkflow'
import logo from '@/assets/images/logo-rectangle.png'
import AppLogo from '@/components/AppLogo'

const InvitePage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteDetails, setInviteDetails] = useState<IInviteDetailsResponse | null>(null)

  useEffect(() => {
    const loadInviteDetails = async () => {
      if (!token) {
        setError('Invalid invitation link. Please check the link in your email.')
        setLoading(false)
        return
      }

      try {
        const client = new InvitesApiClient()
        const details = await client.getDetails(token)
        setInviteDetails(details)
      } catch (err: any) {
        console.error('Error loading invite:', err)
        setError(err.response?.data?.message || 'Failed to load invitation. The link may be invalid or expired.')
      } finally {
        setLoading(false)
      }
    }

    loadInviteDetails()
  }, [token])

  // Loading state
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <PageMetaData title="Accept Invitation" />
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading invitation...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !inviteDetails) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <PageMetaData title="Invitation Error" />
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <AppLogo />
                </Card.Header>
                <Card.Body className="p-5 text-center">
                  <div
                    className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <TbAlertCircle size={40} className="text-danger" />
                  </div>
                  <h4 className="mb-3">Invitation Error</h4>
                  <p className="text-muted mb-4">{error}</p>
                  <Link to="/signin">
                    <Button variant="primary">Go to Sign In</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  // Already accepted state
  if (inviteDetails.isAccepted) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <PageMetaData title="Invitation Already Accepted" />
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <AppLogo />
                </Card.Header>
                <Card.Body className="p-5 text-center">
                  <div
                    className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <TbCheck size={40} className="text-success" />
                  </div>
                  <h4 className="mb-3">Invitation Already Accepted</h4>
                  <p className="text-muted mb-4">
                    This invitation has already been accepted. You can sign in to your account.
                  </p>
                  <Link to="/signin">
                    <Button variant="primary">Go to Sign In</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  // Expired state
  if (inviteDetails.isExpired) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <PageMetaData title="Invitation Expired" />
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5 text-center">
                  <div
                    className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <TbClock size={40} className="text-warning" />
                  </div>
                  <h4 className="mb-3">Invitation Expired</h4>
                  <p className="text-muted mb-4">
                    This invitation has expired. Please contact the person who invited you to request a new invitation.
                  </p>
                  <Link to="/signin">
                    <Button variant="primary">Go to Sign In</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  // Valid invite - show workflow
  return (
    <div className="min-vh-100 bg-light">
      <PageMetaData title="Accept Invitation" />
      <Container className="py-4">
        <InviteWorkflow token={token!} inviteDetails={inviteDetails} />
      </Container>
    </div>
  )
}

export default InvitePage
