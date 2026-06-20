import { useEffect } from 'react';
import { IconMap } from '../common/IconMap';
const { X, ExternalLink, AlertTriangle, Calendar, Award, EyeOff, Eye, Microsoft } = IconMap;
import { useProgressContext } from '../../context/ProgressContext';
import { CERT_STATUS, getCertById, getCertificationsRequiring, doesCertExpire } from '../../data/certificationPaths';
import { isRetiring, formatDate, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import './CertDetail.css';

/**
 * A modal panel displaying comprehensive details for a specific certification.
 * Shows description, skills measured, prerequisites, validity, and provides controls
 * to update the tracking status or exclude the certification.
 * 
 * @param {Object} props
 * @param {Object} props.cert - The certification data object
 * @param {Object} props.path - The parent path data object
 * @param {Function} props.onClose - Callback to close the detail panel
 */
const CertDetail = ({ cert, path, onClose }) => {
  const { getStatus, setStatus, toggleCertIgnored, isCertIgnored, isPathIgnored, completionDates, setCompletionDate } = useProgressContext();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const isPathExcluded = isPathIgnored(path.id);
  const certIgnored = isCertIgnored(cert.id) || isPathExcluded;

  const completionDateStr = completionDates?.[cert.id];
  const expires = doesCertExpire(cert.level);

  let expiryDate = null;
  if (expires && completionDateStr) {
    expiryDate = new Date(completionDateStr);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

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

  const prerequisiteFor = getCertificationsRequiring(cert.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'e' && !isPathExcluded) {
        toggleCertIgnored(cert.id);
      } else if (e.key.toLowerCase() === 's' && !certIgnored) {
        const statuses = [CERT_STATUS.NOT_STARTED, CERT_STATUS.IN_PROGRESS, CERT_STATUS.COMPLETED];
        const currentIndex = statuses.indexOf(status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setStatus(cert.id, statuses[nextIndex]);
      } else if (e.key === 'Enter') {
        window.open(cert.learnUrl, '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, cert.id, cert.learnUrl, status, certIgnored, isPathExcluded, toggleCertIgnored, setStatus]);

  return (
    <>
      <div className="cert-detail__overlay" onClick={onClose} />
      <div className="cert-detail" style={{ '--detail-color': path.color }} id="cert-detail-panel">
        <div className="cert-detail__header">
          <div className="cert-detail__header-strip" />
          <button className="cert-detail__close" onClick={onClose} aria-label="Close detail panel">
            <X size={20} />
          </button>
          <div className="cert-detail__header-content">
            <div className="cert-detail__title-row">
              <div className="cert-detail__title-text">
                <span className="cert-detail__exam-code">{cert.examCode}</span>
                <h2 className="cert-detail__name">{cert.name}</h2>
              </div>
              {getBadgeUrl(cert.level, cert.id) && (
                <img 
                  src={getBadgeUrl(cert.level, cert.id)} 
                  alt={`${cert.level} Badge`} 
                  className="cert-detail__badge-icon" 
                  loading="lazy"
                />
              )}
            </div>
            <div className="cert-detail__badges">
              <Badge variant={levelVariant} outline>{cert.level}</Badge>
              <Badge color={path.color} outline>{path.shortName}</Badge>
              {retiring && (
                <Badge variant="retiring" outline>
                  <AlertTriangle size={10} />
                  Retiring
                </Badge>
              )}

              {cert.isBeta && (
                <Badge variant="default">
                  Beta
                </Badge>
              )}
              {cert.isComingSoon && (
                <Badge variant="default">
                  Coming soon
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

          {cert.skillsMeasured && cert.skillsMeasured.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Skills Measured</h3>
              <ul className="cert-detail__skills-list">
                {cert.skillsMeasured.map((skill, index) => (
                  <li key={index} className="cert-detail__skill-item">{skill}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">Validity & Renewal</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              {cert.level === 'Fundamentals' ? (
                <>
                  <Award size={20} style={{ color: path.color, flexShrink: 0 }} />
                  <span className="cert-detail__description">This certification does not expire.</span>
                </>
              ) : (
                <>
                  <Calendar size={20} style={{ color: path.color, flexShrink: 0 }} />
                  <span className="cert-detail__description">Valid for 1 year. Requires a free online renewal assessment every 12 months to maintain active status.</span>
                </>
              )}
            </div>
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

          {status === CERT_STATUS.NEEDS_RENEWAL && (
            <div className="cert-detail__alert cert-detail__alert--danger">
              <AlertTriangle size={16} />
              <div>
                <strong>Needs Renewal</strong>
                <p>This certification has expired or is nearing expiration. Complete the renewal assessment on Microsoft Learn.</p>
                <button 
                  className="cert-detail__renew-btn"
                  onClick={() => setCompletionDate(cert.id, new Date().toISOString())}
                >
                  <Award size={14} />
                  Mark as Renewed
                </button>
              </div>
            </div>
          )}

          {cert.prerequisites && cert.prerequisites.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Prerequisites</h3>
              <div className="cert-detail__prereqs">
                {cert.prerequisites.map((preItem, i) => {
                  if (Array.isArray(preItem)) {
                    return (
                      <div key={`group-${i}`} className="cert-detail__prereq-group">
                        <div className="cert-detail__prereq-group-label">
                          Requires ONE of the following:
                        </div>
                        {preItem.map(subId => {
                          const preCertData = getCertById(subId);
                          const preCert = preCertData?.cert;
                          const prePath = preCertData?.path;
                          if (!preCert) return null;
                          return (
                            <div key={subId} className="cert-detail__prereq">
                              <span className="cert-detail__prereq-code" style={{ color: prePath?.color || path.color }}>{preCert.examCode}</span>
                              <span className="cert-detail__prereq-name">{preCert.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  const preCertData = getCertById(preItem);
                  const preCert = preCertData?.cert;
                  const prePath = preCertData?.path;
                  if (!preCert) return null;
                  return (
                    <div key={preItem} className="cert-detail__prereq">
                      <span className="cert-detail__prereq-code" style={{ color: prePath?.color || path.color }}>{preCert.examCode}</span>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {cert.recommendedPrereqs && cert.recommendedPrereqs.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Recommended Before Taking</h3>
              <div className="cert-detail__prereqs cert-detail__prereqs--recommended">
                {cert.recommendedPrereqs.map((preId) => {
                  const preCertData = getCertById(preId);
                  const preCert = preCertData?.cert;
                  const prePath = preCertData?.path;
                  if (!preCert) return null;
                  return (
                    <div key={preId} className="cert-detail__prereq">
                      <span className="cert-detail__prereq-code" style={{ color: prePath?.color || path.color }}>{preCert.examCode}</span>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prerequisiteFor && prerequisiteFor.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Prerequisite For</h3>
              <div className="cert-detail__prereqs">
                {prerequisiteFor.map((preCert) => {
                  return (
                    <div key={preCert.id} className="cert-detail__prereq">
                      <span className="cert-detail__prereq-code" style={{ color: preCert.pathColor || path.color }}>{preCert.examCode}</span>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">
              Tracking <span style={{fontSize: '10px', fontWeight: 'normal', opacity: 0.6, marginLeft: '6px'}}>(Press E)</span>
            </h3>
            <button
              className={`cert-detail__ignore-btn ${certIgnored ? 'cert-detail__ignore-btn--active' : ''}`}
              onClick={() => isPathExcluded ? null : toggleCertIgnored(cert.id)}
              disabled={isPathExcluded}
              style={{ cursor: isPathExcluded ? 'not-allowed' : 'pointer', opacity: isPathExcluded ? 0.8 : 1 }}
            >
              {certIgnored ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{isPathExcluded ? 'Path Excluded' : (certIgnored ? 'Excluded from tracking' : 'Included in tracking')}</span>
              {!isPathExcluded && (
                <span className={`cert-detail__ignore-toggle ${certIgnored ? 'cert-detail__ignore-toggle--off' : ''}`}>
                  <span className="cert-detail__ignore-toggle-thumb" />
                </span>
              )}
            </button>
            {certIgnored && (
              <p className="cert-detail__ignore-hint">
                {isPathExcluded 
                  ? `The entire ${path.shortName} path is excluded from tracking.`
                  : "This certification won't count towards your overall or path progress."}
              </p>
            )}
          </div>

          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">
              Your Status <span style={{fontSize: '10px', fontWeight: 'normal', opacity: 0.6, marginLeft: '6px'}}>(Press S to cycle)</span>
            </h3>
            <div className={`cert-detail__status-options ${certIgnored ? 'cert-detail__status-options--disabled' : ''}`}>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`cert-detail__status-btn ${opt.className} ${(status === opt.value || (status === CERT_STATUS.NEEDS_RENEWAL && opt.value === CERT_STATUS.COMPLETED)) ? 'cert-detail__status-btn--active' : ''}`}
                  onClick={() => setStatus(cert.id, opt.value)}
                  disabled={certIgnored}
                >
                  <span className="cert-detail__status-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            {(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) && (
              <div style={{ marginTop: '8px' }}>
                <label className="cert-detail__section-title" style={{ fontSize: '10px' }}>Completion Date</label>
                <input 
                  type="date" 
                  className="cert-detail__date-input"
                  value={completionDateStr ? completionDateStr.split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCompletionDate(cert.id, new Date(e.target.value).toISOString());
                    }
                  }}
                  disabled={certIgnored}
                />
                {expiryDate && (
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                    Expires: <strong>{formatDate(expiryDate.toISOString())}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <a
            href={cert.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-detail__learn-btn"
          >
            <Microsoft size={16} />
            View on Microsoft Learn
          </a>
        </div>
      </div>
    </>
  );
};

export default CertDetail;
