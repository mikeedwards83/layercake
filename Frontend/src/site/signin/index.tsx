import AppLogo from '@/components/AppLogo'
import { author, currentYear } from '@/helpers'
import { Link, useNavigate } from 'react-router'
import { Card, Col, Row } from 'react-bootstrap'
import PageMetaData from '@/components/PageMetaData'
import { useEffect, useRef } from 'react'
import { auth } from '@/firebase'
import * as firebaseui from 'firebaseui'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import 'firebaseui/dist/firebaseui.css'
import { Settings } from '@/Settings'

const Page = () => {
  const navigate = useNavigate()
  const uiRef = useRef<firebaseui.auth.AuthUI | null>(null)

  useEffect(() => {
    // Initialize FirebaseUI
    if (!uiRef.current) {
      uiRef.current = new firebaseui.auth.AuthUI(auth)
    }

    const uiConfig: firebaseui.auth.Config = {
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
      ],
      signInSuccessUrl: Settings.signIn.successUrl,
      callbacks: {
        signInSuccessWithAuthResult: () => {
          navigate(Settings.signIn.successUrl)
          return false
        },
      },
    }

    // Start the FirebaseUI widget
    uiRef.current.start('#firebaseui-auth-container', uiConfig)

    // Cleanup
    return () => {
      if (uiRef.current) {
        uiRef.current.reset()
      }
    }
  }, [navigate])

  return (
    <div className="auth-box d-flex align-items-center">
      <PageMetaData title="Sign In" />
      <div className="container-xxl">
        <Row className="align-items-center justify-content-center">
          <Col xl={10}>
            <Card className="rounded-4">
              <Row className="justify-content-between g-0">
                <Col lg={6}>
                  <div className="card-body">
                    <div className="auth-brand text-center mb-4">
                      <AppLogo />
                      <h4 className="fw-bold mt-4">Welcome to IN+</h4>
                      <p className="text-muted w-lg-75 mx-auto">Let's get you signed in. Choose your preferred method to continue.</p>
                    </div>

                    <div id="firebaseui-auth-container"></div>

                    <p className="text-muted text-center mt-4 mb-0">
                      New here?{' '}
                      <Link to="/signup" className="text-decoration-underline link-offset-3 fw-semibold">
                        Create an account
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
