import { useNavigate } from 'react-router-dom';
import { certificationPaths, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import ProgressRing from '../common/ProgressRing';
import Badge from '../common/Badge';
import * as Icons from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getOverallProgress, getPathProgress, getStatus } = useProgressContext();
  const overall = getOverallProgress();

  // Get recently in-progress items
  const inProgressCerts = certificationPaths.flatMap((path) =>
    path.certifications
      .filter((cert) => getStatus(cert.id) === CERT_STATUS.IN_PROGRESS)
      .map((cert) => ({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id }))
  );

  // Recommended next: first not-started cert in paths that have at least one completed/in-progress
  const recommendations = certificationPaths
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
      {/* Hero */}
      <div className="dashboard__hero">
        <div className="dashboard__hero-bg">
          {certificationPaths.map((path, i) => (
            <div
              key={path.id}
              className="dashboard__hero-line"
              style={{
                '--line-color': path.color,
                '--line-index': i,
                '--line-delay': `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        <div className="dashboard__hero-content">
          <h1 className="dashboard__hero-title">
            Microsoft<br />
            <span className="dashboard__hero-highlight">Certification Tracker</span>
          </h1>
          <p className="dashboard__hero-subtitle">
            Track your progress across {certificationPaths.length} certification paths
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard__stats">
        <div className="dashboard__stat-card dashboard__stat-card--total">
          <div className="dashboard__stat-icon">
            <Icons.Award size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.total}</span>
            <span className="dashboard__stat-label">Total Certifications</span>
          </div>
        </div>
        <div className="dashboard__stat-card dashboard__stat-card--completed">
          <div className="dashboard__stat-icon">
            <Icons.CheckCircle2 size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.completed}</span>
            <span className="dashboard__stat-label">Completed</span>
          </div>
        </div>
        <div className="dashboard__stat-card dashboard__stat-card--progress">
          <div className="dashboard__stat-icon">
            <Icons.Clock size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.inProgress}</span>
            <span className="dashboard__stat-label">In Progress</span>
          </div>
        </div>
        <div className="dashboard__stat-card dashboard__stat-card--percent">
          <div className="dashboard__stat-icon">
            <Icons.TrendingUp size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{overall.percent}%</span>
            <span className="dashboard__stat-label">Overall Progress</span>
          </div>
        </div>
      </div>

      {/* Path Cards */}
      <div className="dashboard__section">
        <h2 className="dashboard__section-title">
          <Icons.Route size={20} />
          Certification Paths
        </h2>
        <div className="dashboard__paths-grid">
          {certificationPaths.map((path, idx) => {
            const prog = getPathProgress(path.id);
            const Icon = Icons[path.icon] || Icons.Circle;
            return (
              <div
                key={path.id}
                className="dashboard__path-card"
                onClick={() => navigate(`/path/${path.id}`)}
                style={{
                  '--card-color': path.color,
                  '--card-glow': path.glowColor,
                  animationDelay: `${idx * 60}ms`,
                }}
                id={`dashboard-path-${path.id}`}
              >
                <div className="dashboard__path-card-top" />
                <div className="dashboard__path-card-body">
                  <div className="dashboard__path-card-header">
                    <div className="dashboard__path-icon">
                      <Icon size={20} />
                    </div>
                    <ProgressRing percent={prog.percent} size={48} strokeWidth={3} color={path.color} />
                  </div>
                  <h3 className="dashboard__path-name">{path.shortName}</h3>
                  <p className="dashboard__path-desc">{path.description}</p>
                  <div className="dashboard__path-stats">
                    <span className="dashboard__path-stat">
                      <Icons.CheckCircle2 size={12} />
                      {prog.completed} done
                    </span>
                    <span className="dashboard__path-stat">
                      <Icons.Clock size={12} />
                      {prog.inProgress} active
                    </span>
                    <span className="dashboard__path-stat">
                      <Icons.Circle size={12} />
                      {prog.total - prog.completed - prog.inProgress} left
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In Progress */}
      {inProgressCerts.length > 0 && (
        <div className="dashboard__section">
          <h2 className="dashboard__section-title">
            <Icons.Clock size={20} />
            Currently Studying
          </h2>
          <div className="dashboard__active-list">
            {inProgressCerts.map((cert) => (
              <div
                key={cert.id}
                className="dashboard__active-card"
                onClick={() => navigate(`/path/${cert.pathId}`)}
                style={{ '--card-color': cert.pathColor }}
              >
                <div className="dashboard__active-dot" />
                <div className="dashboard__active-info">
                  <span className="dashboard__active-code">{cert.examCode}</span>
                  <span className="dashboard__active-name">{cert.name}</span>
                </div>
                <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="dashboard__section">
          <h2 className="dashboard__section-title">
            <Icons.Lightbulb size={20} />
            Recommended Next
          </h2>
          <div className="dashboard__active-list">
            {recommendations.map((cert) => (
              <div
                key={cert.id}
                className="dashboard__active-card"
                onClick={() => navigate(`/path/${cert.pathId}`)}
                style={{ '--card-color': cert.pathColor }}
              >
                <div className="dashboard__active-dot" />
                <div className="dashboard__active-info">
                  <span className="dashboard__active-code">{cert.examCode}</span>
                  <span className="dashboard__active-name">{cert.name}</span>
                </div>
                <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
