import { Link, useLocation } from 'react-router-dom';
import { Map, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';
import * as Icons from 'lucide-react';
import SearchBar from '../common/SearchBar';
import ProgressRing from '../common/ProgressRing';
import { useProgressContext } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { getPathById } from '../../data/certificationPaths';
import './Header.css';

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const { getPathProgress } = useProgressContext();
  const { toggleTheme, isDark } = useTheme();
  
  const pathMatch = location.pathname.match(/^\/path\/(.+)$/);
  const pathId = pathMatch ? pathMatch[1] : null;
  const activePath = pathId ? getPathById(pathId) : null;
  const pathProgress = activePath ? getPathProgress(activePath.id) : null;

  return (
    <header className="header glass" id="app-header">
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="toggle-sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link to="/" className="header__brand" id="brand-link">
          <div className="header__logo">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#f25022" />
              <rect x="11" y="1" width="8" height="8" rx="1.5" fill="#7fba00" />
              <rect x="1" y="11" width="8" height="8" rx="1.5" fill="#00a4ef" />
              <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#ffb900" />
            </svg>
          </div>
          <div className="header__title">
            <span className="header__title-main">Certification Tracker</span>
          </div>
        </Link>
      </div>

      <div className="header__center">
        {activePath ? (
          <div className="header__active-path">
            {(() => {
              const PathIcon = Icons[activePath.icon] || Icons.Circle;
              return <PathIcon size={16} color={activePath.color} />;
            })()}
            <span className="header__active-path-title" style={{ color: activePath.color }}>
              {activePath.name}
            </span>
            <div className="header__active-path-divider" />
            <div className="header__active-path-progress">
              <ProgressRing percent={pathProgress.percent} size={16} strokeWidth={2.5} color={activePath.color} showPercent={false} />
              <span className="header__active-path-stat">
                {pathProgress.percent}%
              </span>
            </div>
          </div>
        ) : (
          <SearchBar />
        )}
      </div>

      <nav className="header__right">
        <Link
          to="/"
          className={`header__nav-link ${location.pathname === '/' ? 'header__nav-link--active' : ''}`}
          id="nav-dashboard"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/map"
          className={`header__nav-link ${location.pathname === '/map' ? 'header__nav-link--active' : ''}`}
          id="nav-map"
        >
          <Map size={16} />
          <span>Map</span>
        </Link>

        <div className="header__divider" />

        <button
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          <div className="header__theme-icon-wrapper">
            <Sun size={16} className={`header__theme-icon ${!isDark ? 'header__theme-icon--active' : ''}`} />
            <Moon size={16} className={`header__theme-icon ${isDark ? 'header__theme-icon--active' : ''}`} />
          </div>
        </button>

      </nav>
    </header>
  );
};

export default Header;
