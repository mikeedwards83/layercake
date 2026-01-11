import { useState } from 'react'
import { RichTextInput } from '@/components/Form/RichTextInput/RichTextInput'
import { Card, CardBody, Button, ButtonGroup } from 'react-bootstrap'
import { TbDeviceFloppy, TbX } from 'react-icons/tb'
import { WikiPageApiClient, type IWikiPage } from '@/services/wikipage/wikiPageApiClient'

interface IProjectDocumentationEditProps {
  wikiPage: IWikiPage
  onSave: (updatedWikiPage: IWikiPage) => void
  onCancel: () => void
  onError: (error: string) => void
}

export const ProjectDocumentationEdit = ({
  wikiPage,
  onSave,
  onCancel,
  onError,
}: IProjectDocumentationEditProps) => {
  const [editedContent, setEditedContent] = useState(wikiPage.contents)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      const client = new WikiPageApiClient()

      const response = await client.update(wikiPage.id, { contents: editedContent })

      onSave(response.wikiPage)
    } catch (err) {
      console.error('Error saving wiki page:', err)
      onError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
      <Card className='h-100'>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{wikiPage.title}</h4>
            <ButtonGroup size="sm">
              <Button variant="success" onClick={handleSave} disabled={saving}>
                <TbDeviceFloppy className="me-1" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="secondary" onClick={onCancel} disabled={saving}>
                <TbX className="me-1" />
                Cancel
              </Button>
            </ButtonGroup>
          </div>

          <div style={{ minHeight: '50vh' }}>
            <RichTextInput
              label=""
              value={editedContent}
              onChange={setEditedContent}
              placeholder="Enter documentation content..."
              referenceId={wikiPage.referenceId}
            />
          </div>
        </CardBody>
      </Card>
  )
}
