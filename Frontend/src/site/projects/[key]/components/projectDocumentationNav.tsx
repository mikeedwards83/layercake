import { useState, type JSX } from 'react'
import { Card, CardBody, CardHeader, Nav } from 'react-bootstrap'
import { TbChevronRight, TbChevronDown, TbFile } from 'react-icons/tb'
import type { IWikiPage } from '@/services/wikipage/wikiPageApiClient'

interface IProjectDocumentationNavProps {
  pages: IWikiPage[]
  currentPageId: string
  onNavigate: (pageKey: string) => void
}

interface IWikiPageNode {
  page: IWikiPage
  children: IWikiPageNode[]
  isAncestor: boolean
  isCurrent: boolean
}

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

export const ProjectDocumentationNav = ({ pages, currentPageId, onNavigate }: IProjectDocumentationNavProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build tree structure and identify ancestors
  const buildTree = (): IWikiPageNode[] => {
    // Find ancestors of current page
    const ancestors = new Set<string>()
    let currentPage = pages.find((p) => p.id === currentPageId)

    while (currentPage && currentPage.parentId !== EMPTY_GUID) {
      ancestors.add(currentPage.parentId)
      currentPage = pages.find((p) => p.id === currentPage?.parentId)
    }

    // Build tree recursively
    const buildNode = (page: IWikiPage): IWikiPageNode => {
      const children = pages
        .filter((p) => p.parentId === page.id)
        .map((p) => buildNode(p))
        .sort((a, b) => a.page.title.localeCompare(b.page.title))

      return {
        page,
        children,
        isAncestor: ancestors.has(page.id),
        isCurrent: page.id === currentPageId,
      }
    }

    // Get root nodes (pages with empty parent ID)
    const rootNodes = pages
      .filter((p) => p.parentId === EMPTY_GUID)
      .map((p) => buildNode(p))
      .sort((a, b) => a.page.title.localeCompare(b.page.title))

    return rootNodes
  }

  const toggleExpand = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId)
    } else {
      newExpanded.add(pageId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: IWikiPageNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedNodes.has(node.page.id)
    const shouldShowChildren = node.isCurrent || node.isAncestor || isExpanded

    // Auto-expand ancestors and current page on initial render
    if ((node.isAncestor || node.isCurrent) && !expandedNodes.has(node.page.id)) {
      setExpandedNodes((prev) => new Set(prev).add(node.page.id))
    }

    return (
      <div key={node.page.id}>
        <Nav.Link
          onClick={() => onNavigate(node.page.key)}
          className={`d-flex align-items-center py-2 ${node.isCurrent ? 'bg-primary text-white' : ''}`}
          style={{
            paddingLeft: `${level * 1.5 + 0.5}rem`,
            cursor: 'pointer',
            borderRadius: '0.25rem',
          }}
        >
          {hasChildren && (
            <span
              onClick={(e) => toggleExpand(node.page.id, e)}
              style={{ marginRight: '0.5rem', cursor: 'pointer' }}
            >
              {shouldShowChildren ? <TbChevronDown size={16} /> : <TbChevronRight size={16} />}
            </span>
          )}
          {!hasChildren && <TbFile size={16} style={{ marginRight: '0.5rem' }} />}
          <span className="text-truncate">{node.page.title}</span>
        </Nav.Link>
        {hasChildren && shouldShowChildren && (
          <div>{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const tree = buildTree()

  return (
    <Card className='rounded-end-0 rounded-top-0 h-100'>
      <CardHeader>
        <h4 className="text-muted">Pages</h4>
      </CardHeader>
      <CardBody>
        <Nav className="flex-column">{tree.map((node) => renderNode(node))}</Nav>
      </CardBody>
    </Card>
  )
}
