import { useState } from 'react'
import * as Yup from 'yup'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { step1Schema } from './steps/validations'
import { ProjectAddStep1 } from './steps/step1'
import { ProjectAddStep2 } from './steps/step2'
import { ProjectAddStep3 } from './steps/step3'
import { ProjectsApiClient, type ProjectsPostRequest } from '@/services/projects/projectsApiClient'
import type { WorkflowStep } from '@/components/Workflow/types'
import { Workflow } from '@/components/Workflow/workflow'

interface AddProjectWorkflowProps {
  onComplete: (data: ProjectsPostRequest) => void
  onCancel: () => void
}

export const AddProjectWorkflow = ({ onComplete, onCancel }: AddProjectWorkflowProps) => {

  const [projectData, setProjectData] = useState<ProjectsPostRequest>({
    name: '',
    key: '',
    description: '',
    icon: 'Folder',
    color: '#0d6efd',
    ownerId: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectsPostRequest, string>>>({})

  const updateProjectData = (field: keyof ProjectsPostRequest, value: string|undefined) => {
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
        const validationErrors: Partial<Record<keyof ProjectsPostRequest, string>> = {}
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof ProjectsPostRequest] = error.message
          }
        })
        setErrors(validationErrors)
      }
      return false
    }
  }

  const step2Next = async () => {

    try {

      const client = new ProjectsApiClient();
      const createdProject = await client.post(projectData);

      console.log('Project created successfully:', createdProject)

      onComplete(projectData)
      return true;
    } catch (error) {
      console.error('Error creating project:', error)
      // You might want to show an error message to the user here
      throw error
    }
  }

  const step3Next = async ()=>{

    return true;
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
      content: <ProjectAddStep2 projectData={projectData} users={fakeUsers} />,
      nextButtonText:"Create Project",
      onNext: step2Next

    },
    {
      id: 3,
      title: 'Completed',
      description: 'Project created successfully',
      content: <ProjectAddStep3 projectData={projectData} users={fakeUsers} />,
      nextButtonText:"Finish",
      onNext:step3Next
    },
  ]

  return <Workflow title="Add New Project" steps={steps}  onCancel={onCancel} />
}

export default AddProjectWorkflow
