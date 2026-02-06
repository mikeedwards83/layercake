import { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { TbPlus, TbSearch } from 'react-icons/tb'
import { useNavigate } from 'react-router'

interface UsersTopBarProps {
  onSearch: (query: string) => void
}

export const UsersTopBar = ({ onSearch }: UsersTopBarProps) => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onSearch(value)
  }

  const handleAddUser = () => {
    navigate('/admin/users/add')
  }

  return (
    <Row className="mb-3">
      <Col lg={12}>
        <div className="bg-light-subtle rounded border p-3">
          <Row className="align-items-center">
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
            <Col lg={6} className="text-end">
              <Button variant="primary" onClick={handleAddUser}>
                <TbPlus className="me-1" />
                Add User
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}
