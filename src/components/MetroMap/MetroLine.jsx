import { useParams } from 'react-router-dom';
import { getPathById, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Station from './Station';
import ProgressRing from '../common/ProgressRing';
import Badge from '../common/Badge';
import CertDetail from '../CertDetail/CertDetail';
import * as Icons from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import './MetroLine.css';

const MetroLine = () => {
  const { pathId } = useParams();
  const path = getPathById(pathId);
  const { getPathProgress, getStatus } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);
  
  const containerRef = useRef(null);
  const [activeSegments, setActiveSegments] = useState([]);

  // Determine Trunk vs Branch certifications
  const trunkSet = useMemo(() => {
    if (!path) return new Set();
    const set = new Set();
    const certsMap = new Map(path.certifications.map((c) => [c.id, c]));

    let maxChain = [];
    
    const getChain = (certId) => {
      const chain = [certId];
      let current = certsMap.get(certId);
      while (current && current.prerequisites && current.prerequisites.length > 0) {
        const validPrereq = current.prerequisites.find(id => certsMap.has(id));
        if (validPrereq) {
          chain.push(validPrereq);
          current = certsMap.get(validPrereq);
        } else {
          break;
        }
      }
      return chain;
    };

    path.certifications.forEach(cert => {
      const chain = getChain(cert.id);
      if (chain.length > maxChain.length) {
        maxChain = chain;
      }
    });

    maxChain.forEach(id => set.add(id));
    return set;
  }, [path]);

  // Measure segments to draw the solid progress rail between completed certs
  useEffect(() => {
    if (!path || !containerRef.current) return;

    const measureSegments = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const segments = [];

      path.certifications.forEach(cert => {
        // Only draw a segment if this cert is completed
        if (getStatus(cert.id) !== CERT_STATUS.COMPLETED) return;

        const prereqs = cert.prerequisites || [];
        if (prereqs.length === 0) return;

        // Connect to the FIRST completed prereq. If none, connect to the first prereq.
        let targetPrereq = prereqs.find(id => getStatus(id) === CERT_STATUS.COMPLETED);
        if (!targetPrereq) targetPrereq = prereqs[0];

        const prereqEl = document.getElementById(`station-${targetPrereq}`);
        const certEl = document.getElementById(`station-${cert.id}`);

        if (prereqEl && certEl) {
          const prereqRect = prereqEl.getBoundingClientRect();
          const certRect = certEl.getBoundingClientRect();

          // The circular node is 28px tall, its center is ~14px from the top of the station wrapper
          let y1 = (prereqRect.top - containerRect.top) + 14;
          const y2 = (certRect.top - containerRect.top) + 14;

          // If the prerequisite is a Fundamentals certification (the root), start the line from the very top
          const prereqCert = path.certifications.find(c => c.id === targetPrereq);
          if (prereqCert && prereqCert.level === CERT_LEVELS.FUNDAMENTALS) {
            y1 = 0;
          }

          segments.push({
            id: `${targetPrereq}-${cert.id}`,
            top: Math.min(y1, y2),
            height: Math.abs(y2 - y1)
          });
        }
      });

      setActiveSegments(segments);
    };

    measureSegments();

    const observer = new ResizeObserver(measureSegments);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [path, getStatus]);

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

  const levels = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];
  const groupedCerts = levels
    .map((level) => {
      const certsInLevel = path.certifications
        .filter((c) => c.level === level)
        .sort((a, b) => {
          const aIsTrunk = trunkSet.has(a.id);
          const bIsTrunk = trunkSet.has(b.id);
          if (aIsTrunk && !bIsTrunk) return -1;
          if (!aIsTrunk && bIsTrunk) return 1;
          return 0;
        });
      
      return {
        level,
        certs: certsInLevel,
      };
    })
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

      {/* Metro CSS Tree Container */}
      <div className="metro-line__tree-container" ref={containerRef}>
        {/* The dim background rail */}
        <div className="metro-line__main-rail" />
        
        {/* The solid active rail segments */}
        {activeSegments.map(seg => (
          <div 
            key={seg.id}
            className="metro-line__main-rail metro-line__main-rail--active" 
            style={{ top: seg.top, height: seg.height }} 
          />
        ))}

        <div className="metro-line__stations">
          {groupedCerts.map((group) => (
            <div key={group.level} className="metro-line__level-group">
              
              <div className="metro-line__level-marker">
                <div className="metro-line__level-badge">
                  <Badge variant={group.level.toLowerCase()}>{group.level}</Badge>
                </div>
                <div className="metro-line__level-line" />
              </div>

              <div className="metro-line__level-nodes">
                {group.certs.map((cert, idx) => {
                  const isTrunk = trunkSet.has(cert.id);
                  const isCompleted = getStatus(cert.id) === CERT_STATUS.COMPLETED;
                  
                  return (
                    <div 
                      key={cert.id} 
                      className={`metro-line__node-wrapper ${isTrunk ? 'metro-line__node-wrapper--trunk' : 'metro-line__node-wrapper--branch'}`}
                    >
                      {/* Connector for branches */}
                      {!isTrunk && (
                        <div 
                          className={`metro-line__branch-connector ${isCompleted ? 'metro-line__branch-connector--active' : ''}`} 
                        />
                      )}
                      
                      <Station
                        cert={cert}
                        pathColor={path.color}
                        onSelect={setSelectedCert}
                        index={idx}
                        isTrunk={isTrunk}
                      />
                    </div>
                  );
                })}
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
