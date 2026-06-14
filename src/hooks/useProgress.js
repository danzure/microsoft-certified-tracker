import { useState, useCallback, useEffect } from 'react';
import { CERT_STATUS, certificationPaths, doesCertExpire } from '../data/certificationPaths';

const STORAGE_KEY = 'ms-cert-tracker-progress';
const IGNORED_STORAGE_KEY = 'ms-cert-tracker-ignored';
const IGNORED_CERTS_STORAGE_KEY = 'ms-cert-tracker-ignored-certs';
const DISMISSED_CERTS_KEY = 'ms-cert-tracker-dismissed-certs';
const DATES_KEY = 'ms-cert-tracker-dates';
const CUSTOM_PLAYLIST_KEY = 'ms-cert-tracker-custom-playlist';

const loadData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
};

/**
 * Custom hook to manage user's certification progress and tracking states.
 * Handles persistence to localStorage and provides state manipulation methods.
 * 
 * @returns {Object} Progress state, tracking lists, and mutation functions
 */
export const useProgress = () => {
  const [progress, setProgress] = useState(() => loadData(STORAGE_KEY, {}));
  const [ignoredPaths, setIgnoredPaths] = useState(() => loadData(IGNORED_STORAGE_KEY, []));
  const [ignoredCerts, setIgnoredCerts] = useState(() => loadData(IGNORED_CERTS_STORAGE_KEY, []));
  const [dismissedCerts, setDismissedCerts] = useState(() => loadData(DISMISSED_CERTS_KEY, []));
  const [completionDates, setCompletionDates] = useState(() => loadData(DATES_KEY, {}));
  const [customPlaylist, setCustomPlaylist] = useState(() => loadData(CUSTOM_PLAYLIST_KEY, []));

  useEffect(() => {
    saveData(STORAGE_KEY, progress);
  }, [progress]);

  useEffect(() => {
    saveData(IGNORED_STORAGE_KEY, ignoredPaths);
  }, [ignoredPaths]);

  useEffect(() => {
    saveData(IGNORED_CERTS_STORAGE_KEY, ignoredCerts);
  }, [ignoredCerts]);

  useEffect(() => {
    saveData(DISMISSED_CERTS_KEY, dismissedCerts);
  }, [dismissedCerts]);

  useEffect(() => {
    saveData(DATES_KEY, completionDates);
  }, [completionDates]);

  useEffect(() => {
    saveData(CUSTOM_PLAYLIST_KEY, customPlaylist);
  }, [customPlaylist]);

  const getStatus = useCallback(
    (certId) => {
      const baseStatus = progress[certId] || CERT_STATUS.NOT_STARTED;
      if (baseStatus === CERT_STATUS.COMPLETED) {
        let certLevel = null;
        for (const path of certificationPaths) {
          const cert = path.certifications.find(c => c.id === certId);
          if (cert) {
            certLevel = cert.level;
            break;
          }
        }
        if (doesCertExpire(certLevel)) {
          const completedDate = completionDates[certId];
          if (completedDate) {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (new Date(completedDate) < oneYearAgo) {
              return CERT_STATUS.NEEDS_RENEWAL;
            }
          }
        }
      }
      return baseStatus;
    },
    [progress, completionDates]
  );

  const setStatus = useCallback((certId, status, dateStr = null) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (status === CERT_STATUS.NOT_STARTED) {
        delete next[certId];
      } else {
        next[certId] = status;
      }
      return next;
    });

    if (status === CERT_STATUS.COMPLETED) {
      setCompletionDates(prev => ({ ...prev, [certId]: dateStr || new Date().toISOString() }));
    } else if (status === CERT_STATUS.NOT_STARTED) {
      setCompletionDates(prev => {
        const next = { ...prev };
        delete next[certId];
        return next;
      });
    }
  }, []);

  const setCompletionDate = useCallback((certId, dateStr) => {
    setCompletionDates(prev => ({ ...prev, [certId]: dateStr }));
  }, []);

  const cycleStatus = useCallback(
    (certId) => {
      const current = getStatus(certId);
      const nextMap = {
        [CERT_STATUS.NOT_STARTED]: CERT_STATUS.IN_PROGRESS,
        [CERT_STATUS.IN_PROGRESS]: CERT_STATUS.COMPLETED,
        [CERT_STATUS.COMPLETED]: CERT_STATUS.NOT_STARTED,
        [CERT_STATUS.NEEDS_RENEWAL]: CERT_STATUS.COMPLETED, // Cycle back to completed (renews)
      };
      setStatus(certId, nextMap[current]);
    },
    [getStatus, setStatus]
  );

  const togglePathIgnored = useCallback((pathId) => {
    setIgnoredPaths((prev) => 
      prev.includes(pathId) ? prev.filter(id => id !== pathId) : [...prev, pathId]
    );
  }, []);

  const isPathIgnored = useCallback((pathId) => {
    return ignoredPaths.includes(pathId);
  }, [ignoredPaths]);

  const toggleCertIgnored = useCallback((certId) => {
    setIgnoredCerts((prev) =>
      prev.includes(certId) ? prev.filter(id => id !== certId) : [...prev, certId]
    );
  }, []);

  const isCertIgnored = useCallback((certId) => {
    return ignoredCerts.includes(certId);
  }, [ignoredCerts]);

  const toggleCertDismissed = useCallback((certId) => {
    setDismissedCerts((prev) =>
      prev.includes(certId) ? prev.filter(id => id !== certId) : [...prev, certId]
    );
  }, []);

  const isCertDismissed = useCallback((certId) => {
    return dismissedCerts.includes(certId);
  }, [dismissedCerts]);

  const getPathProgress = useCallback(
    (pathId) => {
      const path = certificationPaths.find((p) => p.id === pathId);
      if (!path) return { total: 0, completed: 0, inProgress: 0, percent: 0 };

      const tracked = path.certifications.filter(c => !ignoredCerts.includes(c.id));
      const total = tracked.length;
      const completed = tracked.filter(
        (c) => getStatus(c.id) === CERT_STATUS.COMPLETED || getStatus(c.id) === CERT_STATUS.NEEDS_RENEWAL
      ).length;
      const inProgress = tracked.filter(
        (c) => getStatus(c.id) === CERT_STATUS.IN_PROGRESS
      ).length;

      return {
        total,
        completed,
        inProgress,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [ignoredCerts, getStatus]
  );

  const getOverallProgress = useCallback(() => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;

    certificationPaths.forEach((path) => {
      if (ignoredPaths.includes(path.id)) return; // Skip ignored paths

      path.certifications.forEach((cert) => {
        // Skip interchange duplicates and individually ignored certs
        if (!cert.isInterchange && !ignoredCerts.includes(cert.id)) {
          total++;
          const stat = getStatus(cert.id);
          if (stat === CERT_STATUS.COMPLETED || stat === CERT_STATUS.NEEDS_RENEWAL) completed++;
          if (stat === CERT_STATUS.IN_PROGRESS) inProgress++;
        }
      });
    });

    return {
      total,
      completed,
      inProgress,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [ignoredPaths, ignoredCerts, getStatus]);

  const resetAll = useCallback(() => {
    setProgress({});
  }, []);

  return {
    progress,
    ignoredPaths,
    ignoredCerts,
    dismissedCerts,
    getStatus,
    setStatus,
    cycleStatus,
    getPathProgress,
    getOverallProgress,
    togglePathIgnored,
    isPathIgnored,
    toggleCertIgnored,
    isCertIgnored,
    toggleCertDismissed,
    isCertDismissed,
    resetAll,
    completionDates,
    setCompletionDate,
    customPlaylist,
    setCustomPlaylist,
  };
};
