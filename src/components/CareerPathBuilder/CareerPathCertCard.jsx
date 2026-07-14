import { useNavigate } from 'react-router-dom';
import { useProgressContext } from '../../context/ProgressContext';
import { CERT_STATUS } from '../../data/certificationPaths';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';
import { getBadgeUrl } from '../../utils/helpers';
import '../PathMap/CertNode.css';

/**
 * CareerPathCertCard Component
 * 
 * Displays a summarized card for a certification within the CareerPathBuilder list view.
 * It provides actions to toggle tracking status, add/remove from the custom playlist, 
 * and navigate to Microsoft Learn.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.certInfo - The certification data to display.
 * @param {Array<string>} props.customPlaylist - The array of certification IDs currently in the user's custom playlist.
 * @param {Function} props.onAdd - Callback when the certification is added to the custom playlist.
 * @param {Function} props.onRemove - Callback when the certification is removed from the custom playlist.
 * @returns {JSX.Element}
 */
export const CareerPathCertCard = ({ certInfo, customPlaylist, onAdd, onRemove }) => {
  const navigate = useNavigate();
  const { getStatus, cycleStatus } = useProgressContext();
  
  const status = getStatus(certInfo.id);
  const isAdded = customPlaylist.includes(certInfo.id);

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[certInfo.level];

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
    [CERT_STATUS.NOT_STARTED]: Icons.Circle,
    [CERT_STATUS.IN_PROGRESS]: Icons.Clock,
    [CERT_STATUS.COMPLETED]: Icons.CheckCircle2,
    [CERT_STATUS.NEEDS_RENEWAL]: Icons.RefreshCw,
  }[status];

  const handleCycleStatus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cycleStatus(certInfo.id);
  };

  return (
    <div 
      className="cert-node__info" 
      onClick={() => navigate(`/path/${certInfo.pathId}`)}
      style={{ 
        '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)', 
        height: 'auto', 
        minHeight: '172px', 
        margin: 0
      }}
    >
      <div className="cert-node__info-header">
        <div className="cert-node__icon-title">
          <div className="cert-node__icon">
            {getBadgeUrl(certInfo.level, certInfo.id) ? (
              <img 
                src={getBadgeUrl(certInfo.level, certInfo.id)} 
                alt={`${certInfo.level} Badge`} 
                className="cert-node__badge-image" 
                loading="lazy"
              />
            ) : (
              <Icons.Award size={20} />
            )}
          </div>
          <div className="cert-node__title-group">
            <div className="cert-node__badge-stats">
              <span className="cert-node__exam-code">{certInfo.examCode}</span>
              <Badge variant={levelVariant} small>{certInfo.level}</Badge>
            </div>
            <h3 className="cert-node__name">
              {certInfo.name.startsWith('Microsoft') ? certInfo.name : `Microsoft Certified: ${certInfo.name}`}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="cert-node__info-body">
        <p className="cert-node__description">
          {certInfo.description}
        </p>
      </div>

      <div className="cert-node__actions">
        <a
          href={certInfo.learnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-node__learn-link"
          onClick={(e) => e.stopPropagation()}
        >
          <Icons.Microsoft size={12} />
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
        
        <div style={{ flex: 1 }} />
        
        <button
          className={`cert-node__cycle-btn`}
          style={{ 
            borderColor: isAdded ? 'var(--success-color, #10b981)' : '', 
            color: isAdded ? 'var(--success-color, #10b981)' : '',
            background: isAdded ? 'color-mix(in srgb, var(--success-color, #10b981) 10%, transparent)' : ''
          }}
          onClick={(e) => {
            e.stopPropagation();
            isAdded ? onRemove(certInfo.id) : onAdd(certInfo.id);
          }}
        >
          {isAdded ? <Icons.Check size={12} /> : <Icons.PlusCircle size={12} />}
          {isAdded ? 'Added' : 'Add'}
        </button>
      </div>
    </div>
  );
};
