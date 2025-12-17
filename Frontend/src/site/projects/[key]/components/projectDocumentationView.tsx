import { RichTextReview } from '@/components/Review'
import { Card, CardBody, Button, ButtonGroup } from 'react-bootstrap'
import { TbEdit, TbPlus } from 'react-icons/tb'
import type { IWikiPage } from '@/services/wikipage/wikiPageApiClient'

interface IProjectDocumentationViewProps {
  wikiPage: IWikiPage
  onEdit: () => void
  onNewPage: () => void
}

export const ProjectDocumentationView = ({ wikiPage, onEdit, onNewPage }: IProjectDocumentationViewProps) => {
  return (
    <div>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{wikiPage.title}</h4>
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
          <RichTextReview label="" value={wikiPage.contents} />
        </CardBody>
      </Card>
    </div>
  )
}
