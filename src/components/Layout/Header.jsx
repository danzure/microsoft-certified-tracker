import { Link } from 'react-router-dom';
import { IconMap as Icons } from '../common/IconMap';
const { Menu, Sun, Moon, Desktop } = Icons;
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
  const { themePref, setTheme } = useTheme();

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
        <div className="header__theme-group" role="group" aria-label="Theme preference">
          <button
            onClick={() => setTheme('light')}
            className={`header__theme-btn ${themePref === 'light' ? 'header__theme-btn--active' : ''}`}
            aria-label="Light mode"
            title="Light mode"
          >
            <Sun size={16} />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`header__theme-btn ${themePref === 'system' ? 'header__theme-btn--active' : ''}`}
            aria-label="System mode"
            title="System mode"
          >
            <Desktop size={16} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`header__theme-btn ${themePref === 'dark' ? 'header__theme-btn--active' : ''}`}
            aria-label="Dark mode"
            title="Dark mode"
          >
            <Moon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
