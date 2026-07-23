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
        <div className="header__brand" id="brand-link">
          <a href="https://atozazure.com" className="header__brand-prefix hover-opacity" style={{ textDecoration: 'none' }}>atozazure</a>
          <span className="header__brand-divider hidden sm:inline">|</span>
          <Link to="/" className="header__brand-title hidden sm:inline hover-opacity" style={{ textDecoration: 'none' }}>Certification Tracker</Link>
        </div>
      </div>

      <div className="header__center">
        <SearchBar />
      </div>

      <div className="header__right">
        <div className="header__theme-group" role="group" aria-label="Theme preference">
          {/* Sliding Indicator */}
          <div 
            className="header__theme-indicator"
            style={{ 
              left: themePref === 'light' ? '3px' : themePref === 'system' ? '35px' : '67px'
            }} 
          />

          <button
            onClick={() => setTheme('light')}
            className={`header__theme-btn ${themePref === 'light' ? 'header__theme-btn--active' : ''}`}
            aria-label="Light mode"
            title="Light mode"
          >
            <Sun 
              size={16} 
              className={`header__theme-icon ${themePref === 'light' ? 'header__theme-icon--rotate-0' : 'header__theme-icon--rotate-neg90'}`} 
            />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`header__theme-btn ${themePref === 'system' ? 'header__theme-btn--active' : ''}`}
            aria-label="System mode"
            title="System mode"
          >
            <Desktop 
              size={16} 
              className={`header__theme-icon ${themePref === 'system' ? 'header__theme-icon--scale-100' : 'header__theme-icon--scale-90'}`} 
            />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`header__theme-btn ${themePref === 'dark' ? 'header__theme-btn--active' : ''}`}
            aria-label="Dark mode"
            title="Dark mode"
          >
            <Moon 
              size={16} 
              className={`header__theme-icon ${themePref === 'dark' ? 'header__theme-icon--rotate-0' : 'header__theme-icon--rotate-90'}`} 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
