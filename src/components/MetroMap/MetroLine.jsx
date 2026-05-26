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
      
      while (current) {
        // Find a valid next step (mandatory or recommended)
        let nextId = null;
        
        // Check mandatory prereqs first
        if (current.prerequisites && current.prerequisites.length > 0) {
          // Handle SC-100 array of arrays
          const flatPrereqs = current.prerequisites.flat();
          nextId = flatPrereqs.find(id => certsMap.has(id));
        }
        
        // Fallback to recommended prereqs
        if (!nextId && current.recommendedPrereqs && current.recommendedPrereqs.length > 0) {
          nextId = current.recommendedPrereqs.find(id => certsMap.has(id));
        }

        if (nextId) {
          chain.push(nextId);
          current = certsMap.get(nextId);
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

  // Compute prerequisite depth for each cert (how many hops from a root)
  const depthMap = useMemo(() => {
    if (!path) return new Map();
    const certsMap = new Map(path.certifications.map(c => [c.id, c]));
    const depths = new Map();

    const getDepth = (certId, visited = new Set()) => {
      if (depths.has(certId)) return depths.get(certId);
      if (visited.has(certId)) return 0;
      visited.add(certId);

      const cert = certsMap.get(certId);
      if (!cert || !cert.prerequisites || cert.prerequisites.length === 0) {
        depths.set(certId, 0);
        return 0;
      }

      const prereqDepths = cert.prerequisites
        .filter(id => certsMap.has(id))
        .map(id => getDepth(id, new Set(visited)));

      const depth = (prereqDepths.length > 0 ? Math.max(...prereqDepths) : 0) + 1;
      depths.set(certId, depth);
      return depth;
    };

    path.certifications.forEach(cert => getDepth(cert.id));
    return depths;
  }, [path]);

  // Measure segments to draw the progress rail between connected certs
  // Each segment is classified as 'active' (cert in progress/completed) or 'unlocked' (prereq done, cert not started)
  useEffect(() => {
    if (!path || !containerRef.current) return;

    const measureSegments = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const segments = [];

      path.certifications.forEach(cert => {
        const mandatory = cert.prerequisites ? cert.prerequisites.flat() : [];
        const recommended = cert.recommendedPrereqs || [];
        const allPrereqs = [...mandatory, ...recommended];
        
        if (allPrereqs.length === 0) return;

        const certStatus = getStatus(cert.id);
        const isCertActive = certStatus === CERT_STATUS.COMPLETED || certStatus === CERT_STATUS.IN_PROGRESS;
        
        // Find the completed prerequisite that we will visually connect to
        let targetPrereqId = allPrereqs.find(id => getStatus(id) === CERT_STATUS.COMPLETED);
        
        // If no completed prereq, connect to the first one available
        if (!targetPrereqId) targetPrereqId = allPrereqs[0];

        const isMandatory = mandatory.includes(targetPrereqId);
        const hasCompletedTarget = getStatus(targetPrereqId) === CERT_STATUS.COMPLETED;

        // Determine segment state
        let segmentState = 'recommended'; // Default for recommended connection
        if (isMandatory) {
          if (isCertActive) {
            segmentState = 'active';
          } else if (hasCompletedTarget) {
            segmentState = 'unlocked';
          } else {
             // Not unlocked and not active means we shouldn't draw a rail yet, unless we want to show the full map
             // Let's hide unachieved mandatory lines if they aren't unlocked
             return;
          }
        } else {
            // For recommended lines, we just draw them dotted (recommended).
            // But if the certification itself is active, we make it "active-recommended"
            segmentState = isCertActive ? 'active-recommended' : 'recommended';
        }

        const prereqEl = document.getElementById(`station-${targetPrereqId}`);
        const certEl = document.getElementById(`station-${cert.id}`);

        if (prereqEl && certEl) {
          const prereqRect = prereqEl.getBoundingClientRect();
          const certRect = certEl.getBoundingClientRect();

          // The circular node is 28px tall, its center is ~14px from the top of the station wrapper
          let y1 = (prereqRect.top - containerRect.top) + 14;
          const y2 = (certRect.top - containerRect.top) + 14;

          // If the prerequisite is a Fundamentals certification (the root), start the line from the very top
          const prereqCert = path.certifications.find(c => c.id === targetPrereqId);
          if (prereqCert && prereqCert.level === CERT_LEVELS.FUNDAMENTALS) {
            y1 = 0;
          }

          segments.push({
            id: `${targetPrereqId}-${cert.id}`,
            top: Math.min(y1, y2),
            height: Math.abs(y2 - y1),
            state: segmentState,
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
        
        {/* Progress rail segments (unlocked = dashed, active = solid) */}
        {activeSegments.map(seg => (
          <div 
            key={seg.id}
            className={`metro-line__main-rail metro-line__main-rail--${seg.state}`} 
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
                  const certStatus = getStatus(cert.id);
                  const isCompleted = certStatus === CERT_STATUS.COMPLETED;
                  const isInProgress = certStatus === CERT_STATUS.IN_PROGRESS;
                  const flatPrereqs = cert.prerequisites ? cert.prerequisites.flat() : [];
                  const recommendedPrereqs = cert.recommendedPrereqs || [];
                  const isPrereqCompleted = flatPrereqs.some(id => getStatus(id) === CERT_STATUS.COMPLETED);
                  
                  // Three states for the branch connector
                  let connectorState = '';
                  if (isCompleted || isInProgress) {
                    if (flatPrereqs.length > 0) {
                      connectorState = 'metro-line__branch-connector--active';
                    } else if (recommendedPrereqs.length > 0) {
                      connectorState = 'metro-line__branch-connector--active-recommended';
                    }
                  } else if (isPrereqCompleted) {
                    connectorState = 'metro-line__branch-connector--unlocked';
                  } else if (recommendedPrereqs.length > 0) {
                    connectorState = 'metro-line__branch-connector--recommended';
                  }

                  // Station is "unlocked" when its prereq is done but the cert itself hasn't been started
                  // If it has no mandatory prereqs, it's always unlocked
                  const isUnlocked = (flatPrereqs.length === 0 || isPrereqCompleted) && certStatus === CERT_STATUS.NOT_STARTED;
                  
                  return (
                    <div 
                      key={cert.id} 
                      className={`metro-line__node-wrapper ${isTrunk ? 'metro-line__node-wrapper--trunk' : 'metro-line__node-wrapper--branch'}`}
                    >
                      {/* Connector for branches */}
                      {!isTrunk && (
                        <div 
                          className={`metro-line__branch-connector ${connectorState}`} 
                        />
                      )}
                      
                      <Station
                        cert={cert}
                        pathColor={path.color}
                        onSelect={setSelectedCert}
                        index={idx}
                        isTrunk={isTrunk}
                        isUnlocked={isUnlocked}
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
