



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
