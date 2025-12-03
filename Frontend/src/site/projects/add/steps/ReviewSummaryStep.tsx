import { Row, Col, Card } from 'react-bootstrap';
import {
  LuFolder, LuStar, LuHeart, LuZap, LuTarget, LuTrendingUp,
  LuCode, LuDatabase, LuServer, LuCloud, LuShield, LuLock,
  LuUsers, LuUser, LuBriefcase, LuCalendar, LuClock, LuBell,
  LuMail, LuPhone, LuMapPin, LuSettings,
} from 'react-icons/lu';

interface ProjectData {
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ReviewSummaryStepProps {
  projectData: ProjectData;
  users: User[];
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Folder: LuFolder,
  Star: LuStar,
  Heart: LuHeart,
  Zap: LuZap,
  Target: LuTarget,
  TrendingUp: LuTrendingUp,
  Code: LuCode,
  Database: LuDatabase,
  Server: LuServer,
  Cloud: LuCloud,
  Shield: LuShield,
  Lock: LuLock,
  Users: LuUsers,
  User: LuUser,
  Briefcase: LuBriefcase,
  Calendar: LuCalendar,
  Clock: LuClock,
  Bell: LuBell,
  Mail: LuMail,
  Phone: LuPhone,
  MapPin: LuMapPin,
  Settings: LuSettings,
};

export const ReviewSummaryStep = ({ projectData, users }: ReviewSummaryStepProps) => {
  return (
    <div>
      <h5 className="mb-4">Review & Summary</h5>
      <p className="text-muted mb-4">
        Please review all the information below before creating your project.
      </p>

      <Row className="g-4">
        <Col md={12}>
          <Card className="border">
            <Card.Body>
              <h6 className="mb-3 text-primary">Project Details</h6>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Project Name</small>
                    <div className="fw-semibold fs-5">{projectData.name}</div>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Description</small>
                    <div>{projectData.description}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Project Icon</small>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded border d-flex align-items-center justify-content-center"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: projectData.color,
                        }}
                      >
                        {(() => {
                          const IconComponent = iconMap[projectData.icon] || LuFolder;
                          return <IconComponent size={32} style={{ color: '#fff' }} />;
                        })()}
                      </div>
                      <div>
                        <div className="fw-semibold">{projectData.icon}</div>
                        <small className="text-muted">Icon</small>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Project Color</small>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded border"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: projectData.color,
                        }}
                      />
                      <div>
                        <div className="fw-semibold">{projectData.color}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="border">
            <Card.Body>
              <h6 className="mb-3 text-primary">Team Assignment</h6>
              {(() => {
                const owner = users.find(u => u.id === projectData.ownerId);
                return owner ? (
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold' }}
                    >
                      {owner.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="fw-semibold fs-5">{owner.name}</div>
                      <small className="text-muted">{owner.email}</small>
                      <div className="mt-1">
                        <span className="badge bg-primary-subtle text-primary">Project Owner</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No owner assigned</p>
                );
              })()}
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <div className="alert alert-info mb-0">
            <h6 className="alert-heading">Ready to Create?</h6>
            <p className="mb-0">
              Click "Create Project" below to finalize and create your new project.
              You can click "Previous" to make any changes.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};
