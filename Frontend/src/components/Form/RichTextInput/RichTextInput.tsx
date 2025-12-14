import { useState, useCallback, useMemo } from 'react'
import { createEditor, Editor, Text, type BaseEditor, type Descendant } from 'slate'
import { Slate, Editable, withReact, ReactEditor, type RenderLeafProps } from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'
import { Form, Button, ButtonGroup } from 'react-bootstrap'
import { generateId } from '../formhelps'
import './styles.css'

// Define custom types for TypeScript
type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

type CustomElement = {
  type: 'paragraph'
  children: CustomText[]
}

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
        return node.children
          .map((child) => {
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

  const children: CustomText[] = []

  // Regular expression to match markdown patterns
  // Matches: _***text***_, _**text**_, _*text*_, _text_, ***text***, **text**, *text*
  const regex = /_((?:\*{1,3})?)(.*?)(\*{1,3})?_|(\*{3})(.*?)\4|(\*{2})(.*?)\6|(\*)(.*?)\8/g

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

    let text = ''
    let bold = false
    let italic = false
    let underline = false

    // Check which pattern matched
    if (match[0].startsWith('_')) {
      // Underline pattern
      underline = true
      const innerMarks = match[1] || match[3] || ''
      text = match[2]

      if (innerMarks === '***') {
        bold = true
        italic = true
      } else if (innerMarks === '**') {
        bold = true
      } else if (innerMarks === '*') {
        italic = true
      }
    } else if (match[4] === '***') {
      // Bold + Italic
      text = match[5]
      bold = true
      italic = true
    } else if (match[6] === '**') {
      // Bold
      text = match[7]
      bold = true
    } else if (match[8] === '*') {
      // Italic
      text = match[9]
      italic = true
    }

    children.push({ text, bold, italic, underline })
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

export const RichTextInput = ({
  error,
  label,
  required = false,
  value,
  onChange,
  placeholder = '',
  hint,
}: RichTextInputProps) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const id = generateId(label)

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

  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

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
        </div>

        <Slate editor={editor} initialValue={editorValue} onValueChange={handleChange}>
          <Editable
            id={id}
            className="rich-text-content"
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
          />
        </Slate>
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}
      {hint && <Form.Text className="text-muted">{hint}</Form.Text>}
    </Form.Group>
  )
}
