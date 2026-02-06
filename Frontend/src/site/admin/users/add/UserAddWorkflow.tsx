import { useState } from 'react'
import { useNavigate } from 'react-router'
import { step1Schema } from './steps/validations'
import { UserAddStep1 } from './steps/step1'
import { UserAddStep2 } from './steps/step2'
import { UserAddStep3 } from './steps/step3'
import { UsersApiClient, type IUserCreateRequest } from '@/services/users/usersApiClient'
import type { WorkflowStep } from '@/components/Workflow/types'
import { Workflow } from '@/components/Workflow/workflow'
import { clientValidationHandler, serverPostValidationHandler } from '@/helpers/form'

interface UserAddWorkflowProps {
  onComplete?: (data: IUserCreateRequest) => void
  onCancel: () => void
}

export const UserAddWorkflow = ({ onComplete, onCancel }: UserAddWorkflowProps) => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState<IUserCreateRequest>({
    email: '',
    firstName: '',
    lastName: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof IUserCreateRequest, string>>>({})
  const [serverValidationErrors, setServerValidationErrors] = useState<Record<string, string[]>>({})

  const updateUserData = (field: keyof IUserCreateRequest, value: string | undefined) => {
    setUserData((prev) => ({ ...prev, [field]: value ?? '' }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const step1Next = async () => {
    try {
      await step1Schema.validate(userData, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      return clientValidationHandler<IUserCreateRequest>(err, setErrors)
    }
  }

  const step2Previous = async () => {
    setServerValidationErrors({})
    return true
  }

  const step2Next = async () => {
    setServerValidationErrors({})

    try {
      const client = new UsersApiClient()
      const createdUser = await client.create(userData)

      console.log('User created successfully:', createdUser)

      if (onComplete) {
        onComplete(userData)
      }

      return true
    } catch (error: unknown) {
      return serverPostValidationHandler(error, setServerValidationErrors)
    }
  }

  const step3Next = async () => {
    navigate('/admin/users')
    return true
  }

  const steps: WorkflowStep[] = [
    {
      title: 'User Details',
      description: 'Basic information about the user',
      onNext: step1Next,
      content: <UserAddStep1 userData={userData} errors={errors} updateUserData={updateUserData} />,
    },
    {
      title: 'Review & Summary',
      description: 'Review user details',
      content: <UserAddStep2 userData={userData} validationErrors={serverValidationErrors} />,
      nextButtonText: 'Create User',
      onNext: step2Next,
      onPrevious: step2Previous,
    },
    {
      title: 'Completed',
      description: 'User created successfully',
      content: <UserAddStep3 userData={userData} />,
      nextButtonText: 'Finish',
      onNext: step3Next,
    },
  ]

  return <Workflow title="Add New User" steps={steps} onCancel={onCancel} />
}

export default UserAddWorkflow
