import { createContext, useContext } from 'react';
import { useProgress } from '../hooks/useProgress';

const ProgressContext = createContext(null);

/**
 * Provider component that wraps the application and supplies 
 * the current user's progress state and tracking functions via context.
 */
export const ProgressProvider = ({ children }) => {
  const progress = useProgress();
  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
};

/**
 * Custom hook to consume the ProgressContext.
 * @returns The context value exposing state and functions from useProgress.
 * @throws {Error} If called outside of a ProgressProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};
