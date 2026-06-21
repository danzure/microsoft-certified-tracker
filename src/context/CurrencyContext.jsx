import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CURRENCY } from '../utils/pricing';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Initialize from localStorage or use default
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('atozazure_currency');
      return saved || DEFAULT_CURRENCY;
    } catch (e) {
      console.warn('Failed to access localStorage for currency:', e);
      return DEFAULT_CURRENCY;
    }
  });

  // Update localStorage when currency changes
  useEffect(() => {
    try {
      localStorage.setItem('atozazure_currency', currency);
    } catch (e) {
      console.warn('Failed to save currency to localStorage:', e);
    }
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyState }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
