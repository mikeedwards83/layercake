export type WorkflowStep = {
  id: number
  title: string
  description: string
  content: ReactNode
  onNext?: () => Promise<boolean> | boolean
  onPrevious?:  () => Promise<boolean> |boolean
  nextButtonText?: string
}