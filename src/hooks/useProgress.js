import { useState, useCallback, useEffect } from 'react';
import { CERT_STATUS, certificationPaths } from '../data/certificationPaths';

const STORAGE_KEY = 'ms-cert-tracker-progress';
const IGNORED_STORAGE_KEY = 'ms-cert-tracker-ignored';

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

export const useProgress = () => {
  const [progress, setProgress] = useState(() => loadData(STORAGE_KEY, {}));
  const [ignoredPaths, setIgnoredPaths] = useState(() => loadData(IGNORED_STORAGE_KEY, []));

  useEffect(() => {
    saveData(STORAGE_KEY, progress);
  }, [progress]);

  useEffect(() => {
    saveData(IGNORED_STORAGE_KEY, ignoredPaths);
  }, [ignoredPaths]);

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

  const getPathProgress = useCallback(
    (pathId) => {
      const path = certificationPaths.find((p) => p.id === pathId);
      if (!path) return { total: 0, completed: 0, inProgress: 0, percent: 0 };

      const total = path.certifications.length;
      const completed = path.certifications.filter(
        (c) => progress[c.id] === CERT_STATUS.COMPLETED
      ).length;
      const inProgress = path.certifications.filter(
        (c) => progress[c.id] === CERT_STATUS.IN_PROGRESS
      ).length;

      return {
        total,
        completed,
        inProgress,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [progress]
  );

  const getOverallProgress = useCallback(() => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;

    certificationPaths.forEach((path) => {
      if (ignoredPaths.includes(path.id)) return; // Skip ignored paths

      path.certifications.forEach((cert) => {
        // Skip interchange duplicates
        if (!cert.isInterchange) {
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
  }, [progress, ignoredPaths]);

  const resetAll = useCallback(() => {
    setProgress({});
  }, []);

  return {
    progress,
    ignoredPaths,
    getStatus,
    setStatus,
    cycleStatus,
    getPathProgress,
    getOverallProgress,
    togglePathIgnored,
    isPathIgnored,
    resetAll,
  };
};
