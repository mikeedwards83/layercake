import { useState, useCallback, useMemo } from 'react'
import { createEditor, Editor, Text, type BaseEditor, type Descendant } from 'slate'
import { Slate, Editable, withReact, ReactEditor, type RenderLeafProps, type RenderElementProps } from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'
import { Form, Button, ButtonGroup } from 'react-bootstrap'
import { TbLink } from 'react-icons/tb'
import { generateId } from '../formhelps'
import { WikiPageLinkModal, insertLink, type LinkElement } from './WikiLink'
import type { IWikiPageSearchResult } from '@/services/search/searchApiClient'
import './styles.css'

// Define custom types for TypeScript
type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  link?: string
}

type ParagraphElement = {
  type: 'paragraph'
  children: (CustomText | LinkElement)[]
}

type CustomElement = ParagraphElement | LinkElement

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface RichTextInputProps {
  error?: string
  label: string
  required?: boolean
  value?:string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  referenceId?: string
}

// Helper functions for formatting
const toggleFormat = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
  const isActive = isFormatActive(editor, format)
  Editor.addMark(editor, format, !isActive)
}

const isFormatActive = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

// Render element component (for links)


// Render leaf component with formatting
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

// Convert Slate value to Markdown format
const serializeToMarkdown = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      if ('children' in node) {
        // Handle link elements
        if ('type' in node && node.type === 'link') {
          const linkText = node.children
            .map((child) => {
              if (Text.isText(child)) {
                return child.text
              }
              return ''
            })
            .join('')
          return `[${linkText}](${node.url})`
        }

        // Handle paragraph elements
        return node.children
          .map((child) => {
            // Handle nested link elements
            if ('type' in child && child.type === 'link') {
              const linkText = child.children
                .map((grandChild) => {
                  if (Text.isText(grandChild)) {
                    return grandChild.text
                  }
                  return ''
                })
                .join('')
              return `[${linkText}](${child.url})`
            }

            if (Text.isText(child)) {
              let text = child.text
              // Apply markdown formatting in the correct order
              // Underline uses _ (single underscore)
              if (child.bold && child.italic && child.underline) {
                text = `_***${text}***_`
              } else if (child.bold && child.italic) {
                text = `***${text}***`
              } else if (child.bold && child.underline) {
                text = `_**${text}**_`
              } else if (child.italic && child.underline) {
                text = `_*${text}*_`
              } else if (child.bold) {
                text = `**${text}**`
              } else if (child.italic) {
                text = `*${text}*`
              } else if (child.underline) {
                text = `_${text}_`
              }
              return text
            }
            return ''
          })
          .join('')
      }
      return ''
    })
    .join('\n')
}

// Parse Markdown string to Slate value
const deserializeFromMarkdown = (markdown: string): Descendant[] => {
  if (!markdown) {
    return [{ type: 'paragraph', children: [{ text: '' }] }]
  }

  const children: (CustomText | LinkElement)[] = []

  // Regular expression to match markdown patterns including links
  // Matches: [text](url), _***text***_, _**text**_, _*text*_, _text_, ***text***, **text**, *text*
  const regex = /\[([^\]]+)\]\(([^)]+)\)|_((?:\*{1,3})?)(.*?)(\*{1,3})?_|(\*{3})(.*?)\6|(\*{2})(.*?)\8|(\*)(.*?)\10/g

  let match
  let lastIndex = 0

  while ((match = regex.exec(markdown)) !== null) {
    // Add plain text before the match
    if (match.index > lastIndex) {
      const plainText = markdown.substring(lastIndex, match.index)
      if (plainText) {
        children.push({ text: plainText })
      }
    }

    // Check if it's a link
    if (match[1] && match[2]) {
      // It's a link [text](url)
      const linkElement: LinkElement = {
        type: 'link',
        url: match[2],
        children: [{ text: match[1] }],
      }
      children.push(linkElement)
    } else {
      // It's a text formatting pattern
      let text = ''
      let bold = false
      let italic = false
      let underline = false

      // Check which pattern matched
      if (match[0].startsWith('_') && !match[1]) {
        // Underline pattern
        underline = true
        const innerMarks = match[3] || match[5] || ''
        text = match[4]

        if (innerMarks === '***') {
          bold = true
          italic = true
        } else if (innerMarks === '**') {
          bold = true
        } else if (innerMarks === '*') {
          italic = true
        }
      } else if (match[6] === '***') {
        // Bold + Italic
        text = match[7]
        bold = true
        italic = true
      } else if (match[8] === '**') {
        // Bold
        text = match[9]
        bold = true
      } else if (match[10] === '*') {
        // Italic
        text = match[11]
        italic = true
      }

      children.push({ text, bold, italic, underline })
    }

    lastIndex = regex.lastIndex
  }

  // Add remaining plain text
  if (lastIndex < markdown.length) {
    const remainingText = markdown.substring(lastIndex)
    if (remainingText) {
      children.push({ text: remainingText })
    }
  }

  // If no matches, return the plain text
  if (children.length === 0) {
    children.push({ text: markdown })
  }

  return [{ type: 'paragraph', children }]
}
const withInlines = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { isInline } =
      editor

    editor.isInline = (element: CustomElement) =>
      ['link', 'button', 'badge'].includes(element.type) || isInline(element)

    return editor;
  }

  
