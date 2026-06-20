import { CERT_STATUS, CERT_LEVELS, getCertById } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { isRetiring, isRetired, formatDate, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import { IconMap } from '../common/IconMap';
const { AlertTriangle, Link, ArchiveX, EyeOff, Eye, Microsoft } = IconMap;
import './CertNode.css';

/**
 * Represents a single node (cert-node) on the certification path map.
 * Displays the certification's status, level badges, and basic information.
 * Allows interacting to cycle status or open the detailed view.
 * 
 * @param {Object} props
 * @param {Object} props.cert - The certification data
 * @param {string} props.pathColor - The thematic color of the path
 * @param {Function} props.onSelect - Callback triggered when the cert-node is right-clicked or clicked for details
 * @param {number} props.index - Positional index for animation delay
 * @param {boolean} props.isUnlocked - Whether all prerequisites are met for this certification
 * @param {boolean} props.isPathIgnored - Whether the parent path is excluded from tracking
 */
const CertNode = ({ cert, pathColor, onSelect, index, isUnlocked, isPathIgnored }) => {
  const { getStatus, cycleStatus, isCertIgnored, toggleCertIgnored } = useProgressContext();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const retired = isRetired(cert);
  const certIgnored = isCertIgnored(cert.id) || isPathIgnored;

  const statusClass = {
    [CERT_STATUS.NOT_STARTED]: 'cert-node--not-started',
    [CERT_STATUS.IN_PROGRESS]: 'cert-node--in-progress',
    [CERT_STATUS.COMPLETED]: 'cert-node--completed',
    [CERT_STATUS.NEEDS_RENEWAL]: 'cert-node--needs-renewal',
  }[status];

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[cert.level];

  const handleOpenDetail = (e) => {
    e.stopPropagation();
    onSelect?.(cert);
  };

  const handleCycleStatus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cycleStatus(cert.id);
  };

  const statusLabel = {
    [CERT_STATUS.NOT_STARTED]: 'Not Started',
    [CERT_STATUS.IN_PROGRESS]: 'In Progress',
    [CERT_STATUS.COMPLETED]: 'Completed',
    [CERT_STATUS.NEEDS_RENEWAL]: 'Needs Renewal',
  }[status];

  const nextStatusLabel = {
    [CERT_STATUS.NOT_STARTED]: 'Start',
    [CERT_STATUS.IN_PROGRESS]: 'In Progress',
    [CERT_STATUS.COMPLETED]: 'Passed',
    [CERT_STATUS.NEEDS_RENEWAL]: 'Renew',
  }[status];

  const StatusIcon = {
    [CERT_STATUS.NOT_STARTED]: IconMap.Circle,
    [CERT_STATUS.IN_PROGRESS]: IconMap.Clock,
    [CERT_STATUS.COMPLETED]: IconMap.CheckCircle2,
    [CERT_STATUS.NEEDS_RENEWAL]: IconMap.RefreshCw,
  }[status];

  return (
    <div
      className={`cert-node ${statusClass} ${isUnlocked ? 'cert-node--unlocked' : ''} ${certIgnored ? 'cert-node--ignored' : ''}`}
      style={{
        '--cert-node-color': pathColor,
        '--cert-node-index': index,
        '--cert-node-delay': `${index * 100 + 200}ms`,
      }}
      id={`cert-node-${cert.id}`}
    >
      {/* CertNode Info Card */}
      <div className="cert-node__info" onClick={handleOpenDetail}>
        {getBadgeUrl(cert.level, cert.id) && (
          <img 
            src={getBadgeUrl(cert.level, cert.id)} 
            alt={`${cert.level} Badge`} 
            className="cert-node__badge-icon" 
            loading="lazy"
          />
        )}
        <div className="cert-node__info-header">
          <span className="cert-node__exam-code">{cert.examCode}</span>
          <div className="cert-node__badges">
            <Badge variant={levelVariant} small>{cert.level}</Badge>
            
            {cert.level === CERT_LEVELS.FUNDAMENTALS && (
              <Badge variant="default" small>Optional</Badge>
            )}
            
            {/* Prerequisite Tags */}
            {cert.prerequisites?.length > 0 && (
              cert.prerequisites.map((prereqItem, index) => {
                if (Array.isArray(prereqItem)) {
                  return (
                    <Badge key={`prereq-group-${index}`} variant="default" small>
                      <Link size={9} />
                      Requires 1 of {prereqItem.length}
                    </Badge>
                  );
                }
                const prereqCert = getCertById(prereqItem)?.cert;
                if (!prereqCert) return null;
                return (
                  <Badge key={`prereq-${prereqItem}`} variant={prereqCert.level.toLowerCase()} small>
                    <Link size={9} />
                    Requires {prereqCert.examCode}
                  </Badge>
                );
              })
            )}

            {retiring && (
              <Badge variant="retiring" small>
                <AlertTriangle size={9} />
                Retiring {formatDate(cert.retirementDate)}
              </Badge>
            )}
            {retired && (
              <Badge variant="retiring" small outline>
                <ArchiveX size={9} />
                Retired {formatDate(cert.retirementDate)}
              </Badge>

            )}
            {cert.isBeta && (
              <Badge variant="default" small>
                Beta
              </Badge>
            )}
            {cert.isComingSoon && (
              <Badge variant="default" small>
                Coming soon
              </Badge>
            )}
            {certIgnored && (
              <Badge variant="retiring" small>
                <EyeOff size={9} />
                Excluded
              </Badge>
            )}
          </div>
        </div>
        <h3 className="cert-node__name">{cert.name}</h3>
        <p className="cert-node__description">{cert.description}</p>
        <div className="cert-node__actions">
          <a
            href={cert.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-node__learn-link"
            onClick={(e) => e.stopPropagation()}
          >
            <Microsoft size={12} />
            Microsoft Learn
          </a>
          <button
            className={`cert-node__cycle-btn cert-node__cycle-btn--${status.replace('_', '-')}`}
            onClick={handleCycleStatus}
            title={`${statusLabel} — Click to toggle status`}
            aria-label={`Change status: ${statusLabel}`}
          >
            <StatusIcon size={12} />
            {nextStatusLabel}
          </button>
          <button
            className={`cert-node__fast-untrack-btn ${certIgnored ? 'cert-node__fast-untrack-btn--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isPathIgnored) {
                toggleCertIgnored(cert.id);
              }
            }}
            disabled={isPathIgnored}
            title={isPathIgnored ? "Path is excluded" : (certIgnored ? "Include in tracking" : "Exclude from tracking")}
          >
            {certIgnored ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertNode;
