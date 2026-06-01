import { CERT_STATUS, CERT_LEVELS, getCertById } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { isRetiring, isRetired, formatDate, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import { AlertTriangle, Check, ExternalLink, ArrowRightLeft, Link, ArchiveX } from 'lucide-react';
import './Station.css';

const Station = ({ cert, pathColor, onSelect, index, isUnlocked }) => {
  const { getStatus, cycleStatus } = useProgressContext();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const retired = isRetired(cert);

  const statusClass = {
    [CERT_STATUS.NOT_STARTED]: 'station--not-started',
    [CERT_STATUS.IN_PROGRESS]: 'station--in-progress',
    [CERT_STATUS.COMPLETED]: 'station--completed',
  }[status];

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[cert.level];

  const handleClick = (e) => {
    e.stopPropagation();
    cycleStatus(cert.id);
  };

  const handleDetail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(cert);
  };

  return (
    <div
      className={`station ${statusClass} ${cert.isInterchange ? 'station--interchange' : ''} ${isUnlocked ? 'station--unlocked' : ''}`}
      style={{
        '--station-color': pathColor,
        '--station-index': index,
        '--station-delay': `${index * 100 + 200}ms`,
      }}
      id={`station-${cert.id}`}
    >
      {/* Station Node (Circle) */}
      <button
        id={`station-node-${cert.id}`}
        className="station__node"
        onClick={handleClick}
        onContextMenu={handleDetail}
        aria-label={`${cert.examCode} - ${cert.name} - Click to change status`}
        title="Click to cycle status"
      >
        <div className="station__node-outer">
          <div className="station__node-inner">
            {status === CERT_STATUS.COMPLETED && <Check size={14} strokeWidth={3} />}
            {status === CERT_STATUS.IN_PROGRESS && <div className="station__node-half" />}
            {cert.isInterchange && status === CERT_STATUS.NOT_STARTED && <ArrowRightLeft size={10} />}
          </div>
        </div>
      </button>

      {/* Station Info Card */}
      <div className="station__info" onClick={handleDetail}>
        {getBadgeUrl(cert.level, cert.id) && (
          <img 
            src={getBadgeUrl(cert.level, cert.id)} 
            alt={`${cert.level} Badge`} 
            className="station__badge-icon" 
            loading="lazy"
          />
        )}
        <div className="station__info-header">
          <span className="station__exam-code">{cert.examCode}</span>
          <div className="station__badges">
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
            {cert.isInterchange && (
              <Badge variant="interchange" small>
                <ArrowRightLeft size={9} />
                Interchange
              </Badge>
            )}
            {cert.isComingSoon && (
              <Badge variant="default" small>
                Coming soon
              </Badge>
            )}
          </div>
        </div>
        <h3 className="station__name">{cert.name}</h3>
        <p className="station__description">{cert.description}</p>
        <div className="station__actions">
          <a
            href={cert.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="station__learn-link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} />
            Microsoft Learn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Station;
