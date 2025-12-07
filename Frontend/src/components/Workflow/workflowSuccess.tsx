import type { ReactNode } from "react"
import { Card, Col, Row } from "react-bootstrap"
import { LuCheck } from "react-icons/lu"

interface IWorkflowSuccess {
  title: string
  children:ReactNode
}

export const WorkflowSuccess = ({ title, children }: IWorkflowSuccess) => {
  return (
    <div>
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Card className="border-success">
            <Card.Body className="p-4">
              <div className="text-center py-5">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ width: '100px', height: '100px' }}>
                  <LuCheck size={60} strokeWidth={3} />
                </div>
                <h3>{title}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="text-center">
        <div className="d-flex gap-3 justify-content-center">
            {children}        
        </div>
      </div>
    </div>
  )
}
