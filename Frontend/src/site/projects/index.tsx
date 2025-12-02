import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { LuActivity, LuCalendarClock, LuLayoutGrid, LuList, LuSearch, LuUsers } from 'react-icons/lu'
import { Link } from 'react-router'
import ButtonAdd from '@/components/Buttons/ButtonAdd'

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Projects" subtitle="" />
      <Row className="mb-3">
        <Col lg={12}>
          <form className="bg-light-subtle rounded border p-3">
            <Row className="gap-3">
              <Col>
                <Row className="gap-3">
                  <Col lg={4}>
                    <div className="app-search">
                      <input type="text" className="form-control" placeholder="Search project name..." />
                      <LuSearch className="app-search-icon text-muted" />
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="me-2 fw-semibold">Filter By:</span>

                      <div className="app-search">
                        <select className="form-select form-control my-1 my-md-0">
                          <option>Status</option>
                          <option value="On Track">On Track</option>
                          <option value="Delayed">Delayed</option>
                          <option value="At Risk">At Risk</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <LuActivity className="app-search-icon text-muted" />
                      </div>

                      <div className="app-search">
                        <select className="form-select form-control my-1 my-md-0">
                          <option>Team</option>
                          <option value="Design">Design</option>
                          <option value="Development">Development</option>
                          <option value="Marketing">Marketing</option>
                          <option value="QA">QA</option>
                        </select>
                        <LuUsers className="app-search-icon text-muted" />
                      </div>

                      <div className="app-search">
                        <select className="form-select form-control my-1 my-md-0">
                          <option>Deadline</option>
                          <option value="This Week">This Week</option>
                          <option value="This Month">This Month</option>
                          <option value="Next Month">Next Month</option>
                        </select>
                        <LuCalendarClock className="app-search-icon text-muted" />
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
                    <Link to="/projects/add" >
                      <ButtonAdd title="Project" />
                    </Link>
                    <Link to="/projects" className="btn btn-primary btn-icon">
                      <LuLayoutGrid className="fs-lg" />
                    </Link>
                    <Link to="/projects-list" className="btn btn-soft-primary btn-icon">
                      <LuList className="fs-lg" />
                    </Link>
                  </div>
                </Row>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default Page
