import { Editor, Transforms, Range } from 'slate'
import type { IWikiPage } from '@/services/wikipage/wikiPageApiClient'

export type LinkElement = {
  type: 'link'
  url: string
  children: Array<{ text: string }>
}

// Helper functions for links
export const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

export const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && 'type' in n && n.type === 'link',
  })
  return !!link
}

export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && 'type' in n && n.type === 'link',
  })
}

export const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)

  const link: LinkElement = {


    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }
  
  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
   // Transforms.collapse(editor, { edge: 'end' })
  }
}

/**
 * Creates a wiki link URL from a page ID
 */
export const createWikiLinkUrl = (page: IWikiPage): string => {
  return `wiki:${page.id}`
}

/**
 * Checks if a URL is a wiki link
 */
export const isWikiLink = (url: string): boolean => {
  return url.startsWith('wiki:')
}

/**
 * Extracts the page ID from a wiki link URL
 */
export const extractPageIdFromWikiLink = (url: string): string | null => {
  if (isWikiLink(url)) {
    return url.substring(5) // Remove 'wiki:' prefix
  }
  return null
}
