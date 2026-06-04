import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ms-cert-tracker-theme';

const ThemeContext = createContext(null);

/**
 * Provider component that manages the application's dark/light theme state.
 * Automatically synchronizes the theme with localStorage and updates the DOM.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // Ignore error
    }
    // Default to system preference
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
/**
 * Custom hook to consume the ThemeContext.
 * @returns An object containing the current theme, an isDark boolean, and a toggleTheme function.
 * @throws {Error} If called outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
