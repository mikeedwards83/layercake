import { Container, Row, Col, Card } from 'react-bootstrap';
import { TbUsers, TbFolder, TbFileText, TbSettings } from 'react-icons/tb';
import PageMetaData from '../../components/PageMetaData';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  variant: string;
}

const StatCard = ({ icon, title, value, variant }: StatCardProps) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className={`avatar-sm bg-${variant} bg-opacity-10 rounded me-3`}>
            <div className={`avatar-title text-${variant} fs-3`}>
              {icon}
            </div>
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1">{title}</h5>
            <h3 className="mb-0">{value}</h3>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const QuickAction = ({ icon, title, description, link }: QuickActionProps) => {
  return (
    <Card className="mb-3 h-100">
      <Card.Body>
        <div className="d-flex align-items-start">
          <div className="avatar-sm bg-primary bg-opacity-10 rounded me-3">
            <div className="avatar-title text-primary fs-3">
              {icon}
            </div>
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1">{title}</h5>
            <p className="text-muted mb-2">{description}</p>
            <a href={link} className="btn btn-sm btn-outline-primary">
              Go to {title}
            </a>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const AdminDashboard = () => {
  return (
    <>
      <PageMetaData title="Admin Dashboard" />

      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-title-box">
              <h4 className="page-title">Admin Dashboard</h4>
              <p className="text-muted">Welcome to the administration area</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={3} sm={6}>
            <StatCard
              icon={<TbFolder />}
              title="Total Projects"
              value="0"
              variant="primary"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard
              icon={<TbUsers />}
              title="Active Users"
              value="0"
              variant="success"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard
              icon={<TbFileText />}
              title="Wiki Pages"
              value="0"
              variant="info"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard
              icon={<TbSettings />}
              title="Applications"
              value="0"
              variant="warning"
            />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <h5 className="mb-3">Quick Actions</h5>
          </Col>
        </Row>

        <Row>
          <Col lg={4} md={6}>
            <QuickAction
              icon={<TbFolder />}
              title="Projects"
              description="Manage all projects in the system"
              link="/projects"
            />
          </Col>
          <Col lg={4} md={6}>
            <QuickAction
              icon={<TbUsers />}
              title="Users"
              description="Manage user accounts and permissions"
              link="/admin/users"
            />
          </Col>
          <Col lg={4} md={6}>
            <QuickAction
              icon={<TbSettings />}
              title="Settings"
              description="Configure system settings and preferences"
              link="/admin/settings"
            />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h5 className="card-title mb-0">Recent Activity</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center text-muted py-4">
                  <p>No recent activity to display</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h5 className="card-title mb-0">System Status</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0">API Status</h6>
                  </div>
                  <span className="badge bg-success">Operational</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0">Database</h6>
                  </div>
                  <span className="badge bg-success">Connected</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="mb-0">Authentication</h6>
                  </div>
                  <span className="badge bg-success">Active</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
