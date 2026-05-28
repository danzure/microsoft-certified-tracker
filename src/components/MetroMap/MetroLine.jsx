import { useParams } from 'react-router-dom';
import { getPathById, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Station from './Station';
import ProgressRing from '../common/ProgressRing';

import CertDetail from '../CertDetail/CertDetail';
import * as Icons from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import './MetroLine.css';

const LEVELS = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];
const RAIL_WIDTH = 6;
const CURVE_RADIUS = 24;

const MetroLine = () => {
  const { pathId } = useParams();
  const path = getPathById(pathId);
  const { getPathProgress, getStatus } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);

  const treeContainerRef = useRef(null);
  const gridRef = useRef(null);
  const [trackPaths, setTrackPaths] = useState([]);

  const branches = useMemo(() => path?.branches || [], [path?.branches]);
  const hasBranches = branches.length > 0 && path?.certifications.some(c => c.branch);

  // ─── Computed data for tree layout ───
  const { trunkFundamentals, trunkBottom, branchColumns } = useMemo(() => {
    if (!path || !hasBranches) return { trunkFundamentals: [], trunkBottom: [], branchColumns: [] };

    const trunkCerts = path.certifications.filter(c => !c.branch);
    const trunkFundamentals = trunkCerts.filter(c => c.level === CERT_LEVELS.FUNDAMENTALS);
    const trunkBottom = trunkCerts.filter(c => c.level !== CERT_LEVELS.FUNDAMENTALS);

    const branchColumns = branches.map(branchDef => {
      const certs = path.certifications.filter(c => c.branch === branchDef.id);
      const grouped = LEVELS
        .map(level => ({ level, certs: certs.filter(c => c.level === level) }))
        .filter(g => g.certs.length > 0);
      return { ...branchDef, groups: grouped, allCerts: certs };
    }).filter(b => b.allCerts.length > 0);

    return { trunkFundamentals, trunkBottom, branchColumns };
  }, [path, hasBranches, branches]);

  // ─── Computed data for linear layout ───
  const linearGroups = useMemo(() => {
    if (!path || hasBranches) return [];
    return LEVELS
      .map(level => ({ level, certs: path.certifications.filter(c => c.level === level) }))
      .filter(g => g.certs.length > 0);
  }, [path, hasBranches]);

  // ─── Build the visual connection list (edges between stations) ───
  const connectionList = useMemo(() => {
    if (!path) return [];
    const connections = [];

    if (hasBranches) {
      // 1. Trunk fundamentals: chain them vertically
      for (let i = 1; i < trunkFundamentals.length; i++) {
        connections.push({
          from: trunkFundamentals[i - 1].id,
          to: trunkFundamentals[i].id,
          type: 'trunk',
        });
      }

      // 2. Fork: trunk fundamentals -> first cert in each branch
      const lastTrunkFund = trunkFundamentals[trunkFundamentals.length - 1];
      if (lastTrunkFund) {
        branchColumns.forEach(branch => {
          const firstBranchCert = branch.allCerts[0];
          if (firstBranchCert) {
            connections.push({
              from: lastTrunkFund.id,
              to: firstBranchCert.id,
              type: 'fork',
              branchId: branch.id,
            });
          }
        });
      }

      // 3. Within each branch: chain certs vertically
      branchColumns.forEach(branch => {
        for (let i = 1; i < branch.allCerts.length; i++) {
          connections.push({
            from: branch.allCerts[i - 1].id,
            to: branch.allCerts[i].id,
            type: 'branch',
            branchId: branch.id,
          });
        }
      });

      // 4. Merge: last cert of each branch that has Expert/Specialty trunk-bottom -> first trunk-bottom cert
      if (trunkBottom.length > 0) {
        const firstBottom = trunkBottom[0];
        
        // Flatten prerequisites to handle nested arrays representing "OR" groups (e.g., [['sc-200', 'sc-300']])
        const prereqs = firstBottom.prerequisites ? firstBottom.prerequisites.flat() : [];

        branchColumns.forEach(branch => {
          const lastBranchCert = branch.allCerts[branch.allCerts.length - 1];
          if (lastBranchCert) {
            // Only connect if the trunk bottom has no specific prereqs, or if this branch contains a prereq
            let shouldConnect = true;
            if (prereqs.length > 0) {
              shouldConnect = branch.allCerts.some(c => prereqs.includes(c.id));
            }

            if (shouldConnect) {
              connections.push({
                from: lastBranchCert.id,
                to: firstBottom.id,
                type: 'merge',
                branchId: branch.id,
              });
            }
          }
        });
      }

      // 5. Trunk bottom: chain the expert/specialty certs
      for (let i = 1; i < trunkBottom.length; i++) {
        connections.push({
          from: trunkBottom[i - 1].id,
          to: trunkBottom[i].id,
          type: 'trunk',
        });
      }
    } else {
      // Linear layout: chain all certs in order of level groups
      const orderedCerts = linearGroups.flatMap(g => g.certs);
      for (let i = 1; i < orderedCerts.length; i++) {
        connections.push({
          from: orderedCerts[i - 1].id,
          to: orderedCerts[i].id,
          type: 'linear',
        });
      }
    }

    return connections;
  }, [path, hasBranches, trunkFundamentals, trunkBottom, branchColumns, linearGroups]);

  // ─── Measure all station node positions and draw SVG paths ───
  const measureAndDrawTracks = useCallback(() => {
    const container = treeContainerRef.current;
    if (!container || !path) return;

    const containerRect = container.getBoundingClientRect();
    const computedStyle = getComputedStyle(container);
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
    const offsetTop = containerRect.top + borderTop;
    const offsetLeft = containerRect.left + borderLeft;

    // Measure the center of every station node
    const getNodeCenter = (certId) => {
      const nodeEl = container.querySelector(`#station-${certId} .station__node-outer`);
      if (!nodeEl) return null;
      const r = nodeEl.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - offsetLeft,
        y: r.top + r.height / 2 - offsetTop,
      };
    };

    // Find the absolute bottom of the grid so merge lines always draw BELOW all branch nodes
    let gridBottomY = null;
    if (gridRef.current) {
      const gridRect = gridRef.current.getBoundingClientRect();
      gridBottomY = gridRect.bottom - offsetTop;
    }

    const paths = [];

    // Pre-calculate consistent midY for merges so they form a single horizontal bus
    const mergeMidYs = {};
    connectionList.forEach(conn => {
      if (conn.type === 'merge') {
        const fromPt = getNodeCenter(conn.from);
        const toPt = getNodeCenter(conn.to);
        if (!fromPt || !toPt) return;

        if (!mergeMidYs[conn.to]) {
          mergeMidYs[conn.to] = { maxFromY: fromPt.y, toY: toPt.y };
        } else if (fromPt.y > mergeMidYs[conn.to].maxFromY) {
          mergeMidYs[conn.to].maxFromY = fromPt.y;
        }
      }
    });

    connectionList.forEach(conn => {
      const fromPt = getNodeCenter(conn.from);
      const toPt = getNodeCenter(conn.to);
      if (!fromPt || !toPt) return;

      let d;
      const dx = Math.abs(toPt.x - fromPt.x);
      const dy = Math.abs(toPt.y - fromPt.y);

      if (dx < 2) {
        // Straight vertical line
        d = `M ${fromPt.x} ${fromPt.y} L ${toPt.x} ${toPt.y}`;
      } else {
        // Curved connection (fork or merge)
        const r = Math.min(CURVE_RADIUS, dx / 2, dy / 2);
        const dirX = toPt.x > fromPt.x ? 1 : -1;
        const dirY = toPt.y > fromPt.y ? 1 : -1;

        // midY = halfway between them vertically, but use consistent midY for merges
        let midY = fromPt.y + (toPt.y - fromPt.y) / 2;
        if (conn.type === 'merge' && mergeMidYs[conn.to]) {
          if (gridBottomY !== null && toPt.y > gridBottomY) {
            // Draw horizontal line exactly halfway between the bottom of the grid and the target trunk node
            // This guarantees it will safely pass underneath all branch cards, regardless of varying column heights
            midY = gridBottomY + (toPt.y - gridBottomY) / 2;
          } else {
            const { maxFromY, toY } = mergeMidYs[conn.to];
            midY = maxFromY + (toY - maxFromY) / 2;
          }
        }

        // Path: go vertical from start to midY, then curve horizontal, then curve vertical down to end
        const t1Y = midY - dirY * r;
        const sweep1 = (dirX === 1 && dirY === 1) ? 0 :
                        (dirX === -1 && dirY === 1) ? 1 :
                        (dirX === 1 && dirY === -1) ? 1 : 0;
        const corner1X = fromPt.x + dirX * r;

        const t2X = toPt.x - dirX * r;
        const sweep2 = (dirX === 1 && dirY === 1) ? 1 :
                        (dirX === -1 && dirY === 1) ? 0 :
                        (dirX === 1 && dirY === -1) ? 0 : 1;
        const corner2Y = midY + dirY * r;

        d = [
          `M ${fromPt.x} ${fromPt.y}`,
          `L ${fromPt.x} ${t1Y}`,
          `A ${r} ${r} 0 0 ${sweep1} ${corner1X} ${midY}`,
          `L ${t2X} ${midY}`,
          `A ${r} ${r} 0 0 ${sweep2} ${toPt.x} ${corner2Y}`,
          `L ${toPt.x} ${toPt.y}`,
        ].join(' ');
      }

      // Determine visual state based on progress
      const fromStatus = getStatus(conn.from);
      const toStatus = getStatus(conn.to);
      const fromCompleted = fromStatus === CERT_STATUS.COMPLETED;
      const toActive = toStatus === CERT_STATUS.COMPLETED || toStatus === CERT_STATUS.IN_PROGRESS;

      let state = 'default'; // faint background track
      if (fromCompleted && toActive) {
        state = 'active';
      } else if (fromCompleted) {
        state = 'unlocked';
      }

      paths.push({ id: `${conn.from}-${conn.to}`, d, state, type: conn.type });
    });

    setTrackPaths(paths);
  }, [connectionList, path, getStatus, setTrackPaths]);

  useEffect(() => {
    const container = treeContainerRef.current;
    if (!container) return;

    // Delay initial measurement to let station animations (400ms) settle
    const timer = setTimeout(() => {
      measureAndDrawTracks();
    }, 500);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measureAndDrawTracks);
    });
    observer.observe(container);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [measureAndDrawTracks]);

  // ─── Error state ───
  if (!path) {
    return (
      <div className="metro-line__not-found">
        <Icons.MapPinOff size={48} />
        <h2>Path not found</h2>
        <p>The certification path you're looking for doesn't exist.</p>
      </div>
    );
  }

  // ─── Helpers ───
  const prog = getPathProgress(path.id);
  const PathIcon = Icons[path.icon] || Icons.Circle;

  const renderStation = (cert, idx) => {
    const certStatus = getStatus(cert.id);
    const flatPrereqs = cert.prerequisites ? cert.prerequisites.flat() : [];
    const isPrereqCompleted = flatPrereqs.some(id => getStatus(id) === CERT_STATUS.COMPLETED);
    const isUnlocked = (flatPrereqs.length === 0 || isPrereqCompleted) && certStatus === CERT_STATUS.NOT_STARTED;
    return (
      <Station
        key={cert.id}
        cert={cert}
        pathColor={path.color}
        onSelect={setSelectedCert}
        index={idx}
        isTrunk={!cert.branch}
        isUnlocked={isUnlocked}
      />
    );
  };

  const trunkBottomGroups = [CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY]
    .map(level => ({ level, certs: trunkBottom.filter(c => c.level === level) }))
    .filter(g => g.certs.length > 0);

  // ─── Track SVG Overlay ───
  const renderTrackSVG = () => {
    if (trackPaths.length === 0) return null;

    return (
      <svg
        className="metro-line__track-svg"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          overflow: 'visible',
          zIndex: 5,
        }}
      >
        {/* Background (default) tracks first */}
        <g opacity={0.12}>
          {trackPaths.map(tp => (
            <path
              key={`bg-${tp.id}`}
              d={tp.d}
              fill="none"
              stroke={path.color}
              strokeWidth={RAIL_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
        {/* Unlocked overlay tracks */}
        <g opacity={0.4}>
          {trackPaths
            .filter(tp => tp.state === 'unlocked')
            .map(tp => (
              <path
                key={`fg-${tp.id}-unlocked`}
                d={tp.d}
                fill="none"
                stroke={path.color}
                strokeWidth={RAIL_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
        </g>
        {/* Active overlay tracks */}
        <g opacity={1}>
          {trackPaths
            .filter(tp => tp.state === 'active')
            .map(tp => (
              <path
                key={`fg-${tp.id}-active`}
                d={tp.d}
                fill="none"
                stroke={path.color}
                strokeWidth={RAIL_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${path.glowColor})` }}
              />
            ))}
        </g>
      </svg>
    );
  };

  return (
    <div className="metro-line" style={{ '--path-color': path.color, '--path-glow': path.glowColor }}>
      {/* ─── Path Header ─── */}
      <div className="metro-line__header" id={`path-header-${path.id}`}>
        <div className="metro-line__header-left">
          <div className="metro-line__icon-wrapper">
            <PathIcon size={28} />
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

      {/* ─── Map Viewport ─── */}
      <div className="metro-line__map-viewport">
        {/* ─── Tree Container ─── */}
        <div 
          className="metro-line__tree-container" 
          ref={treeContainerRef}
          style={hasBranches ? { '--branch-count': branchColumns.length || 1 } : undefined}
        >
          {/* Single SVG overlay for ALL track lines */}
          {renderTrackSVG()}

          {hasBranches ? (
            <>
              {/* ── Trunk Top: Fundamentals ── */}
              {trunkFundamentals.length > 0 && (
                <div className="metro-line__trunk-top">
                  <div className="metro-line__trunk-stations">
                    {trunkFundamentals.map((cert, idx) => (
                      <div key={cert.id} className="metro-line__trunk-station-wrap">
                        {renderStation(cert, idx)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Spacer for fork zone ── */}
              {trunkFundamentals.length > 0 && (
                <div className="metro-line__fork-spacer" />
              )}

              {/* ── Branch Columns ── */}
              <div className="metro-line__branches-scroll">
                <div
                  className="metro-line__branches-grid"
                  ref={gridRef}
                  style={{ gridTemplateColumns: `repeat(${branchColumns.length}, minmax(160px, 1fr))` }}
                >
                  {branchColumns.map(branch => {
                    return (
                      <div key={branch.id} className="metro-line__branch-column" id={`branch-col-${branch.id}`}>
                        <div className="metro-line__branch-column-header">
                          <Icons.GitBranch size={11} />
                          <span>{branch.name}</span>
                        </div>
                        {branch.allCerts.map((cert, idx) => (
                          <div key={cert.id} className="metro-line__branch-station">
                            {renderStation(cert, idx)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Spacer for merge zone ── */}
              {trunkBottom.length > 0 && (
                <div className="metro-line__merge-spacer" />
              )}

              {/* ── Trunk Bottom (Expert/Specialty) ── */}
              {trunkBottom.length > 0 && (
                <div className="metro-line__trunk-bottom">
                  {trunkBottomGroups.map(group => (
                    <div key={group.level} className="metro-line__trunk-level-group">
                      <div className="metro-line__trunk-stations">
                        {group.certs.map((cert, idx) => (
                          <div key={cert.id} className="metro-line__trunk-station-wrap">
                            {renderStation(cert, idx)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ─── Linear Layout (no branches, e.g. DevOps) ─── */
            <div className="metro-line__stations">
              {linearGroups.map(group => (
                <div key={group.level} className="metro-line__level-group">
                  <div className="metro-line__level-nodes">
                    {group.certs.map((cert, idx) => (
                      <div key={cert.id} className="metro-line__node-wrapper metro-line__node-wrapper--trunk">
                        {renderStation(cert, idx)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Detail Panel ─── */}
      {selectedCert && (
        <CertDetail cert={selectedCert} path={path} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
};

export default MetroLine;
