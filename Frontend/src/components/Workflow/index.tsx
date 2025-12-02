import { Card, CardBody, Col, ProgressBar, Row } from 'react-bootstrap'
import { TbCheck, TbChevronRight, TbX } from 'react-icons/tb'
import { type ReactNode, useState } from 'react'

export type WorkflowStep = {
  id: number
  title: string
  description: string
  content: ReactNode
}

type WorkflowProps = {
  title: string
  steps: WorkflowStep[]
  onComplete: () => void
  onCancel: () => void
  completionButtonText?: string
}

export const Workflow = ({ title, steps, onComplete, onCancel, completionButtonText = 'Complete' }: WorkflowProps) => {
  const [currentStep, setCurrentStep] = useState(1)

  const totalSteps = steps.length
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepContent = steps.find((step) => step.id === currentStep)?.content

  return (
    <Row className="g-0">
      <Col xl={3}>
        <WorkflowSidebar
          title={title}
          steps={steps}
          currentStep={currentStep}
          progressPercentage={progressPercentage}
          setCurrentStep={setCurrentStep}
        />
      </Col>
      <Col xl={9}>
        <Card className="card-h-100 rounded-0 rounded-end">
          <CardBody className="p-4">
            <div style={{ minHeight: '500px' }}>{currentStepContent}</div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-outline-secondary" onClick={onCancel}>
                <TbX className="me-1" />
                Cancel
              </button>
              <div className="d-flex gap-2">
                {currentStep > 1 && (
                  <button className="btn btn-outline-primary" onClick={handlePrevious}>
                    Previous
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button className="btn btn-primary" onClick={handleNext}>
                    Next
                    <TbChevronRight className="ms-1" />
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={onComplete}>
                    <TbCheck className="me-1" />
                    {completionButtonText}
                  </button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

type WorkflowSidebarProps = {
  title: string
  steps: WorkflowStep[]
  currentStep: number
  progressPercentage: number
  setCurrentStep: (step: number) => void
}

const WorkflowSidebar = ({ title, steps, currentStep, progressPercentage, setCurrentStep }: WorkflowSidebarProps) => {

  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardBody className="p-4">
        <div className="mb-4">
          <h4 className="mb-3">{title}</h4>
          <div className="mb-2">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted fs-sm">Progress</span>
              <span className="text-muted fs-sm">{Math.round(progressPercentage)}%</span>
            </div>
            <ProgressBar now={progressPercentage} variant="primary" style={{ height: '8px' }} />
          </div>
        </div>

        <div className="workflow-steps">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep - 1
            const isCurrent = step.id === currentStep
            const isClickable = index < currentStep - 1

            return (
              <div
                key={step.id}
                className={`workflow-step mb-3 ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                onClick={() => isClickable && setCurrentStep(step.id)}>
                <div className="d-flex align-items-start">
                  <div
                    className={`step-number me-3 ${isCurrent ? 'bg-primary text-white' : isCompleted ? 'bg-success text-white' : 'bg-light text-muted'}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                    {isCompleted ? <TbCheck size={18} /> : step.id}
                  </div>
                  <div>
                    <h6 className={`mb-0 ${isCurrent ? 'text-primary' : ''}`}>{step.title}</h6>
                    <p className="text-muted fs-sm mb-0">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
