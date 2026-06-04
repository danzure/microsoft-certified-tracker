import { CERT_STATUS } from '../data/certificationPaths';

/**
 * Returns a human-readable label for a given certification status.
 * @param {string} status - The certification status
 * @returns {string} The formatted status label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case CERT_STATUS.COMPLETED: return 'Completed';
    case CERT_STATUS.IN_PROGRESS: return 'In Progress';
    default: return 'Not Started';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case CERT_STATUS.COMPLETED: return '✓';
    case CERT_STATUS.IN_PROGRESS: return '◐';
    default: return '○';
  }
};

export const getLevelColor = (level) => {
  switch (level) {
    case 'Fundamentals': return '#60a5fa';
    case 'Associate': return '#a78bfa';
    case 'Expert': return '#f59e0b';
    case 'Specialty': return '#ec4899';
    default: return '#94a3b8';
  }
};

export const isRetiring = (cert) => {
  if (!cert.retirementDate) return false;
  return new Date(cert.retirementDate) > new Date();
};

export const isRetired = (cert) => {
  if (!cert.retirementDate) return false;
  return new Date(cert.retirementDate) <= new Date();
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getBadgeUrl = (level, certId) => {
  if (certId === 'ab-700') return 'https://learn.microsoft.com/en-us/media/learn/certification/badges/ai-business-professional.svg';
  if (certId === 'ab-701') return 'https://learn.microsoft.com/en-us/media/learn/certification/badges/ai-transformation-leader.svg';

  const base = 'https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-';
  switch (level) {
    case 'Fundamentals': return base + 'fundamentals-badge.svg';
    case 'Associate': return base + 'associate-badge.svg';
    case 'Expert': return base + 'expert-badge.svg';
    case 'Specialty': return base + 'specialty-badge.svg';
    default: return null;
  }
};
