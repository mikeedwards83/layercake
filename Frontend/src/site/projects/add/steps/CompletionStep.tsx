import { Row, Col, Card, Button } from 'react-bootstrap';
import {
  LuFolder, LuStar, LuHeart, LuZap, LuTarget, LuTrendingUp,
  LuCode, LuDatabase, LuServer, LuCloud, LuShield, LuLock,
  LuUsers, LuUser, LuBriefcase, LuCalendar, LuClock, LuBell,
  LuMail, LuPhone, LuMapPin, LuSettings, LuCheck, LuArrowRight,
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

interface CompletionStepProps {
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

export const CompletionStep = ({ projectData, users }: CompletionStepProps) => {
  return (
    <div>
      <div className="text-center py-5">
        <div
          className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-4"
          style={{ width: '100px', height: '100px' }}
        >
          <LuCheck size={60} strokeWidth={3} />
        </div>

        <h3 className="mb-3">Project Created Successfully!</h3>
        <p className="text-muted mb-4 fs-5">
          Your project "<strong>{projectData.name}</strong>" has been created.
        </p>

        <Row className="justify-content-center mb-5">
          <Col md={8}>
            <Card className="border-success">
              <Card.Body className="p-4">
                <Row className="text-start">
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Project Name</small>
                      <div className="fw-semibold">{projectData.name}</div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Project Owner</small>
                      <div className="fw-semibold">
                        {users.find(u => u.id === projectData.ownerId)?.name}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Project Icon & Color</small>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: projectData.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {(() => {
                            const IconComponent = iconMap[projectData.icon] || LuFolder;
                            return <IconComponent size={24} style={{ color: '#fff' }} />;
                          })()}
                        </div>
                        <span className="fw-semibold">{projectData.icon}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-3 justify-content-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/projects'}
          >
            Go to Projects
            <LuArrowRight className="ms-2" />
          </Button>
          <Button
            variant="outline-primary"
            size="lg"
            onClick={() => window.location.reload()}
          >
            Create Another Project
          </Button>
        </div>
      </div>
    </div>
  );
};
