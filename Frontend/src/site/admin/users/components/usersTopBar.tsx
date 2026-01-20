import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { TbSearch } from 'react-icons/tb'

interface UsersTopBarProps {
  onSearch: (query: string) => void
}

export const UsersTopBar = ({ onSearch }: UsersTopBarProps) => {
  const [searchInput, setSearchInput] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onSearch(value)
  }

  return (
    <Row className="mb-3">
      <Col lg={12}>
        <div className="bg-light-subtle rounded border p-3">
          <Row>
            <Col lg={6}>
              <div className="app-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users by name or email..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <TbSearch className="app-search-icon text-muted" />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}
