import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '@/firebase'
import { Workflow } from '@/components/Workflow/workflow'
import type { WorkflowStep } from '@/components/Workflow/types'
import { InvitesApiClient, type IInviteDetailsResponse } from '@/services/invites/invitesApiClient'
import { Step1Welcome } from './steps/step1Welcome'
import { Step2Password } from './steps/step2Password'
import { Step3Confirm } from './steps/step3Confirm'
import { Step4Success } from './steps/step4Success'
import { ValidationErrors } from '@/constants'

interface InviteWorkflowProps {
  token: string
  inviteDetails: IInviteDetailsResponse
}

export const InviteWorkflow = ({ token, inviteDetails }: InviteWorkflowProps) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [serverError, setServerError] = useState<string | undefined>()
  const [displayName, setDisplayName] = useState('')

  const validatePassword = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      newErrors.password = ValidationErrors.PASSWORD.REQUIRED
    } else if (password.length < 8) {
      newErrors.password = ValidationErrors.PASSWORD.MIN_LENGTH
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = ValidationErrors.PASSWORD.LOWERCASE
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = ValidationErrors.PASSWORD.UPPERCASE
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      newErrors.password = ValidationErrors.PASSWORD.SPECIAL_CHAR
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = ValidationErrors.PASSWORD.CONFIRM_REQUIRED
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = ValidationErrors.PASSWORD.MISMATCH
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const step2Next = async () => {
    return validatePassword()
  }

  const step3Next = async () => {
    setServerError(undefined)

    try {
      const client = new InvitesApiClient()
      const result = await client.accept(token, { password, confirmPassword })

      // Sign in with the custom token
      await signInWithCustomToken(auth, result.customToken)

      setDisplayName(result.displayName)
      return true
    } catch (error: any) {
      console.error('Error accepting invite:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete registration. Please try again.'
      setServerError(errorMessage)
      return false
    }
  }

  const handleCancel = () => {
    navigate('/signin')
  }

  const steps: WorkflowStep[] = [
    {
      title: 'Welcome',
      description: 'You have been invited to join Layer Cake',
      content: <Step1Welcome inviteDetails={inviteDetails} />,
      hideHeading: true
    },
    {
      title: 'Create Password',
      description: 'Set up your account password',
      content: (
        <Step2Password
          password={password}
          confirmPassword={confirmPassword}
          errors={errors}
          onPasswordChange={(value) => {
            setPassword(value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          onConfirmPasswordChange={(value) => {
            setConfirmPassword(value)
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
          }}
        />
      ),
      onNext: step2Next,
    },
    {
      title: 'Confirm',
      description: 'Review and complete your registration',
      content: <Step3Confirm inviteDetails={inviteDetails} serverError={serverError} />,
      nextButtonText: 'Complete Registration',
      onNext: step3Next,
    },
    {
      title: 'Complete',
      description: 'Registration successful',
      content: <Step4Success displayName={displayName || `${inviteDetails.firstName} ${inviteDetails.lastName}`} />,
      hideHeading:true
    },
  ]

  return <Workflow title="Accept Invitation" steps={steps} onCancel={handleCancel} showLogo />
}
