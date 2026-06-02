import { Link, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
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
    <header className="header" id="app-header">
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="toggle-sidebar"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="header__brand" id="brand-link">
          <span className="header__brand-prefix">atozazure</span>
          <span className="header__brand-divider hidden sm:inline">|</span>
          <span className="header__brand-title hidden sm:inline">Certification Tracker</span>
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

      <div className="header__right">
        <button
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span className="header__theme-text hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
