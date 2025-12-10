import { useState } from 'react'
import * as Yup from 'yup'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { step1Schema } from './steps/validations'
import { ProjectAddStep1 } from './steps/step1'
import { ProjectAddStep2 } from './steps/step2'
import { ProjectAddStep3 } from './steps/step3'
import { ProjectsApiClient, type IProjectsPostRequest } from '@/services/projects/projectsApiClient'
import type { WorkflowStep } from '@/components/Workflow/types'
import { Workflow } from '@/components/Workflow/workflow'
import { useNavigate } from 'react-router'

interface AddProjectWorkflowProps {
  onComplete?: (data: IProjectsPostRequest) => void
  onCancel: () => void
}

export const AddProjectWorkflow = ({ onComplete, onCancel }: AddProjectWorkflowProps) => {
  const navigate = useNavigate()

  const [projectData, setProjectData] = useState<IProjectsPostRequest>({
    name: '',
    key: '',
    description: '',
    icon: 'Folder',
    color: '#0d6efd',
    ownerId: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof IProjectsPostRequest, string>>>({})
  const [serverValidationErrors, setServerValidationErrors] = useState<Record<string, string[]>>({})

  const updateProjectData = (field: keyof IProjectsPostRequest, value: string | undefined) => {
    setProjectData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const step1Next = async () => {
    try {
      await step1Schema.validate(projectData, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Partial<Record<keyof IProjectsPostRequest, string>> = {}
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof IProjectsPostRequest] = error.message
          }
        })
        setErrors(validationErrors)
      }
      return false
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
      const client = new ProjectsApiClient()
      const createdProject = await client.post(projectData)

      console.log('Project created successfully:', createdProject)

      if (onComplete) {
        onComplete(projectData)
      }

      return true
    } catch (error: unknown) {
      console.error('Error creating project:', error)

      // Handle validation errors from the server
      if (error instanceof Error && 'status' in error && error.status == 400) {
        const validationError = error as Error & { status: number; validationErrors: Record<string, string[]> }
        if (validationError.status === 400 && validationError.validationErrors) {
          setServerValidationErrors(validationError.validationErrors)
          return false
        }
      }

      // For other errors, re-throw
      throw error
    }
  }

  const step3Next = async () => {
    navigate('/projects')
    return true
  }

  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Project Details',
      description: 'Basic information about your project',
      onNext: step1Next,
      content: <ProjectAddStep1 projectData={projectData} errors={errors} updateProjectData={updateProjectData} />,
    },
    {
      id: 2,
      title: 'Review & Summary',
      description: 'Review your project details',
      content: <ProjectAddStep2 projectData={projectData} users={fakeUsers} validationErrors={serverValidationErrors} />,
      nextButtonText: 'Create Project',
      onNext: step2Next,
      onPrevious: step2Previous,
    },
    {
      id: 3,
      title: 'Completed',
      description: 'Project created successfully',
      content: <ProjectAddStep3 projectData={projectData} users={fakeUsers} />,
      nextButtonText: 'Finish',
      onNext: step3Next,
    },
  ]

  return <Workflow title="Add New Project" steps={steps} onCancel={onCancel} />
}

export default AddProjectWorkflow
