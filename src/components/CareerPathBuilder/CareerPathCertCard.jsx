import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressContext } from '../../context/ProgressContext';
import { CERT_STATUS, CERT_LEVELS } from '../../data/certificationPaths';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';
import { getBadgeUrl } from '../../utils/helpers';
import '../PathMap/CertNode.css';

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
    [CERT_STATUS.IN_PROGRESS]: 'Complete',
    [CERT_STATUS.COMPLETED]: 'Reset',
    [CERT_STATUS.NEEDS_RENEWAL]: 'Renew',
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
        margin: 0,
        paddingRight: 'var(--space-3)'
      }}
    >
      {getBadgeUrl(certInfo.level, certInfo.id) && (
        <img 
          src={getBadgeUrl(certInfo.level, certInfo.id)} 
          alt={`${certInfo.level} Badge`} 
          className="cert-node__badge-icon" 
          loading="lazy"
        />
      )}
      <div className="cert-node__info-header" style={{ paddingRight: '48px' }}>
        <span className="cert-node__exam-code">{certInfo.examCode}</span>
        <div className="cert-node__badges">
          <Badge variant={levelVariant} small>{certInfo.level}</Badge>
        </div>
      </div>
      <h3 className="cert-node__name" style={{ paddingRight: '48px' }}>
        {certInfo.name.startsWith('Microsoft') ? certInfo.name : `Microsoft Certified: ${certInfo.name}`}
      </h3>
      <p className="cert-node__description">
        {certInfo.description}
      </p>

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
          title={`${statusLabel} — Click to ${nextStatusLabel.toLowerCase()}`}
          aria-label={`Change status: ${statusLabel}`}
        >
          <Icons.RefreshCw size={12} />
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
