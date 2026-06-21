import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificationPaths, CERT_STATUS, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';
import './Dashboard.css';

/**
 * Dashboard Component
 * 
 * Provides an overview of the user's certification tracking progress.
 * Displays total statistics, a quick-access strip for actively studied certifications,
 * and a grid of all available certification paths categorized by technology pillar.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { getOverallProgress, getPathProgress, getStatus, togglePathIgnored, isPathIgnored, isCertIgnored } = useProgressContext();
  const overall = useMemo(() => getOverallProgress(), [getOverallProgress]);

  const inProgressCerts = useMemo(() => {
    return certificationPaths
      .filter(path => !isPathIgnored(path.id))
      .flatMap((path) =>
        path.certifications
          .filter((cert) => !isCertIgnored(cert.id) && getStatus(cert.id) === CERT_STATUS.IN_PROGRESS)
          .map((cert) => ({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id }))
      );
  }, [isPathIgnored, isCertIgnored, getStatus]);

  const needsRenewalCerts = useMemo(() => {
    return certificationPaths
      .filter(path => !isPathIgnored(path.id))
      .flatMap((path) =>
        path.certifications
          .filter((cert) => !isCertIgnored(cert.id) && getStatus(cert.id) === CERT_STATUS.NEEDS_RENEWAL)
          .map((cert) => ({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id }))
      );
  }, [isPathIgnored, isCertIgnored, getStatus]);


  return (
    <div className="dashboard" id="dashboard">
      
      {/* Header Section */}
      <div className="dashboard__header">
        <h1 className="dashboard__title">
          Certification Tracker
        </h1>
        <p className="dashboard__subtitle">
          Navigate your Microsoft certification journey with ease. This tool is designed to help you track your progress across {certificationPaths.length} distinct technology paths, from Azure and AI to Security and Data. Whether you are aiming for a specific role or broadening your skill set, use this tracker to explore role-based career guides, manage your exam renewals, and visually map out your next steps for continuous professional growth.
        </p>
      </div>

      {/* Stats Row */}
      <div className="dashboard__stats">
        <div className="dashboard__stat-card" style={{ animationDelay: '0ms', '--card-color': 'var(--colorBrandForeground1)' }}>
          <div className="dashboard__stat-icon dashboard__stat-icon--total">
            <Icons.Award size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.total}</span>
            <span className="dashboard__stat-label">Total Certifications</span>
          </div>
        </div>
        <div className="dashboard__stat-card" style={{ animationDelay: '50ms', '--card-color': 'var(--status-completed)' }}>
          <div className="dashboard__stat-icon dashboard__stat-icon--completed">
            <Icons.CheckCircle2 size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.completed}</span>
            <span className="dashboard__stat-label">Completed</span>
          </div>
        </div>
        <div className="dashboard__stat-card" style={{ animationDelay: '100ms', '--card-color': 'var(--status-in-progress)' }}>
          <div className="dashboard__stat-icon dashboard__stat-icon--progress">
            <Icons.Clock size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.inProgress}</span>
            <span className="dashboard__stat-label">In Progress</span>
          </div>
        </div>
        <div className="dashboard__stat-card" style={{ animationDelay: '150ms', '--card-color': 'var(--colorBrandForeground1)' }}>
          <div className="dashboard__stat-icon dashboard__stat-icon--percent">
            <Icons.TrendingUp size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.percent}%</span>
            <span className="dashboard__stat-label">Overall Progress</span>
          </div>
        </div>
      </div>

      {/* Getting Started Hint */}
      {overall.completed === 0 && overall.inProgress === 0 && (
        <div className="dashboard__empty-hint">
          <Icons.TrendingUp size={16} />
          <span>Start your certification journey — click any path below to begin tracking your progress.</span>
        </div>
      )}

      {/* Activity & Recommendations Strip */}
      {(inProgressCerts.length > 0 || needsRenewalCerts.length > 0) && (
        <div className="dashboard__activity-strip">
          {needsRenewalCerts.length > 0 && (
            <div className="dashboard__activity-panel" style={{ border: '1px solid rgba(255, 107, 107, 0.3)', background: 'rgba(255, 107, 107, 0.05)' }}>
              <h2 className="dashboard__activity-title" style={{ color: '#ff6b6b' }}>
                <Icons.AlertTriangle size={18} />
                Needs Renewal
                <span className="dashboard__activity-count" style={{ background: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}>{needsRenewalCerts.length}</span>
              </h2>
              <div className="dashboard__activity-list">
                {needsRenewalCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="dashboard__activity-item"
                    onClick={() => navigate(`/path/${cert.pathId}`)}
                    style={{ '--card-color': cert.pathColor, borderLeft: '3px solid #ff6b6b' }}
                  >
                    <div className="dashboard__activity-item-icon" style={{ color: '#ff6b6b', background: 'rgba(255,107,107,0.1)' }}>
                      <Icons.Award size={16} />
                    </div>
                    <div className="dashboard__activity-item-info">
                      <span className="dashboard__activity-item-code">{cert.examCode}</span>
                      <span className="dashboard__activity-item-name">{cert.name}</span>
                    </div>
                    <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                    <Icons.ChevronRight size={16} className="dashboard__activity-item-chevron" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Currently Studying */}
          {inProgressCerts.length > 0 && (
            <div className="dashboard__activity-panel">
            <h2 className="dashboard__activity-title">
              <Icons.Clock size={18} />
              Currently Studying
              <span className="dashboard__activity-count">{inProgressCerts.length}</span>
            </h2>
            <div className="dashboard__activity-list">
              {inProgressCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="dashboard__activity-item"
                  onClick={() => navigate(`/path/${cert.pathId}`)}
                  style={{ '--card-color': cert.pathColor }}
                >
                  <div className="dashboard__activity-item-icon">
                    <Icons.BookOpen size={16} />
                  </div>
                  <div className="dashboard__activity-item-info">
                    <span className="dashboard__activity-item-code">{cert.examCode}</span>
                    <span className="dashboard__activity-item-name">{cert.name}</span>
                  </div>
                  <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                  <Icons.ChevronRight size={16} className="dashboard__activity-item-chevron" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

      {/* Path Cards */}
      <div className="dashboard__section">
        {Object.values(PILLARS).map((pillarName) => {
          const pillarPaths = certificationPaths.filter(p => p.pillar === pillarName);
          if (pillarPaths.length === 0) return null;
          
          return (
            <div key={pillarName} className="dashboard__pillar-group">
              <h3 className="dashboard__pillar-title">
                {pillarName}
              </h3>
              <div className="dashboard__paths-grid">
                {pillarPaths.map((path, idx) => {
                  const prog = getPathProgress(path.id);
                  const isIgnored = isPathIgnored(path.id);
                  const Icon = Icons[path.icon] || Icons.Circle;
                  return (
                    <div
                      key={path.id}
                      className={`dashboard__path-card ${isIgnored ? 'dashboard__path-card--ignored' : ''}`}
                      onClick={() => navigate(`/path/${path.id}`)}
                      style={{
                        '--card-color': isIgnored ? 'var(--text-disabled)' : path.color,
                        animationDelay: `${idx * 100 + 200}ms`,
                      }}
                      id={`dashboard-path-${path.id}`}
                    >
                      <div className="dashboard__path-card-header">
                        <div className="dashboard__path-icon">
                          <Icon size={24} />
                        </div>
                        <div className="dashboard__path-actions">
                          <Icons.ArrowRight size={20} className="dashboard__path-arrow" />
                        </div>
                      </div>
                      
                      <h2 className="dashboard__path-name" style={{ opacity: isIgnored ? 0.6 : 1 }}>
                        {path.shortName}
                      </h2>
                      
                      <p className="dashboard__path-desc" style={{ opacity: isIgnored ? 0.6 : 1 }}>
                        {isIgnored ? "Not tracking progress" : path.description}
                      </p>
                      
                      <div className="dashboard__path-stats" style={{ opacity: isIgnored ? 0.4 : 1 }}>
                        <span className="dashboard__path-stat">
                          <Icons.CheckCircle2 size={14} />
                          {prog.completed} done
                        </span>
                        <span className="dashboard__path-stat">
                          <Icons.Clock size={14} />
                          {prog.inProgress} active
                        </span>
                        <span className="dashboard__path-stat">
                          <Icons.Circle size={14} />
                          {prog.total - prog.completed - prog.inProgress} left
                        </span>
                      </div>
                      
                      {!isIgnored && (
                        <div className="dashboard__path-progress-container">
                          <div 
                            className="dashboard__path-progress-fill"
                            style={{ width: `${prog.percent}%` }} 
                          />
                        </div>
                      )}

                      <button
                        className={`dashboard__path-exclude-btn ${isIgnored ? 'dashboard__path-exclude-btn--active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePathIgnored(path.id);
                        }}
                        title={isIgnored ? "Include in overall tracking" : "Exclude from overall tracking"}
                      >
                        {isIgnored ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default Dashboard;
