export const CURRENCIES = {
  GBP: { symbol: '£', label: 'GBP (£)' },
  USD: { symbol: '$', label: 'USD ($)' },
  EUR: { symbol: '€', label: 'EUR (€)' },
};

export const DEFAULT_CURRENCY = 'GBP';

// Base pricing for Microsoft exams
export const PRICING = {
  Fundamentals: {
    GBP: 69,
    USD: 99,
    EUR: 99,
  },
  Associate: {
    GBP: 132,
    USD: 165,
    EUR: 165,
  },
  Expert: {
    GBP: 132,
    USD: 165,
    EUR: 165,
  },
  Specialty: {
    GBP: 132,
    USD: 165,
    EUR: 165,
  },
};

/**
 * Returns the cost object for a given certification level.
 * If the level is not found, defaults to Associate pricing.
 * @param {string} level - The certification level (e.g., 'Fundamentals', 'Associate')
 * @returns {Object} Cost map across currencies
 */
export const getCostsForLevel = (level) => {
  return PRICING[level] || PRICING.Associate;
};

/**
 * Gets the numerical cost for a specific certification level and currency.
 * @param {string} level - The certification level
 * @param {string} currency - The currency code ('GBP', 'USD', 'EUR')
 * @returns {number} The cost amount
 */
export const getExamCost = (level, currency) => {
  const costs = getCostsForLevel(level);
  return costs[currency] || costs[DEFAULT_CURRENCY];
};

/**
 * Gets the formatted cost string with the correct symbol.
 * @param {string} level - The certification level
 * @param {string} currency - The currency code ('GBP', 'USD', 'EUR')
 * @returns {string} Formatted string, e.g., "£132"
 */
export const getFormattedExamCost = (level, currency) => {
  const cost = getExamCost(level, currency);
  const symbol = CURRENCIES[currency]?.symbol || CURRENCIES[DEFAULT_CURRENCY].symbol;
  return `${symbol}${cost}`;
};
