import React, { Component, ReactNode } from 'react'
import { Alert, Button, Card, Container } from 'react-bootstrap'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, resetError: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError)
      }

      return (
        <Container fluid className="py-4">
          <Card className="border-danger">
            <Card.Body>
              <Alert variant="danger">
                <Alert.Heading>Something went wrong</Alert.Heading>
                <p className="mb-3">
                  An unexpected error occurred while processing your request. Please try again or contact support if the problem persists.
                </p>
                <hr />
                <div className="mb-3">
                  <strong>Error Details:</strong>
                  <pre className="mt-2 p-3 bg-light border rounded" style={{ fontSize: '0.875rem', maxHeight: '300px', overflow: 'auto' }}>
                    {this.state.error.message}
                    {this.state.error.stack && (
                      <>
                        {'\n\n'}
                        {this.state.error.stack}
                      </>
                    )}
                  </pre>
                </div>
                <Button variant="primary" onClick={this.resetError}>
                  Try Again
                </Button>
              </Alert>
            </Card.Body>
          </Card>
        </Container>
      )
    }

    return this.props.children
  }
}
