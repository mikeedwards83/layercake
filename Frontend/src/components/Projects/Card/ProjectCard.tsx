import { Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { TbBan, TbDotsVertical, TbEdit, TbShare, TbTrash } from 'react-icons/tb'
import { Icon } from '@/components/Icon'
import { UserReview } from '@/components/Review/UserReview'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'

interface IProjectCard {
    name:string
    projectKey:string
    description: string,
    ownerId?: string,
    icon?:string, 
    color?:string
}

export const ProjectCard  = ({ name,projectKey, description, ownerId, icon, color }:IProjectCard) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex mb-4">
          <div className="avatar-xl me-3">
            <span className="avatar-title text-bg-light rounded">
              {icon && <Icon iconName={icon} color={color} size={40}/>}
            </span>
          </div>
          <div>
            <h4 className="mb-1 d-flex align-items-center">
              <Link to={`/projects/${projectKey}`} className="link-reset">
                {name}
              </Link>
            </h4>
            <p>
              [{projectKey}]
            </p>
          </div>
          <div className="ms-auto">
            <Dropdown>
              <DropdownToggle className="btn btn-icon btn-ghost-light text-muted drop-arrow-none">
                <TbDotsVertical className="fs-xl" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <li>
                  <DropdownItem>
                    <TbShare className="me-2" />
                    Share
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem>
                    <TbEdit className="me-2" />
                    Edit
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem>
                    <TbBan className="me-2" />
                    Block
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem className="text-danger">
                    <TbTrash className="me-2" />
                    Delete
                  </DropdownItem>
                </li>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <Row>
          <Col sm={12}>
            <p>
                {description}
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            {ownerId && <UserReview users={fakeUsers} value={ownerId} />}
          </Col>
        </Row>
       
      </CardBody>
    </Card>
  )
}
