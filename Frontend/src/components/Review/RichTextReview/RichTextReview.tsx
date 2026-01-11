import { useState, useEffect } from 'react'
import { generateId } from '@/components/Form/formhelps'
import { Form } from 'react-bootstrap'
import { WikiPageApiClient, type IWikiPage } from '@/services/wikipage/wikiPageApiClient'

interface RichTextReviewProps {
  label: string
  value?: string
  className?: string
  projectKey?: string
}

// Extract all wiki page IDs from markdown content
const extractWikiPageIds = (markdown: string): string[] => {
  if (!markdown) return []

  const wikiLinkRegex = /\[([^\]]+)\]\(wiki:([^)]+)\)/g
  const pageIds: string[] = []
  let match

  while ((match = wikiLinkRegex.exec(markdown)) !== null) {
    pageIds.push(match[2])
  }

  return [...new Set(pageIds)] // Remove duplicates
}

// Convert Markdown format to HTML
const markdownToHtml = (markdown: string, wikiPageMap: Map<string, IWikiPage>, projectKey?: string): string => {
  if (!markdown) return ''

  let html = markdown

  // Handle wiki page links first [text](wiki:pageId)
  html = html.replace(/\[([^\]]+)\]\(wiki:([^)]+)\)/g, (match, text, pageId) => {
    // Find the wiki page by ID
    const page = wikiPageMap.get(pageId)
    if (page && projectKey) {
      const url = `/projects/${projectKey}/documentation/${page.key}`
      return `<a href="${url}" class="text-primary text-decoration-underline">${text}</a>`
    }
    // If page not found, just return the text without a link
    return text
  })

  // Handle regular links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary text-decoration-underline">$1</a>')

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

export const RichTextReview = ({ label, value, className = '', projectKey }: RichTextReviewProps) => {
  const id = generateId(label)
  const [wikiPageMap, setWikiPageMap] = useState<Map<string, IWikiPage>>(new Map())
  const [loading, setLoading] = useState(false)

  // Fetch wiki pages when value changes
  useEffect(() => {
    const fetchWikiPages = async () => {
      if (!value) {
        setWikiPageMap(new Map())
        return
      }

      const pageIds = extractWikiPageIds(value)
      if (pageIds.length === 0) {
        setWikiPageMap(new Map())
        return
      }

      setLoading(true)
      const client = new WikiPageApiClient()

      try {
        // Fetch all wiki pages in a single batch request
        const response = await client.getByIds(pageIds)

        // Convert array to map for quick lookup
        const newPageMap = new Map<string, IWikiPage>()
        response.wikiPages.forEach((page) => {
          newPageMap.set(page.id, page)
        })

        setWikiPageMap(newPageMap)
      } catch (error) {
        console.error('Failed to fetch wiki pages:', error)
        setWikiPageMap(new Map())
      } finally {
        setLoading(false)
      }
    }

    fetchWikiPages()
  }, [value])

  const htmlContent = markdownToHtml(value || '', wikiPageMap, projectKey)

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
      {loading && <div className="text-muted small">Loading wiki links...</div>}
    </div>
  )
}
