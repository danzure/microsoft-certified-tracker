import { useState, useCallback, useEffect } from 'react';
import { CERT_STATUS, certificationPaths } from '../data/certificationPaths';

const STORAGE_KEY = 'ms-cert-tracker-progress';
const IGNORED_STORAGE_KEY = 'ms-cert-tracker-ignored';
const IGNORED_CERTS_STORAGE_KEY = 'ms-cert-tracker-ignored-certs';
const DISMISSED_CERTS_KEY = 'ms-cert-tracker-dismissed-certs';

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

  const getStatus = useCallback(
    (certId) => progress[certId] || CERT_STATUS.NOT_STARTED,
    [progress]
  );

  const setStatus = useCallback((certId, status) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (status === CERT_STATUS.NOT_STARTED) {
        delete next[certId];
      } else {
        next[certId] = status;
      }
      return next;
    });
  }, []);

  const cycleStatus = useCallback(
    (certId) => {
      const current = progress[certId] || CERT_STATUS.NOT_STARTED;
      const nextMap = {
        [CERT_STATUS.NOT_STARTED]: CERT_STATUS.IN_PROGRESS,
        [CERT_STATUS.IN_PROGRESS]: CERT_STATUS.COMPLETED,
        [CERT_STATUS.COMPLETED]: CERT_STATUS.NOT_STARTED,
      };
      setStatus(certId, nextMap[current]);
    },
    [progress, setStatus]
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
        (c) => progress[c.id] === CERT_STATUS.COMPLETED
      ).length;
      const inProgress = tracked.filter(
        (c) => progress[c.id] === CERT_STATUS.IN_PROGRESS
      ).length;

      return {
        total,
        completed,
        inProgress,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [progress, ignoredCerts]
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
          if (progress[cert.id] === CERT_STATUS.COMPLETED) completed++;
          if (progress[cert.id] === CERT_STATUS.IN_PROGRESS) inProgress++;
        }
      });
    });

    return {
      total,
      completed,
      inProgress,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [progress, ignoredPaths, ignoredCerts]);

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
  };
};
