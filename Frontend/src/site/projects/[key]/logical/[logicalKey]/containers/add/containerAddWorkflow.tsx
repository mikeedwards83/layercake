import { useState } from 'react'
import { step1Schema } from './steps/validations'
import { ContainerAddStep1 } from './steps/step1'
import { ContainerAddStep2 } from './steps/step2'
import { ContainerAddStep3 } from './steps/step3'
import { ContainersApiClient, type IContainersPostRequest } from '@/services/containers/containersApiClient'
import type { WorkflowStep } from '@/components/Workflow/types'
import { Workflow } from '@/components/Workflow/workflow'
import { useNavigate } from 'react-router'
import { clientValidationHandler, serverPostValidationHandler } from '@/helpers/form'
import { createKeyAutoGenerator } from '@/helpers/keyGenerator'

interface AddContainerWorkflowProps {
  projectKey: string
  logicalKey: string
  onComplete?: (data: IContainersPostRequest) => void
  onCancel: () => void
}

export const AddContainerWorkflow = ({ projectKey, logicalKey, onComplete, onCancel }: AddContainerWorkflowProps) => {
  const navigate = useNavigate()

  const [containerData, setContainerData] = useState<IContainersPostRequest>({
    name: '',
    key: '',
    description: '',
    type: 0,
    icon: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof IContainersPostRequest, string>>>({})
  const [serverValidationErrors, setServerValidationErrors] = useState<Record<string, string[]>>({})
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false)

  const updateContainerData = (field: keyof IContainersPostRequest, value: string | undefined) => {
    // Use the key auto-generator helper for name/key fields
    if (field === 'name' || field === 'key') {
      const keyAutoGenerator = createKeyAutoGenerator(setContainerData, isKeyManuallyEdited, setIsKeyManuallyEdited)
      keyAutoGenerator(field, value)
    } else {
      // Direct update for other fields
      setContainerData((prev) => ({
        ...prev,
        [field]: field === 'type' && value ? parseInt(value) : value,
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const step1Next = async () => {
    try {
      await step1Schema.validate(containerData, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      return clientValidationHandler<IContainersPostRequest>(err, setErrors)
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
      const client = new ContainersApiClient()
      const createdContainer = await client.post(projectKey, logicalKey, containerData)

      console.log('Container created successfully:', createdContainer)

      if (onComplete) {
        onComplete(containerData)
      }

      return true
    } catch (error: unknown) {
      return serverPostValidationHandler(error, setServerValidationErrors)
    }
  }

  const step3Next = async () => {
    navigate(`/projects/${projectKey}/logical/${logicalKey}`)
    return true
  }

  const steps: WorkflowStep[] = [
    {
      title: 'Container Details',
      description: 'Basic information about your container',
      onNext: step1Next,
      content: <ContainerAddStep1 containerData={containerData} errors={errors} updateContainerData={updateContainerData} />,
    },
    {
      title: 'Review & Summary',
      description: 'Review your container details',
      content: <ContainerAddStep2 containerData={containerData} validationErrors={serverValidationErrors} />,
      nextButtonText: 'Create Container',
      onNext: step2Next,
      onPrevious: step2Previous,
    },
    {
      title: 'Completed',
      description: 'Container created successfully',
      content: <ContainerAddStep3 containerData={containerData} projectKey={projectKey} logicalKey={logicalKey} />,
      nextButtonText: 'Finish',
      onNext: step3Next,
    },
  ]

  return <Workflow title="Add New Container" steps={steps} onCancel={onCancel} />
}

export default AddContainerWorkflow
