import { Icon } from '@/components/Icon'
import { RichTextReview } from '@/components/Review'
import type { IProjectGetByKeyResponse } from '@/services/project/projectApiClient'
import { Card, CardBody, CardHeader } from 'react-bootstrap'

interface IProjectDocumentationProps {
  projectResponse: IProjectGetByKeyResponse
}

export const ProjectDocumentation = ({ projectResponse }: IProjectDocumentationProps) => {
  return (
    <div className="p-3">
      <h4>Documentation</h4>
      <p>Documentation content goes here</p>
    </div>
  )
}
