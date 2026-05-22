import { useParams } from 'react-router-dom';
import { getPathById, CERT_LEVELS, LEVEL_ORDER } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Station from './Station';
import ProgressRing from '../common/ProgressRing';
import Badge from '../common/Badge';
import CertDetail from '../CertDetail/CertDetail';
import * as Icons from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import './MetroLine.css';

const MetroLine = () => {
  const { pathId } = useParams();
  const path = getPathById(pathId);
  const { getPathProgress, getStatus } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);
  const containerRef = useRef(null);
  const [nodeCoords, setNodeCoords] = useState({});

  // 1. Calculate Track Assignments (Main trunk vs branches)
  const trackAssignments = useMemo(() => {
    if (!path) return {};
    const certsMap = new Map(path.certifications.map((c) => [c.id, c]));
    const assignedTracks = {};
    let nextTrack = 0;

    // Sort by level (highest first) to find the longest main trunk
    const sortedCerts = [...path.certifications].sort(
      (a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]
    );

    sortedCerts.forEach((cert) => {
      if (assignedTracks[cert.id] !== undefined) return;
      const currentTrack = nextTrack++;
      
      let curr = cert;
      while (curr) {
        if (assignedTracks[curr.id] === undefined) {
          assignedTracks[curr.id] = currentTrack;
        }
        
        if (curr.prerequisites && curr.prerequisites.length > 0) {
          const unassignedPrereq = curr.prerequisites.find((id) => assignedTracks[id] === undefined);
          if (unassignedPrereq) {
            curr = certsMap.get(unassignedPrereq);
          } else {
            curr = null;
          }
        } else {
          curr = null;
        }
      }
    });

    return assignedTracks;
  }, [path]);

  // 2. Measure Station Node Coordinates
  useEffect(() => {
    if (!containerRef.current || !path) return;

    const measure = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newCoords = {};
      
      path.certifications.forEach((cert) => {
        const el = document.getElementById(`station-node-${cert.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          newCoords[cert.id] = {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top,
          };
        }
      });
      setNodeCoords(newCoords);
    };

    // Give DOM a frame to render flex layouts before measuring
    requestAnimationFrame(measure);
    
    // Also use ResizeObserver for smooth responsive tracking
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [path]);

  // 3. Generate SVG Paths
  const svgPaths = useMemo(() => {
    if (Object.keys(nodeCoords).length === 0) return [];
    
    const lines = [];
    path.certifications.forEach((cert) => {
      if (!cert.prerequisites) return;
      
      cert.prerequisites.forEach((prereqId) => {
        const start = nodeCoords[prereqId];
        const end = nodeCoords[cert.id];
        
        if (start && end) {
          let d = '';
          if (Math.abs(start.x - end.x) < 2) {
            // Straight vertical line
            d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
          } else {
            // S-Curve branching
            const midY = (start.y + end.y) / 2;
            d = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
          }
          lines.push({ id: `${prereqId}-${cert.id}`, d });
        }
      });
    });
    return lines;
  }, [nodeCoords, path]);

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
  const isMeasured = Object.keys(nodeCoords).length > 0;

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

      {/* Metro Line Graph Container */}
      <div className="metro-line__track-container" ref={containerRef}>
        
        {/* Dynamic SVG Multi-Track Overlay */}
        <svg 
          className="metro-line__svg-overlay" 
          style={{ opacity: isMeasured ? 1 : 0 }}
        >
          <defs>
            <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glow lines */}
          {svgPaths.map((line) => (
            <path
              key={`${line.id}-glow`}
              d={line.d}
              fill="none"
              stroke={path.color}
              strokeWidth="8"
              strokeOpacity="0.1"
              filter="url(#line-glow)"
              className="metro-line__dynamic-path"
            />
          ))}

          {/* Solid lines */}
          {svgPaths.map((line) => (
            <path
              key={line.id}
              d={line.d}
              fill="none"
              stroke={path.color}
              strokeWidth="3"
              strokeLinecap="round"
              className="metro-line__dynamic-path"
            />
          ))}
        </svg>

        {/* Stations HTML List */}
        <div className="metro-line__stations">
          {groupedCerts.map((group) => (
            <div key={group.level} className="metro-line__level-group">
              <div className="metro-line__level-marker">
                <div className="metro-line__level-badge">
                  <Badge variant={group.level.toLowerCase()}>{group.level}</Badge>
                </div>
                {/* Horizontal divider line for the group */}
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
                      trackIndex={Math.min(trackAssignments[cert.id] || 0, 2)}
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
