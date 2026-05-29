import { useNavigate } from 'react-router-dom';
import { certificationPaths, CERT_STATUS, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Badge from '../common/Badge';
import * as Icons from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getOverallProgress, getPathProgress, getStatus, togglePathIgnored, isPathIgnored } = useProgressContext();
  const overall = getOverallProgress();

  // Get recently in-progress items
  const inProgressCerts = certificationPaths
    .filter(path => !isPathIgnored(path.id))
    .flatMap((path) =>
      path.certifications
        .filter((cert) => getStatus(cert.id) === CERT_STATUS.IN_PROGRESS)
        .map((cert) => ({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id }))
    );

  // Recommended next: first not-started cert in paths that have at least one completed/in-progress
  const recommendations = certificationPaths
    .filter(path => !isPathIgnored(path.id))
    .map((path) => {
      const hasProgress = path.certifications.some(
        (c) => getStatus(c.id) === CERT_STATUS.COMPLETED || getStatus(c.id) === CERT_STATUS.IN_PROGRESS
      );
      if (!hasProgress) return null;
      const nextCert = path.certifications.find((c) => getStatus(c.id) === CERT_STATUS.NOT_STARTED);
      if (!nextCert) return null;
      return { ...nextCert, pathName: path.shortName, pathColor: path.color, pathId: path.id };
    })
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="dashboard" id="dashboard">
      {/* Header Panel */}
      <div className="dashboard__header-panel">
        <div className="dashboard__hero">
          <div className="dashboard__hero-icon-container">
            <Icons.LayoutDashboard size={28} className="dashboard__hero-icon" />
          </div>
          <div className="dashboard__hero-content">
            <h1 className="dashboard__hero-title">
              atozazure | Certification Tracker
            </h1>
            <p className="dashboard__hero-subtitle">
              Manage and track your progress across {certificationPaths.length} Microsoft certification paths
            </p>
          </div>
        </div>

        <div className="dashboard__stats">
          <div className="dashboard__stat-card dashboard__stat-card--total">
            <div className="dashboard__stat-icon">
              <Icons.Award size={20} />
            </div>
            <div className="dashboard__stat-info">
              <span className="dashboard__stat-value">{overall.total}</span>
              <span className="dashboard__stat-label">Total Certifications</span>
            </div>
          </div>
          <div className="dashboard__stat-card dashboard__stat-card--completed">
            <div className="dashboard__stat-icon">
              <Icons.CheckCircle2 size={20} />
            </div>
            <div className="dashboard__stat-info">
              <span className="dashboard__stat-value">{overall.completed}</span>
              <span className="dashboard__stat-label">Completed</span>
            </div>
          </div>
          <div className="dashboard__stat-card dashboard__stat-card--progress">
            <div className="dashboard__stat-icon">
              <Icons.Clock size={20} />
            </div>
            <div className="dashboard__stat-info">
              <span className="dashboard__stat-value">{overall.inProgress}</span>
              <span className="dashboard__stat-label">In Progress</span>
            </div>
          </div>
          <div className="dashboard__stat-card dashboard__stat-card--percent">
            <div className="dashboard__stat-icon">
              <Icons.TrendingUp size={20} />
            </div>
            <div className="dashboard__stat-info">
              <span className="dashboard__stat-value">{overall.percent}%</span>
              <span className="dashboard__stat-label">Overall Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Path Cards */}
      <div className="dashboard__section">
        
        {Object.values(PILLARS).map((pillarName) => {
          const pillarPaths = certificationPaths.filter(p => p.pillar === pillarName);
          if (pillarPaths.length === 0) return null;
          
          return (
            <div key={pillarName} className="dashboard__pillar-group" style={{ marginBottom: 'var(--space-4)' }}>
              <h3 className="dashboard__pillar-title" style={{ 
                fontSize: 'var(--fs-subtitle1)', 
                fontWeight: 'var(--fw-semibold)', 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-2)',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: 'var(--space-1)'
              }}>
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
                        '--card-glow': isIgnored ? 'transparent' : path.glowColor,
                        animationDelay: `${idx * 60}ms`,
                      }}
                      id={`dashboard-path-${path.id}`}
                    >
                      <div className="dashboard__path-card-body">
                        <div className="dashboard__path-card-header">
                          <div className="dashboard__path-icon">
                            <Icon size={22} />
                          </div>
                          <button
                            className="dashboard__path-toggle-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePathIgnored(path.id);
                            }}
                            title={isIgnored ? "Include in overall tracking" : "Exclude from overall tracking"}
                          >
                            {isIgnored ? <Icons.Square size={20} /> : <Icons.CheckSquare size={20} />}
                          </button>
                        </div>
                        <h3 className="dashboard__path-name" style={{ opacity: isIgnored ? 0.6 : 1, fontSize: 'var(--fs-body1)' }}>{path.shortName}</h3>
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
                          <div className="dashboard__path-progress-bar" style={{
                            marginTop: 'var(--space-3)',
                            height: '4px',
                            background: 'var(--border-subtle)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${prog.percent}%`,
                              height: '100%',
                              background: 'var(--card-color)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard__bottom-row">
        {/* In Progress */}
        {inProgressCerts.length > 0 && (
          <div className="dashboard__section dashboard__section--half">
            <h2 className="dashboard__section-title">
              <Icons.Clock size={20} />
              Currently Studying
            </h2>
            <div className="dashboard__active-list">
              {inProgressCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="dashboard__list-item"
                  onClick={() => navigate(`/path/${cert.pathId}`)}
                  style={{ '--card-color': cert.pathColor }}
                >
                  <div className="dashboard__list-item-icon" style={{ background: `color-mix(in srgb, var(--card-color) 15%, transparent)`, color: 'var(--card-color)' }}>
                    <Icons.BookOpen size={18} />
                  </div>
                  <div className="dashboard__list-item-info">
                    <span className="dashboard__list-item-code">{cert.examCode}</span>
                    <span className="dashboard__list-item-name">{cert.name}</span>
                  </div>
                  <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                  <Icons.ChevronRight size={16} className="dashboard__list-item-chevron" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="dashboard__section dashboard__section--half">
            <h2 className="dashboard__section-title">
              <Icons.Lightbulb size={20} />
              Recommended Next
            </h2>
            <div className="dashboard__active-list">
              {recommendations.map((cert) => (
                <div
                  key={cert.id}
                  className="dashboard__list-item"
                  onClick={() => navigate(`/path/${cert.pathId}`)}
                  style={{ '--card-color': cert.pathColor }}
                >
                  <div className="dashboard__list-item-icon" style={{ background: `color-mix(in srgb, var(--card-color) 15%, transparent)`, color: 'var(--card-color)' }}>
                    <Icons.Lightbulb size={18} />
                  </div>
                  <div className="dashboard__list-item-info">
                    <span className="dashboard__list-item-code">{cert.examCode}</span>
                    <span className="dashboard__list-item-name">{cert.name}</span>
                  </div>
                  <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                  <Icons.ChevronRight size={16} className="dashboard__list-item-chevron" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
