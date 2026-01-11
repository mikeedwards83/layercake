import { RichTextReview } from '@/components/Review'
import { Card, CardBody, Button, ButtonGroup, CardHeader } from 'react-bootstrap'
import { TbEdit, TbPlus } from 'react-icons/tb'
import type { IWikiPage } from '@/services/wikipage/wikiPageApiClient'

interface IProjectDocumentationViewProps {
  wikiPage: IWikiPage
  projectKey: string
  onEdit: () => void
  onNewPage: () => void
}

export const ProjectDocumentationView = ({ wikiPage, projectKey, onEdit, onNewPage }: IProjectDocumentationViewProps) => {
  return (
      <Card className='h-100  rounded-start-0 rounded-top-0'>
        <CardHeader>
          <div className="d-flex justify-content-between align-items-center w-100">
            <h3 className="mb-0">{wikiPage.title}</h3>
            <ButtonGroup size="sm">
              <Button variant="success" onClick={onNewPage}>
                <TbPlus className="me-1" />
                New Page
              </Button>
              <Button variant="primary" onClick={onEdit}>
                <TbEdit className="me-1" />
                Edit
              </Button>
            </ButtonGroup>
          </div>
        </CardHeader>
        <CardBody>
          <RichTextReview label="" value={wikiPage.contents} projectKey={projectKey} />
        </CardBody>
      </Card>
  )
}
