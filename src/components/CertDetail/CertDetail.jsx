import { X, ExternalLink, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { useProgressContext } from '../../context/ProgressContext';
import { CERT_STATUS } from '../../data/certificationPaths';
import { isRetiring, formatDate } from '../../utils/helpers';
import Badge from '../common/Badge';
import './CertDetail.css';

const CertDetail = ({ cert, path, onClose }) => {
  const { getStatus, setStatus } = useProgressContext();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);

  const statusOptions = [
    { value: CERT_STATUS.NOT_STARTED, label: 'Not Started', icon: '○', className: 'cert-detail__status-btn--not-started' },
    { value: CERT_STATUS.IN_PROGRESS, label: 'In Progress', icon: '◐', className: 'cert-detail__status-btn--in-progress' },
    { value: CERT_STATUS.COMPLETED, label: 'Completed', icon: '✓', className: 'cert-detail__status-btn--completed' },
  ];

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
  }[cert.level] || 'default';

  return (
    <>
      <div className="cert-detail__overlay" onClick={onClose} />
      <div className="cert-detail glass" style={{ '--detail-color': path.color }} id="cert-detail-panel">
        <div className="cert-detail__header">
          <div className="cert-detail__header-strip" />
          <button className="cert-detail__close" onClick={onClose} aria-label="Close detail panel">
            <X size={20} />
          </button>
          <div className="cert-detail__header-content">
            <span className="cert-detail__exam-code">{cert.examCode}</span>
            <h2 className="cert-detail__name">{cert.name}</h2>
            <div className="cert-detail__badges">
              <Badge variant={levelVariant}>{cert.level}</Badge>
              <Badge color={path.color}>{path.shortName}</Badge>
              {retiring && (
                <Badge variant="retiring">
                  <AlertTriangle size={10} />
                  Retiring
                </Badge>
              )}
              {cert.isInterchange && (
                <Badge variant="interchange">
                  <ArrowRightLeft size={10} />
                  Interchange
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="cert-detail__body">
          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">Description</h3>
            <p className="cert-detail__description">{cert.description}</p>
          </div>

          {retiring && (
            <div className="cert-detail__alert cert-detail__alert--warning">
              <AlertTriangle size={16} />
              <div>
                <strong>Retirement Notice</strong>
                <p>This certification retires on {formatDate(cert.retirementDate)}. Consider transitioning to its replacement.</p>
              </div>
            </div>
          )}

          {cert.prerequisites && cert.prerequisites.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Prerequisites</h3>
              <div className="cert-detail__prereqs">
                {cert.prerequisites.map((preId) => {
                  const preCert = path.certifications.find((c) => c.id === preId);
                  if (!preCert) return null;
                  return (
                    <div key={preId} className="cert-detail__prereq">
                      <span className="cert-detail__prereq-code">{preCert.examCode}</span>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">Your Status</h3>
            <div className="cert-detail__status-options">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`cert-detail__status-btn ${opt.className} ${status === opt.value ? 'cert-detail__status-btn--active' : ''}`}
                  onClick={() => setStatus(cert.id, opt.value)}
                >
                  <span className="cert-detail__status-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <a
            href={cert.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-detail__learn-btn"
          >
            <ExternalLink size={16} />
            View on Microsoft Learn
          </a>
        </div>
      </div>
    </>
  );
};

export default CertDetail;
