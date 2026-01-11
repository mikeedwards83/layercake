import { useState } from 'react'
import * as Yup from 'yup'
import { RichTextInput } from '@/components/Form/RichTextInput/RichTextInput'
import { Card, CardBody, Button, ButtonGroup, Form } from 'react-bootstrap'
import { TbDeviceFloppy, TbX } from 'react-icons/tb'
import { WikiPageApiClient, type IWikiPage } from '@/services/wikipage/wikiPageApiClient'
import { ValidationSummary } from '@/components/Form/ValidationSummary/validationSummary'
import { TextInput } from '@/components/Form/TextInput'

const wikiPageSchema = Yup.object().shape({
  title: Yup.string().trim().required('Page title is required').max(100, 'Page title must be 100 characters or less'),
  contents: Yup.string(),
})

interface IProjectDocumentationNewProps {
  parentPage: IWikiPage
  onSave: (newWikiPage: IWikiPage) => void
  onCancel: () => void
  onError: (error: string) => void
}

export const ProjectDocumentationNew = ({ parentPage, onSave, onCancel, onError }: IProjectDocumentationNewProps) => {
  const [title, setTitle] = useState<string|undefined>()
  const [contents, setContents] = useState('')
  const [saving, setSaving] = useState(false)
  const [clientValidationErrors, setClientValidationErrors] = useState<{ title?: string; contents?: string }>({})
  const [serverValidationErrors, setServerValidationErrors] = useState<Record<string, string[]>>({})

  const handleTitleChange = (value?: string) => {
    setTitle(value)
    // Clear client validation error when user starts typing
    if (clientValidationErrors.title) {
      setClientValidationErrors((prev) => ({ ...prev, title: undefined }))
    }
  }

  const handleContentsChange = (value: string) => {
    setContents(value)
    // Clear client validation error when user starts typing
    if (clientValidationErrors.contents) {
      setClientValidationErrors((prev) => ({ ...prev, contents: undefined }))
    }
  }

  const handleSave = async () => {
    // Clear previous errors
    setClientValidationErrors({})
    setServerValidationErrors({})

    // Validate with Yup
    try {
      await wikiPageSchema.validate({ title, contents }, { abortEarly: false })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { title?: string; contents?: string } = {}
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as 'title' | 'contents'] = error.message
          }
        })
        setClientValidationErrors(validationErrors)
      }
      return
    }

    try {
      setSaving(true)
      const client = new WikiPageApiClient()

      const response = await client.create({
        title: title?.trim() ?? '',
        contents: contents,
        parentId: parentPage.id,
        referenceId: parentPage.referenceId,
      })

      onSave(response.wikiPage)
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status == 400) {
        const validationError = error as Error & { status: number; validationErrors: Record<string, string[]> }
        if (validationError.status === 400 && validationError.validationErrors) {
          setServerValidationErrors(validationError.validationErrors)
          return
        }
      }
      console.error('Error creating wiki page:', error)
      onError('Failed to create new page. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="h-100">
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
        <ValidationSummary errors={serverValidationErrors} />
        <TextInput
            label='Page Title *'
            placeholder="Enter page title"
            value={title}
            onChange={value => handleTitleChange(value)}
            maxChars={100}
            error={clientValidationErrors.title}
            required
         />
        <div style={{ minHeight: '50vh' }}>
          <RichTextInput
            label="Page Contents"
            value={contents}
            onChange={handleContentsChange}
            placeholder="Enter page content..."
            referenceId={parentPage.referenceId}
            error={clientValidationErrors.contents}
          />
        </div>
      </CardBody>
    </Card>
  )
}
