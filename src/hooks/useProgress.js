import { useState, useCallback, useEffect } from 'react';
import { CERT_STATUS, certificationPaths } from '../data/certificationPaths';

const STORAGE_KEY = 'ms-cert-tracker-progress';

const loadProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

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
  }, [progress]);

  const resetAll = useCallback(() => {
    setProgress({});
  }, []);

  return {
    progress,
    getStatus,
    setStatus,
    cycleStatus,
    getPathProgress,
    getOverallProgress,
    resetAll,
  };
};
