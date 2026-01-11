import { useState, useEffect, useCallback } from 'react'
import { Modal, Button, Form, ListGroup, Spinner } from 'react-bootstrap'
import { SearchApiClient, type IWikiPageSearchResult } from '@/services/search/searchApiClient'

interface IWikiPageLinkModalProps {
  show: boolean
  referenceId: string
  onClose: () => void
  onSelectPage: (page: IWikiPageSearchResult) => void
}

export const WikiPageLinkModal = ({ show, referenceId, onClose, onSelectPage }: IWikiPageLinkModalProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [pages, setPages] = useState<IWikiPageSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load pages from server
  const loadPages = useCallback(async (search?: string) => {
    if (!referenceId) return
    console.log(referenceId)
    try {
      setLoading(true)
      setError(null)
      const client = new SearchApiClient()

      // If there's a search term, use search endpoint; otherwise get latest
      const response = search
        ? await client.searchWikiPages(referenceId, search, 5)
        : await client.getLatestWikiPages(referenceId, 5)

      setPages(response.results)
    } catch (err) {
      console.error('Error loading wiki pages:', err)
      setError('Failed to load wiki pages')
      setPages([])
    } finally {
      setLoading(false)
    }
  }, [referenceId])

  // Load initial pages (latest 5) when modal opens
  useEffect(() => {
    if (show && referenceId) {
      loadPages()
    }
  }, [show, referenceId, loadPages])

  // Debounced search
  useEffect(() => {
    if (!show) return

    const timeoutId = setTimeout(() => {
      loadPages(searchTerm || undefined)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, show, loadPages])

  const handleSelect = (page: IWikiPageSearchResult) => {
    onSelectPage(page)
    setSearchTerm('')
    onClose()
  }

  const handleClose = () => {
    setSearchTerm('')
    setPages([])
    setError(null)
    onClose()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Link to Wiki Page</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search for a page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            disabled={loading}
          />
        </Form.Group>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
              <p className="text-muted mt-2">Loading pages...</p>
            </div>
          ) : error ? (
            <p className="text-danger text-center py-3">{error}</p>
          ) : pages.length === 0 ? (
            <p className="text-muted text-center py-3">
              {searchTerm ? 'No pages found matching your search' : 'No pages found'}
            </p>
          ) : (
            <ListGroup>
              {pages.map((page) => (
                <ListGroup.Item
                  key={page.id}
                  action
                  onClick={() => handleSelect(page)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <strong>{page.title}</strong>
                    <div className="text-muted small">{page.key}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
