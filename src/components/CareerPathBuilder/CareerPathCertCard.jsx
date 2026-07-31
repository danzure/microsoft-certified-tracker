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
  const { getStatus, setStatus } = useProgressContext();
  
  const status = getStatus(certInfo.id);
  const isAdded = customPlaylist.includes(certInfo.id);

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[certInfo.level];

  const handleSetStatus = (newStatus, e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus(certInfo.id, newStatus);
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
              {/* Note: State tags like Retiring/Beta could go here if added to certInfo */}
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

      <div className="cert-node__info-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant={levelVariant} small>{certInfo.level}</Badge>
          {certInfo.roleData ? certInfo.roleData.map((r, i) => {
            const RoleIcon = r.icon ? Icons[r.icon] : null;
            return (
              <Badge key={`role-${i}`} color={r.color} small outline>
                {RoleIcon && <RoleIcon size={10} />}
                Job role: {r.title}
              </Badge>
            );
          }) : certInfo.role && (
            <Badge variant="default" small outline>Job role: {certInfo.role}</Badge>
          )}
          {certInfo.prerequisites?.length > 0 && (
            certInfo.prerequisites.map((prereqGroup, idx) => {
              const prereqTexts = prereqGroup.map(id => {
                // Shorten some names
                if (id === 'az-104') return 'AZ-104';
                return id.toUpperCase();
              });
              return (
                <Badge key={`prereq-${idx}`} variant="default" small style={{ 
                  color: 'var(--colorBrandForeground2)', 
                  borderColor: 'var(--colorBrandStroke2)',
                  background: 'var(--colorBrandBackground2)'
                }}>
                  <Icons.Link size={10} />
                  Prereq: {prereqTexts.join(' OR ')}
                </Badge>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
              className={`cert-node__learn-link`}
              style={{ 
                border: '1px solid',
                borderColor: isAdded ? 'var(--success-color, #10b981)' : 'var(--border-subtle)', 
                color: isAdded ? 'var(--success-color, #10b981)' : 'var(--text-secondary)',
                background: isAdded ? 'color-mix(in srgb, var(--success-color, #10b981) 10%, transparent)' : 'var(--bg-surface-2)',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                isAdded ? onRemove(certInfo.id) : onAdd(certInfo.id);
              }}
            >
              {isAdded ? <Icons.Check size={12} /> : <Icons.Plus size={12} />}
              {isAdded ? 'Added to Custom' : 'Add to Custom'}
            </button>
          </div>
          
          <div className="cert-node__status-toggle" style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
            <button
              className={`cert-node__toggle-btn ${status === CERT_STATUS.NOT_STARTED ? 'cert-node__toggle-btn--active' : ''}`}
              onClick={(e) => handleSetStatus(CERT_STATUS.NOT_STARTED, e)}
              title="Not Started"
              aria-label="Mark as Not Started"
            >
              <Icons.Circle size={14} />
            </button>
            <button
              className={`cert-node__toggle-btn ${status === CERT_STATUS.IN_PROGRESS ? 'cert-node__toggle-btn--active' : ''}`}
              onClick={(e) => handleSetStatus(CERT_STATUS.IN_PROGRESS, e)}
              title="In Progress"
              aria-label="Mark as In Progress"
            >
              <Icons.Clock size={14} />
            </button>
            <button
              className={`cert-node__toggle-btn ${status === CERT_STATUS.COMPLETED ? 'cert-node__toggle-btn--active' : ''}`}
              onClick={(e) => handleSetStatus(CERT_STATUS.COMPLETED, e)}
              title="Passed"
              aria-label="Mark as Passed"
            >
              <Icons.CheckCircle2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
