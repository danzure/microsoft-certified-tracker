import { NavLink } from 'react-router-dom';
import { certificationPaths } from '../../data/certificationPaths';
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
          {certificationPaths.map((path) => {
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
        </nav>
        <div className="sidebar__footer">
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
