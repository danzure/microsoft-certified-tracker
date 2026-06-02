import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import MetroLine from './components/MetroMap/MetroLine';

import { useState } from 'react';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProgressProvider>
          <div className="app">
            <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className={`app__body ${sidebarOpen ? '' : 'app__body--collapsed'}`}>
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />
              <main className="app__content" id="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/path/:pathId" element={<MetroLine />} />
                </Routes>
              </main>
            </div>
          </div>
        </ProgressProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
