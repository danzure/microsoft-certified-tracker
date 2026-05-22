import { useParams } from 'react-router-dom';
import { getPathById, CERT_LEVELS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Station from './Station';
import ProgressRing from '../common/ProgressRing';
import Badge from '../common/Badge';
import CertDetail from '../CertDetail/CertDetail';
import * as Icons from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './MetroLine.css';

const MetroLine = () => {
  const { pathId } = useParams();
  const path = getPathById(pathId);
  const { getPathProgress, getStatus } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);
  const trackRef = useRef(null);
  const [trackHeight, setTrackHeight] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setTrackHeight(entry.contentRect.height);
        }
      });
      observer.observe(trackRef.current);
      return () => observer.disconnect();
    }
  }, [path]);

  if (!path) {
    return (
      <div className="metro-line__not-found">
        <Icons.MapPinOff size={48} />
        <h2>Path not found</h2>
        <p>The certification path you're looking for doesn't exist.</p>
      </div>
    );
  }

  const prog = getPathProgress(path.id);
  const Icon = Icons[path.icon] || Icons.Circle;

  // Group certifications by level
  const levels = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];
  const groupedCerts = levels
    .map((level) => ({
      level,
      certs: path.certifications.filter((c) => c.level === level),
    }))
    .filter((g) => g.certs.length > 0);

  return (
    <div className="metro-line" style={{ '--path-color': path.color, '--path-glow': path.glowColor }}>
      {/* Path Header */}
      <div className="metro-line__header" id={`path-header-${path.id}`}>
        <div className="metro-line__header-left">
          <div className="metro-line__icon-wrapper">
            <Icon size={28} />
          </div>
          <div>
            <h1 className="metro-line__title">{path.name}</h1>
            <p className="metro-line__description">{path.description}</p>
          </div>
        </div>
        <div className="metro-line__header-right">
          <div className="metro-line__stats">
            <div className="metro-line__stat">
              <span className="metro-line__stat-value">{prog.completed}</span>
              <span className="metro-line__stat-label">Completed</span>
            </div>
            <div className="metro-line__stat">
              <span className="metro-line__stat-value">{prog.inProgress}</span>
              <span className="metro-line__stat-label">In Progress</span>
            </div>
            <div className="metro-line__stat">
              <span className="metro-line__stat-value">{prog.total}</span>
              <span className="metro-line__stat-label">Total</span>
            </div>
          </div>
          <ProgressRing percent={prog.percent} size={72} strokeWidth={5} color={path.color} />
        </div>
      </div>

      {/* Metro Line Track */}
      <div className="metro-line__track-container" ref={trackRef}>
        {/* SVG Track Line */}
        <div className="metro-line__track-svg">
          <svg width="36" height={trackHeight || 100} className="metro-line__svg">
            <line
              x1="18"
              y1="0"
              x2="18"
              y2={trackHeight || 100}
              stroke={path.color}
              strokeWidth="3"
              strokeDasharray={trackHeight}
              strokeDashoffset={trackHeight}
              className="metro-line__track-line"
              style={{ '--track-length': trackHeight }}
            />
            {/* Glow line */}
            <line
              x1="18"
              y1="0"
              x2="18"
              y2={trackHeight || 100}
              stroke={path.color}
              strokeWidth="8"
              strokeOpacity="0.1"
              strokeDasharray={trackHeight}
              strokeDashoffset={trackHeight}
              className="metro-line__track-line"
              style={{ '--track-length': trackHeight }}
            />
          </svg>
        </div>

        {/* Stations */}
        <div className="metro-line__stations">
          {groupedCerts.map((group) => (
            <div key={group.level} className="metro-line__level-group">
              <div className="metro-line__level-marker">
                <div className="metro-line__level-badge">
                  <Badge variant={group.level.toLowerCase()}>{group.level}</Badge>
                </div>
                <div className="metro-line__level-line" />
              </div>
              <div className="metro-line__level-stations">
                {group.certs.map((cert, idx) => (
                  <Station
                    key={cert.id}
                    cert={cert}
                    pathColor={path.color}
                    onSelect={setSelectedCert}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCert && (
        <CertDetail
          cert={selectedCert}
          path={path}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default MetroLine;
