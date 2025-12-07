import { Card, CardBody, ProgressBar } from "react-bootstrap"
import { TbCheck } from "react-icons/tb"
import type { WorkflowStep } from "./types"

type WorkflowSidebarProps = {
  title: string
  steps: WorkflowStep[]
  currentStep: number
  progressPercentage: number
  setCurrentStep: (step: number) => void
}

export const WorkflowSidebar = ({ title, steps, currentStep, progressPercentage, setCurrentStep }: WorkflowSidebarProps) => {
  return (
    <Card className="card-h-100 rounded-0 rounded-start">
      <CardBody className="p-4">
        <div className="mb-4">
          <h2 className="mb-3">{title}</h2>
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
            const isCompleted = index < currentStep 
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
                    className={`step-number me-3 ${
                      isCurrent ? 'bg-primary text-white' : isCompleted ? 'bg-success text-white' : 'bg-light text-muted'
                    }`}
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
                    <h4 className={`mb-0 ${isCurrent ? 'text-primary' : ''}`}>{step.title}</h4>
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
