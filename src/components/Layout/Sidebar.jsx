import { NavLink } from 'react-router-dom';
import { certificationPaths, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import * as Icons from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { getPathProgress } = useProgressContext();

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={18} /> : <Icons.Circle size={18} />;
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar glass ${isOpen ? 'sidebar--open' : ''}`} id="path-sidebar">
        <div className="sidebar__header">
          <span className="sidebar__label">Certification Lines</span>
        </div>
        <nav className="sidebar__nav">
          {Object.values(PILLARS).map((pillarName) => {
            const pillarPaths = certificationPaths.filter((p) => p.pillar === pillarName);
            if (pillarPaths.length === 0) return null;

            return (
              <div key={pillarName} className="sidebar__pillar-group" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="sidebar__pillar-title" style={{
                  fontSize: 'var(--fs-caption1)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  color: 'var(--text-tertiary)',
                  fontWeight: 'var(--fw-semibold)',
                  padding: 'var(--space-2) var(--space-4)',
                  marginTop: 'var(--space-2)',
                }}>
                  {pillarName}
                </div>
                {pillarPaths.map((path) => {
                  const prog = getPathProgress(path.id);
                  return (
                    <NavLink
                      key={path.id}
                      to={`/path/${path.id}`}
                      className={({ isActive }) =>
                        `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                      }
                      onClick={onClose}
                      id={`sidebar-${path.id}`}
                      style={{ '--line-color': path.color, '--line-glow': path.glowColor }}
                    >
                      <div className="sidebar__link-indicator" />
                      <div className="sidebar__link-icon">
                        {getIcon(path.icon)}
                      </div>
                      <div className="sidebar__link-content">
                        <span className="sidebar__link-name">{path.shortName}</span>
                        <div className="sidebar__link-progress-bar">
                          <div
                            className="sidebar__link-progress-fill"
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>
                      </div>
                      <span className="sidebar__link-count">
                        {prog.completed}/{prog.total}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="sidebar__footer">
          <a
            href="https://arch-center.azureedge.net/Credentials/Certification-Poster_en-us.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__poster-link"
          >
            <Icons.ExternalLink size={14} />
            Official Certification Poster
          </a>
          <div className="sidebar__legend">
            <div className="sidebar__legend-item">
              <span className="sidebar__legend-dot sidebar__legend-dot--completed" />
              <span>Completed</span>
            </div>
            <div className="sidebar__legend-item">
              <span className="sidebar__legend-dot sidebar__legend-dot--progress" />
              <span>In Progress</span>
            </div>
            <div className="sidebar__legend-item">
              <span className="sidebar__legend-dot sidebar__legend-dot--not-started" />
              <span>Not Started</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
