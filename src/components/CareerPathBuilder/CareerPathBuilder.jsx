import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { careerRoles } from '../../data/careerRoles';
import { certificationPaths, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { IconMap as Icons } from '../common/IconMap';
import './CareerPathBuilder.css';

const CareerPathBuilder = () => {
  const navigate = useNavigate();
  const { getStatus } = useProgressContext();
  const [selectedRole, setSelectedRole] = useState(null);

  // Flatten certifications for easy lookup
  const allCerts = useMemo(() => {
    const certsMap = new Map();
    certificationPaths.forEach(path => {
      path.certifications.forEach(cert => {
        certsMap.set(cert.id, {
          ...cert,
          pathId: path.id,
          pathColor: path.color
        });
      });
    });
    return certsMap;
  }, []);

  const sortedRoles = useMemo(() => {
    return [...careerRoles].sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  return (
    <div className="career-path-builder">
      <div className="cpb-header">
        <h1 className="cpb-title">
          <Icons.TrendingUp size={28} />
          Interactive Career Path Builder
        </h1>
        <p className="cpb-subtitle">
          Select your desired job role to see the recommended certification roadmap. 
          Track your progress from Fundamentals to Expert and build the skills needed for your career.
        </p>
      </div>

      <div className="cpb-roles-grid">
        {sortedRoles.map(role => {
          const isActive = selectedRole?.id === role.id;
          const RoleIcon = Icons[role.icon] || Icons.Briefcase;
          
          return (
            <div 
              key={role.id}
              className={`cpb-role-card ${isActive ? 'cpb-role-card--active' : ''}`}
              style={{ '--card-color': role.color }}
              onClick={() => setSelectedRole(isActive ? null : role)}
            >
              <div className="cpb-role-card-header">
                <div className="cpb-role-icon">
                  <RoleIcon size={18} />
                </div>
                <div className="cpb-role-title">{role.title}</div>
              </div>
              <div className="cpb-role-desc">{role.description}</div>
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className="cpb-path-container">
          <h2 className="cpb-path-title">
            Roadmap for {selectedRole.title}
          </h2>
          
          <div className="cpb-timeline">
            {selectedRole.certs.map((certId, index) => {
              const certInfo = allCerts.get(certId);
              if (!certInfo) return null; // Fallback if cert ID is wrong

              const status = getStatus(certId);
              let nodeClass = '';
              let badgeClass = '';
              let StatusIcon = Icons.Circle;
              let statusText = 'Not Started';

              if (status === CERT_STATUS.COMPLETED) {
                nodeClass = 'cpb-timeline-node--completed';
                badgeClass = 'cpb-timeline-badge--completed';
                StatusIcon = Icons.CheckCircle2;
                statusText = 'Completed';
              } else if (status === CERT_STATUS.NEEDS_RENEWAL) {
                nodeClass = 'cpb-timeline-node--needs-renewal';
                badgeClass = 'cpb-timeline-badge--needs-renewal';
                StatusIcon = Icons.AlertTriangle;
                statusText = 'Needs Renewal';
              } else if (status === CERT_STATUS.IN_PROGRESS) {
                nodeClass = 'cpb-timeline-node--in-progress';
                badgeClass = 'cpb-timeline-badge--in-progress';
                StatusIcon = Icons.Clock;
                statusText = 'In Progress';
              } else {
                badgeClass = 'cpb-timeline-badge--not-started';
                statusText = 'Not Started';
              }

              return (
                <div key={certId} className="cpb-timeline-step">
                  <div className="cpb-timeline-indicator">
                    <div className={`cpb-timeline-node ${nodeClass}`}>
                      {status === CERT_STATUS.COMPLETED ? (
                        <Icons.Check size={20} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </div>
                  <div 
                    className="cpb-timeline-card"
                    style={{ '--card-color': certInfo.pathColor }}
                    onClick={() => navigate(`/path/${certInfo.pathId}`)}
                  >
                    <div className="cpb-timeline-card-header">
                      <div>
                        <div className="cpb-timeline-cert-code">{certInfo.examCode}</div>
                        <div className="cpb-timeline-cert-name">{certInfo.name}</div>
                      </div>
                      <div className={`cpb-timeline-badge ${badgeClass}`}>
                        <StatusIcon size={12} />
                        {statusText}
                      </div>
                    </div>
                    <div className="cpb-timeline-cert-desc">
                      {certInfo.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathBuilder;
