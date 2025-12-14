import { generateId } from '@/components/Form/formhelps'
import { Form } from 'react-bootstrap'

interface RichTextReviewProps {
  label: string
  value?: string
  className?: string
}

// Convert Markdown format to HTML
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return ''

  let html = markdown

  // Handle combinations first (order matters!)
  // _***text***_ -> bold, italic, underline
  html = html.replace(/_\*\*\*(.*?)\*\*\*_/g, '<u><strong><em>$1</em></strong></u>')

  // _**text**_ -> bold, underline
  html = html.replace(/_\*\*(.*?)\*\*_/g, '<u><strong>$1</strong></u>')

  // _*text*_ -> italic, underline
  html = html.replace(/_\*(.*?)\*_/g, '<u><em>$1</em></u>')

  // ***text*** -> bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')

  // **text** -> bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // *text* -> italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // _text_ -> underline (handle after combinations to avoid conflicts)
  html = html.replace(/_(.*?)_/g, '<u>$1</u>')

  // Convert line breaks to <br> tags
  html = html.replace(/\n/g, '<br>')

  return html
}

export const RichTextReview = ({ label, value, className = '' }: RichTextReviewProps) => {
  const id = generateId(label)
  const htmlContent = markdownToHtml(value || '')

  return (
    <div className="mb-3">
      <Form.Label htmlFor={id} className="text-muted">
        {label}
      </Form.Label>
      <div
        id={id}
        className={className}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
