import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { IProjectGetByKeyResponse } from '@/services/project/projectApiClient'
import { WikiPageApiClient, type IWikiPage } from '@/services/wikipage/wikiPageApiClient'
import { Spinner, Alert, Row, Col } from 'react-bootstrap'
import { ProjectDocumentationView } from './projectDocumentationView'
import { ProjectDocumentationEdit } from './projectDocumentationEdit'
import { ProjectDocumentationNew } from './projectDocumentationNew'
import { ProjectDocumentationNav } from './projectDocumentationNav'

interface IProjectDocumentationProps {
  projectResponse: IProjectGetByKeyResponse
  isActive: boolean
}

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

export const ProjectDocumentation = ({ projectResponse, isActive }: IProjectDocumentationProps) => {
  const navigate = useNavigate()
  const { key: projectKey, wikipage: wikiPageKey } = useParams<{ key: string; wikipage?: string }>()
  const [wikiPage, setWikiPage] = useState<IWikiPage | null>(null)
  const [allPages, setAllPages] = useState<IWikiPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isNewPageMode, setIsNewPageMode] = useState(false)

  useEffect(() => {
    const loadWikiPage = async () => {
      if (!projectResponse?.project.id) {
        setError('Project ID is missing')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const client = new WikiPageApiClient()

        // Load all pages for navigation
        const allPagesResponse = await client.getByReference(projectResponse.project.id)
        setAllPages(allPagesResponse.wikiPages)

        let response
        if (wikiPageKey) {
          // Load specific page by key from URL
          response = await client.getByKeyAndReference(projectResponse.project.id, wikiPageKey)
        } else {
          // Load root wiki page (parentId = empty Guid)
          response = await client.getByReferenceAndParent(projectResponse.project.id, EMPTY_GUID)

          // Update URL to include wiki key
          if (response.wikiPage.key && projectKey) {
            navigate(`/projects/${projectKey}/documentation/${response.wikiPage.key}`, { replace: true })
          }
        }

        setWikiPage(response.wikiPage)
        setError(null)
      } catch (err) {
        console.error('Error loading wiki page:', err)
        setError('No documentation found for this project.')
        setWikiPage(null)
      } finally {
        setLoading(false)
      }
    }

    if (isActive) {
      loadWikiPage()
    }
  }, [projectResponse?.project.id, projectKey, wikiPageKey, navigate, isActive])

  const handleEdit = () => {
    setIsEditMode(true)
    setIsNewPageMode(false)
  }

  const handleNewPage = () => {
    setIsNewPageMode(true)
    setIsEditMode(false)
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setIsNewPageMode(false)
  }

  const handleSave = (updatedWikiPage: IWikiPage) => {
    setWikiPage(updatedWikiPage)
    setIsEditMode(false)
    setIsNewPageMode(false)
    setError(null)
  }

  const handleNewPageSave = (newWikiPage: IWikiPage) => {
    setWikiPage(newWikiPage)
    setIsNewPageMode(false)
    setError(null)

    // Update URL to the new page
    if (newWikiPage.key && projectKey) {
      navigate(`/projects/${projectKey}/documentation/${newWikiPage.key}`, { replace: true })
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleNavigate = (pageKey: string) => {
    if (projectKey) {
      navigate(`/projects/${projectKey}/documentation/${pageKey}`)
    }
  }

  if (loading) {
    return (
      <div className="p-3 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading documentation...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Alert variant="info">{error}</Alert>
      </div>
    )
  }

  if (!wikiPage) {
    return (
      <div>
        <Alert variant="info">No documentation available for this project.</Alert>
      </div>
    )
  }

  // Render content area based on mode
  let contentArea: React.ReactElement
  if (isNewPageMode) {
    contentArea = (
      <ProjectDocumentationNew
        parentPage={wikiPage}
        onSave={handleNewPageSave}
        onCancel={handleCancel}
        onError={handleError}
      />
    )
  } else if (isEditMode) {
    contentArea = (
      <ProjectDocumentationEdit
        wikiPage={wikiPage}
        onSave={handleSave}
        onCancel={handleCancel}
        onError={handleError}
      />
    )
  } else {
    contentArea = <ProjectDocumentationView wikiPage={wikiPage} projectKey={projectKey || ''} onEdit={handleEdit} onNewPage={handleNewPage} />
  }

  return (
    <Row className="g-0">
      <Col xs={3}>
        <ProjectDocumentationNav pages={allPages} currentPageId={wikiPage.id} onNavigate={handleNavigate} />
      </Col>
      <Col xs={9}>
        {contentArea}
      </Col>
    </Row>
  )
}
