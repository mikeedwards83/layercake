import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap'
import { TbChevronRight, TbX } from 'react-icons/tb'
import { useState } from 'react'
import type { WorkflowStep } from './types'
import { WorkflowSidebar } from './workflowSidebar'



type WorkflowProps = {
  title: string
  steps: WorkflowStep[]
  onCancel: () => void
}

export const Workflow = ({ title, steps, onCancel }: WorkflowProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isValidating, setIsValidating] = useState(false)

  const totalSteps = steps.length
  const progressPercentage = ((currentStepIndex) / (totalSteps - 1)) * 100

  const handleNext = async () => {
    const currentStepData = steps[currentStepIndex]

    if (currentStepData?.onNext) {
      setIsValidating(true)
      try {
        const isValid = await currentStepData.onNext()
        if (isValid && currentStepIndex < totalSteps) {
          setCurrentStepIndex(currentStepIndex + 1)
        }
      } finally {
        setIsValidating(false)
      }
    } else if (currentStepIndex < totalSteps) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const currentStep: WorkflowStep | undefined = steps[currentStepIndex]

  return (
    <Row className="g-0">
      <Col xl={3}>
        <WorkflowSidebar
          title={title}
          steps={steps}
          currentStep={currentStepIndex}
          progressPercentage={progressPercentage}
          setCurrentStep={setCurrentStepIndex}
        />
      </Col>
      <Col xl={9}>
        <Card className="card-h-100 rounded-0 rounded-end">
          <CardBody className="p-4">
            <div className="mb-4">
              <h3>{currentStep.title}</h3>
              <p className="text-muted">{currentStep.description}</p>
            </div>
            <div style={{ minHeight: '500px' }}>{currentStep?.content}</div>
          </CardBody>
          <CardFooter>
            <div className="d-flex justify-content-between align-items-center">
             {currentStepIndex != steps.length-1 && (<button className="btn btn-outline-secondary" onClick={onCancel} disabled={isValidating}>
                <TbX className="me-1" />
                Cancel
              </button>)}
              {currentStepIndex == steps.length-1 && <div></div>}
              <div className="d-flex gap-2">
                {currentStepIndex > 0 && currentStepIndex < (steps.length-1) && (
                  <button className="btn btn-outline-primary" onClick={handlePrevious} disabled={isValidating}>
                    Previous
                  </button>
                )}
                <button className="btn btn-primary" onClick={handleNext} disabled={isValidating}>
                  {isValidating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Validating...
                    </>
                  ) : (
                    <>
                      {currentStep?.nextButtonText ?? 'Next'}
                      <TbChevronRight className="ms-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}


