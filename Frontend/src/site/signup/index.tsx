import { useState, type FormEvent } from 'react'
import AppLogo from '@/components/AppLogo'
import { author, currentYear } from '@/helpers'
import { Link, useNavigate } from 'react-router'
import { Card, Col, Row, Button, Alert, Spinner, Form } from 'react-bootstrap'
import PageMetaData from '@/components/PageMetaData'
import { AuthenticationApiClient } from '@/services/authentication/authenticationApiClient'
import { useNotificationContext } from '@/context/useNotificationContext'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '@/firebase'
import { Settings } from '@/Settings'

const Page = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotificationContext()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must include at least one lowercase letter'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must include at least one uppercase letter'
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      errors.password = 'Password must include at least one special character'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const client = new AuthenticationApiClient()
      const result = await client.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      })

      await signInWithCustomToken(auth, result.customToken)
      showNotification({ message: 'Account created successfully!', variant: 'success' })
      navigate(Settings.signIn.successUrl)
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create account. Please try again.'
      setError(errorMessage)
      showNotification({ message: errorMessage, variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="auth-box d-flex align-items-center">
      <PageMetaData title="Sign Up" />
      <div className="container-xxl">
        <Row className="align-items-center justify-content-center">
          <Col xl={10}>
            <Card className="rounded-4">
              <Row className="justify-content-between g-0">
                <Col lg={6}>
                  <div className="card-body">
                    <div className="auth-brand text-center mb-4">
                      <AppLogo />
                      <h4 className="fw-bold mt-4">Create Your Account</h4>
                      <p className="text-muted w-lg-75 mx-auto">Join us today and get started with your account.</p>
                    </div>

                    {error && (
                      <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="firstName">First Name</Form.Label>
                            <Form.Control
                              type="text"
                              id="firstName"
                              placeholder="Enter first name"
                              value={formData.firstName}
                              onChange={(e) => handleChange('firstName', e.target.value)}
                              isInvalid={!!validationErrors.firstName}
                              disabled={loading}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {validationErrors.firstName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              id="lastName"
                              placeholder="Enter last name"
                              value={formData.lastName}
                              onChange={(e) => handleChange('lastName', e.target.value)}
                              isInvalid={!!validationErrors.lastName}
                              disabled={loading}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {validationErrors.lastName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="email">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          isInvalid={!!validationErrors.email}
                          disabled={loading}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                          type="password"
                          id="password"
                          placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 special char"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          isInvalid={!!validationErrors.password}
                          disabled={loading}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 special character
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          id="confirmPassword"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          isInvalid={!!validationErrors.confirmPassword}
                          disabled={loading}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-grid mb-3">
                        <Button type="submit" variant="primary" disabled={loading}>
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </div>
                    </Form>

                    <p className="text-muted text-center mt-4 mb-0">
                      Already have an account?{' '}
                      <Link to="/signin" className="text-decoration-underline link-offset-3 fw-semibold">
                        Sign In
                      </Link>
                    </p>

                    <p className="text-center text-muted mt-4 mb-0">
                      © {currentYear} by <span className="fw-semibold">{author}</span>
                    </p>
                  </div>
                </Col>
                <Col lg={6} className="d-none d-lg-block">
                  <div className="h-100 position-relative card-side-img rounded-end-4 rounded-end rounded-0 overflow-hidden">
                    <div className="p-4 card-img-overlay rounded-4 rounded-start-0 auth-overlay d-flex align-items-end justify-content-center"></div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Page
