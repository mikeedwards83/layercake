import { useState } from 'react'
import { RichTextInput } from '@/components/Form/RichTextInput/RichTextInput'
import { Card, CardBody, Button, ButtonGroup, Form } from 'react-bootstrap'
import { TbDeviceFloppy, TbX } from 'react-icons/tb'
import { WikiPageApiClient, type IWikiPage } from '@/services/wikipage/wikiPageApiClient'

interface IProjectDocumentationNewProps {
  parentPage: IWikiPage
  onSave: (newWikiPage: IWikiPage) => void
  onCancel: () => void
  onError: (error: string) => void
}

export const ProjectDocumentationNew = ({
  parentPage,
  onSave,
  onCancel,
  onError,
}: IProjectDocumentationNewProps) => {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) {
      onError('Page title is required')
      return
    }

    try {
      setSaving(true)
      const client = new WikiPageApiClient()

      const response = await client.create({
        title: title.trim(),
        contents: contents,
        parentId: parentPage.id,
        referenceId: parentPage.referenceId,
      })

      onSave(response.wikiPage)
    } catch (err) {
      console.error('Error creating wiki page:', err)
      onError('Failed to create new page. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">New Page</h4>
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

          <Form.Group className="mb-3">
            <Form.Label>Page Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={saving}
            />
            <Form.Text className="text-muted">
              Maximum 100 characters
            </Form.Text>
          </Form.Group>

          <div style={{ minHeight: '50vh' }}>
            <RichTextInput
              label="Page Contents"
              value={contents}
              onChange={setContents}
              placeholder="Enter page content..."
            />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
