import { Link } from 'react-router-dom';
import { IconMap as Icons } from '../common/IconMap';
const { Menu, Sun, Moon } = Icons;
import SearchBar from '../common/SearchBar';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

/**
 * Header Component
 * 
 * Displays the top navigation bar containing the sidebar toggle,
 * application brand, theme toggle, and search bar.
 * 
 * @param {Object} props
 * @param {Function} props.onToggleSidebar - Callback to toggle the sidebar's open/close state
 */
const Header = ({ onToggleSidebar }) => {
  const { toggleTheme, isDark } = useTheme();

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
        <SearchBar />
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
