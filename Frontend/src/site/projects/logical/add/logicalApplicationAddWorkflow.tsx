import { useState } from 'react'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { step1Schema } from './steps/validations'
import { LogicalApplicationAddStep1 } from './steps/step1'
import { LogicalApplicationAddStep2 } from './steps/step2'
import { LogicalApplicationAddStep3 } from './steps/step3'
import { LogicalApplicationsApiClient, type ILogicalApplicationsPostRequest } from '@/services/logicalApplications/logicalApplicationsApiClient'
import type { WorkflowStep } from '@/components/Workflow/types'
import { Workflow } from '@/components/Workflow/workflow'
import { useNavigate } from 'react-router'
import { clientValidationHandler, serverPostValidationHandler } from '@/helpers/form'

interface AddLogicalApplicationWorkflowProps {
  projectKey: string
  projectId: string
  onComplete?: (data: ILogicalApplicationsPostRequest) => void
  onCancel: () => void
}

export const AddLogicalApplicationWorkflow = ({ projectKey, onComplete, onCancel }: AddLogicalApplicationWorkflowProps) => {
  const navigate = useNavigate()

  const [logicalApplicationData, setLogicalApplicationData] = useState<ILogicalApplicationsPostRequest>({
    name: '',
    key: '',
    description: '',
    ownerId: undefined,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ILogicalApplicationsPostRequest, string>>>({})
  const [serverValidationErrors, setServerValidationErrors] = useState<Record<string, string[]>>({})

  const updateLogicalApplicationData = (field: keyof ILogicalApplicationsPostRequest, value: string | undefined) => {
    setLogicalApplicationData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const step1Next = async () => {
    try {
      await step1Schema.validate(logicalApplicationData, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      return clientValidationHandler<ILogicalApplicationsPostRequest>(err, setErrors);
    }
  }

  const step2Previous = async () => {
    setServerValidationErrors({})
    return true
  }

  const step2Next = async () => {
    // Clear previous server validation errors
    setServerValidationErrors({})

    try {
      const client = new LogicalApplicationsApiClient()
      const createdLogicalApplication = await client.post(projectKey, logicalApplicationData)

      console.log('Logical application created successfully:', createdLogicalApplication)

      if (onComplete) {
        onComplete(logicalApplicationData)
      }

      return true
    } catch (error: unknown) {
      return serverPostValidationHandler(error, setServerValidationErrors)
    }
  }

  const step3Next = async () => {
    navigate(`/projects/${projectKey}`)
    return true
  }

  const steps: WorkflowStep[] = [
    {
      title: 'Logical Application Details',
      description: 'Basic information about your logical application',
      onNext: step1Next,
      content: (
        <LogicalApplicationAddStep1
          logicalApplicationData={logicalApplicationData}
          errors={errors}
          updateLogicalApplicationData={updateLogicalApplicationData}
        />
      ),
    },
    {
      title: 'Review & Summary',
      description: 'Review your logical application details',
      content: (
        <LogicalApplicationAddStep2 logicalApplicationData={logicalApplicationData} users={fakeUsers} validationErrors={serverValidationErrors} />
      ),
      nextButtonText: 'Create Logical Application',
      onNext: step2Next,
      onPrevious: step2Previous,
    },
    {
      title: 'Completed',
      description: 'Logical application created successfully',
      content: <LogicalApplicationAddStep3 logicalApplicationData={logicalApplicationData} users={fakeUsers} projectKey={projectKey} />,
      nextButtonText: 'Finish',
      onNext: step3Next,
    },
  ]

  return <Workflow title="Add New Logical Application" steps={steps} onCancel={onCancel} />
}

export default AddLogicalApplicationWorkflow
