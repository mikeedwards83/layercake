export type WorkflowStep = {
  title: string
  description: string
  hideHeading?: boolean
  content: ReactNode
  onNext?: () => Promise<boolean> | boolean
  onPrevious?:  () => Promise<boolean> |boolean
  nextButtonText?: string
}