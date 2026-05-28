import { createContext, useContext } from 'react';
import { useProgress } from '../hooks/useProgress';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const progress = useProgress();
  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};
