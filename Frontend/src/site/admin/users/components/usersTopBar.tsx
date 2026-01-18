import { Button, Col, Row } from 'react-bootstrap'
import { TbSearch, TbUserCheck, TbUserX, TbLayoutGrid, TbList } from 'react-icons/tb'
import { Link } from 'react-router'

export const UsersTopBar = () => {
  return (
    <Row className="mb-3">
      <Col lg={12}>
        <form className="bg-light-subtle rounded border p-3">
          <Row className="gap-3">
            <Col>
              <Row className="gap-3">
                <Col lg={4}>
                  <div className="app-search">
                    <input type="text" className="form-control" placeholder="Search users..." />
                    <TbSearch className="app-search-icon text-muted" />
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="me-2 fw-semibold">Filter By:</span>

                    <div className="app-search">
                      <select className="form-select form-control my-1 my-md-0">
                        <option>Status</option>
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                      <TbUserCheck className="app-search-icon text-muted" />
                    </div>

                    <div className="app-search">
                      <select className="form-select form-control my-1 my-md-0">
                        <option>Verification</option>
                        <option value="Verified">Email Verified</option>
                        <option value="Unverified">Not Verified</option>
                      </select>
                      <TbUserX className="app-search-icon text-muted" />
                    </div>

                    <Button variant="secondary" type="submit">
                      Apply
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="auto">
              <Row>
                <div className="d-flex gap-1">
                  <Link to="/admin/users" className="btn btn-primary btn-icon">
                    <TbLayoutGrid className="fs-lg" />
                  </Link>
                  <Link to="/admin/users-list" className="btn btn-soft-primary btn-icon">
                    <TbList className="fs-lg" />
                  </Link>
                </div>
              </Row>
            </Col>
          </Row>
        </form>
      </Col>
    </Row>
  )
}
