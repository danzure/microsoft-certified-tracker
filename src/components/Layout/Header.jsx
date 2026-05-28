import { Link, useLocation } from 'react-router-dom';
import { Map, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import ProgressRing from '../common/ProgressRing';
import { useProgressContext } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const { getOverallProgress } = useProgressContext();
  const { toggleTheme, isDark } = useTheme();
  const overall = getOverallProgress();

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
        <SearchBar />
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

        <div className="header__progress" id="overall-progress">
          <ProgressRing percent={overall.percent} size={32} strokeWidth={2.5} color="var(--colorBrandForeground1)" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