export const RichTextInput = ({
  error,
  label,
  required = false,
  value,
  onChange,
  placeholder = '',
  hint,
  referenceId,
}: RichTextInputProps) => {
  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), [])
  const id = generateId(label)
  const [showLinkModal, setShowLinkModal] = useState(false)

  // Initialize editor value from Markdown string
  const initialValue = useMemo(() => deserializeFromMarkdown(value || ''), [])
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue)

  
  
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setEditorValue(newValue)
      const markdown = serializeToMarkdown(newValue)
      onChange(markdown)
    },
    [onChange]
  )

  const handleSelectWikiPage = useCallback(
    (page: IWikiPageSearchResult) => {
      // Store the page ID with a wiki: prefix
      const url = `wiki:${page.id}`
      insertLink(editor, url)
    },
    [editor]
  )

  const Element = ({ attributes, children, element }: RenderElementProps) => {
  if (element.type === 'link') {
    return (
      <a {...attributes} href={element.url} className="text-primary text-decoration-underline">
        {children}
      </a>
    )
  }
  return <p {...attributes}>{children}</p>
}

  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])

  return (
    <Form.Group>
      <Form.Label htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>

      <div className={`rich-text-editor ${error ? 'is-invalid' : ''}`}>
        <div className="rich-text-toolbar">
          <ButtonGroup size="sm">
            <Button
              variant={isFormatActive(editor, 'bold') ? 'primary' : 'outline-secondary'}
              size="sm"
              onMouseDown={(event) => {
                event.preventDefault()
                toggleFormat(editor, 'bold')
              }}
              active={isFormatActive(editor, 'bold')}
            >
              B
            </Button>
            <Button
              variant={isFormatActive(editor, 'italic') ? 'primary' : 'outline-secondary'}
              size="sm"
              onMouseDown={(event) => {
                event.preventDefault()
                toggleFormat(editor, 'italic')
              }}
              active={isFormatActive(editor, 'italic')}
            >
              I
            </Button>
            <Button
              variant={isFormatActive(editor, 'underline') ? 'primary' : 'outline-secondary'}
              size="sm"
              onMouseDown={(event) => {
                event.preventDefault()
                toggleFormat(editor, 'underline')
              }}
              active={isFormatActive(editor, 'underline')}
            >
              U
            </Button>
          </ButtonGroup>
          {referenceId && (
            <ButtonGroup size="sm" className="ms-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onMouseDown={(event) => {
                  event.preventDefault()
                  setShowLinkModal(true)
                }}
                title="Link to wiki page"
              >
                <TbLink />
              </Button>
            </ButtonGroup>
          )}
        </div>

        <Slate editor={editor} initialValue={editorValue} onValueChange={handleChange}>
          <Editable
            id={id}
            className="rich-text-content"
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            placeholder={placeholder}
            spellCheck

          />
        </Slate>
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}
      {hint && <Form.Text className="text-muted">{hint}</Form.Text>}

      {referenceId && (
        <WikiPageLinkModal
          show={showLinkModal}
          referenceId={referenceId}
          onClose={() => setShowLinkModal(false)}
          onSelectPage={handleSelectWikiPage}
        />
      )}
    </Form.Group>
  )
}
