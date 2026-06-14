import { NavLink } from 'react-router-dom';
import { certificationPaths, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { IconMap as Icons } from '../common/IconMap';
import './Sidebar.css';

/**
 * Navigation sidebar component displaying all available certification paths.
 * Allows quick jumping to specific paths and highlights the active route.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the sidebar is currently expanded (mobile view)
 * @param {Function} props.onClose - Callback to close the sidebar
 * @param {Function} props.onToggle - Callback to toggle the sidebar state
 */
const Sidebar = ({ isOpen, onClose, onToggle }) => {
  const { getPathProgress } = useProgressContext();

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={20} /> : <Icons.Circle size={20} />;
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--collapsed'}`} id="path-sidebar">
        <div className={`sidebar__header ${isOpen ? 'sidebar__header--open' : 'sidebar__header--collapsed'}`}>
          {isOpen && <span className="sidebar__header-title">Navigation</span>}
          <button className="sidebar__toggle-btn sidebar__toggle-desktop" onClick={onToggle} aria-label="Toggle sidebar">
            {isOpen ? <Icons.ChevronsLeft size={20} /> : <Icons.ChevronsRight size={20} />}
          </button>
          <button className="sidebar__toggle-btn sidebar__toggle-mobile" onClick={onClose} aria-label="Close sidebar">
            <Icons.X size={20} />
          </button>
        </div>
        <nav className="sidebar__nav">
          <div className="sidebar__pillar-group">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  onClose();
                }
              }}
              style={{ '--line-color': 'var(--colorBrandForeground1)' }}
              title="Dashboard"
            >
              <div className="sidebar__link-indicator" />
              <div className="sidebar__link-icon" title="Dashboard">
                <Icons.LayoutDashboard size={20} />
              </div>
              <div className="sidebar__link-content">
                <span className="sidebar__link-name">Dashboard</span>
              </div>
            </NavLink>

            <NavLink
              to="/career-paths"
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  onClose();
                }
              }}
              style={{ '--line-color': 'var(--colorBrandForeground1)' }}
              title="Career Paths"
            >
              <div className="sidebar__link-indicator" />
              <div className="sidebar__link-icon" title="Career Paths">
                <Icons.TrendingUp size={20} />
              </div>
              <div className="sidebar__link-content">
                <span className="sidebar__link-name">Career Paths</span>
              </div>
            </NavLink>

          </div>
          {Object.values(PILLARS).map((pillarName) => {
            const pillarPaths = certificationPaths.filter((p) => p.pillar === pillarName);
            if (pillarPaths.length === 0) return null;

            return (
              <div key={pillarName} className="sidebar__pillar-group">
                <div className="sidebar__pillar-title">
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
                      onClick={() => {
                        if (window.innerWidth <= 768) {
                          onClose();
                        }
                      }}
                      id={`sidebar-${path.id}`}
                      style={{ '--line-color': path.color, '--line-glow': path.glowColor }}
                      title={path.shortName}
                    >
                      <div className="sidebar__link-indicator" />
                      <div className="sidebar__link-icon" title={path.shortName}>
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
            <span className="sidebar__poster-text">Official Certification Poster</span>
          </a>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
