import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import { useState, Suspense, lazy } from 'react';
import './App.css';

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const MetroLine = lazy(() => import('./components/MetroMap/MetroLine'));

/**
 * Main application component.
 * Sets up global routing, theme, and progress contexts.
 * Uses lazy loading for main route components to optimize bundle size.
 */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProgressProvider>
          <div className="app">
            <Header onToggleSidebar={toggleSidebar} />
            <div className={`app__body ${sidebarOpen ? '' : 'app__body--collapsed'}`}>
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />
              <main className="app__content" id="main-content">
                <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/path/:pathId" element={<MetroLine />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </ProgressProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
