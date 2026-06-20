import { useParams, useNavigate } from 'react-router-dom';
import { getPathById, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import CertNode from './CertNode';

import CertDetail from '../CertDetail/CertDetail';
import ProgressRing from '../common/ProgressRing';
import { IconMap as Icons } from '../common/IconMap';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import './PathMap.css';

const LEVELS = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];
const RAIL_WIDTH = 6;
const CURVE_RADIUS = 24;

/**
 * Core visualization component that renders a certification path as a connected map.
 * Dynamically constructs the visual tree layout, SVG connecting tracks, and cert-nodes
 * based on the certifications and prerequisites defined in the path data.
 * 
 * @component
 * @returns {JSX.Element} The visual map of certifications.
 */
const PathMap = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const path = getPathById(pathId);
  const { getStatus, getPathProgress, isPathIgnored } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);

  const treeContainerRef = useRef(null);
  const gridRef = useRef(null);
  const forkSpacerRef = useRef(null);
  const [linePaths, setLinePaths] = useState([]);

  const branches = useMemo(() => path?.branches || [], [path?.branches]);
  const hasBranches = branches.length > 0 && path?.certifications.some(c => c.branch);

  // ─── Path progress for the header ───
  const pathProgress = useMemo(() => {
    if (!path) return { total: 0, completed: 0, inProgress: 0, percent: 0 };
    return getPathProgress(path.id);
  }, [path, getPathProgress]);

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

  // ─── Build the visual connection list (edges between cert-nodes) ───
  const connectionList = useMemo(() => {
    if (!path) return [];
    const connections = [];

    if (hasBranches) {
      // 1. Trunk fundamentals: chain them vertically
      const chainedFundamentals = trunkFundamentals.filter(c => !c.isIndependent);
      for (let i = 1; i < chainedFundamentals.length; i++) {
        connections.push({
          from: chainedFundamentals[i - 1].id,
          to: chainedFundamentals[i].id,
          type: 'trunk',
        });
      }

      // 2. Fork: trunk fundamentals -> first cert in each branch
      const lastTrunkFund = chainedFundamentals[chainedFundamentals.length - 1];
      if (lastTrunkFund) {
        branchColumns.forEach(branch => {
          const firstBranchCert = branch.allCerts[0];
          if (firstBranchCert && !firstBranchCert.isIndependent) {
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
        const chainedBranchCerts = branch.allCerts.filter(c => !c.isIndependent);
        for (let i = 1; i < chainedBranchCerts.length; i++) {
          connections.push({
            from: chainedBranchCerts[i - 1].id,
            to: chainedBranchCerts[i].id,
            type: 'branch',
            branchId: branch.id,
          });
        }
      });

      // 4. Merge: last cert of each branch that has Expert/Specialty trunk-bottom -> first trunk-bottom cert
      const chainedBottom = trunkBottom.filter(c => !c.isIndependent);
      if (chainedBottom.length > 0) {
        const firstBottom = chainedBottom[0];
        
        // Flatten prerequisites to handle nested arrays representing "OR" groups (e.g., [['sc-200', 'sc-300']])
        const prereqs = firstBottom.prerequisites ? firstBottom.prerequisites.flat() : [];

        branchColumns.forEach(branch => {
          const chainedBranchCerts = branch.allCerts.filter(c => !c.isIndependent);
          const lastBranchCert = chainedBranchCerts[chainedBranchCerts.length - 1];
          if (lastBranchCert) {
            // Only connect if the trunk bottom has no specific prereqs, or if this branch contains a prereq
            let shouldConnect = true;
            if (prereqs.length > 0) {
              shouldConnect = chainedBranchCerts.some(c => prereqs.includes(c.id));
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
      for (let i = 1; i < chainedBottom.length; i++) {
        connections.push({
          from: chainedBottom[i - 1].id,
          to: chainedBottom[i].id,
          type: 'trunk',
        });
      }
    } else {
      // Linear layout: chain all certs in order of level groups
      const orderedCerts = linearGroups.flatMap(g => g.certs).filter(c => !c.isIndependent);
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

  // ─── Measure all cert-node node positions and draw SVG paths ───
  const measureAndDrawLines = useCallback(() => {
    const container = treeContainerRef.current;
    if (!container || !path) return;

    const containerRect = container.getBoundingClientRect();
    const computedStyle = getComputedStyle(container);
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
    const offsetTop = containerRect.top + borderTop;
    const offsetLeft = containerRect.left + borderLeft;

    // Measure the center of every cert-node node
    const getNodeCenter = (certId) => {
      const nodeEl = container.querySelector(`#cert-node-${certId} .cert-node__info`);
      if (!nodeEl) return null;
      const r = nodeEl.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - offsetLeft,
        y: r.top + r.height / 2 - offsetTop,
        topY: r.top - offsetTop,
        bottomY: r.bottom - offsetTop,
      };
    };

    // Find the absolute bottom of the grid so merge lines always draw BELOW all branch nodes
    let gridBottomY = null;
    if (gridRef.current) {
      const gridRect = gridRef.current.getBoundingClientRect();
      gridBottomY = gridRect.bottom - offsetTop;
    }

    // Find the middle of the fork spacer so fork lines draw cleanly inside the gap
    let forkMidY = null;
    if (forkSpacerRef.current) {
      const forkRect = forkSpacerRef.current.getBoundingClientRect();
      forkMidY = forkRect.top - offsetTop + forkRect.height / 2;
    }

    const paths = [];

    // Pre-calculate consistent midY for merges so they form a single horizontal bus
    const mergeMidYs = {};
    connectionList.forEach(conn => {
      if (conn.type === 'merge') {
        const fromPt = getNodeCenter(conn.from);
        const toPt = getNodeCenter(conn.to);
        if (!fromPt || !toPt) return;
        
        fromPt.y = fromPt.bottomY;
        toPt.y = toPt.topY;

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
      
      fromPt.y = fromPt.bottomY;
      toPt.y = toPt.topY;

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
        } else if (conn.type === 'fork' && forkMidY !== null) {
          midY = forkMidY;
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

    setLinePaths(paths);
  }, [connectionList, path, getStatus, setLinePaths]);

  useEffect(() => {
    const container = treeContainerRef.current;
    if (!container) return;

    // Delay initial measurement to let cert-node animations (400ms) settle
    const timer = setTimeout(() => {
      measureAndDrawLines();
    }, 500);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measureAndDrawLines);
    });
    observer.observe(container);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [measureAndDrawLines]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !selectedCert) {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert, navigate]);

  // ─── Error state ───
  if (!path) {
    return (
      <div className="path-map__not-found">
        <Icons.MapPinOff size={48} />
        <h2>Path not found</h2>
        <p>The certification path you're looking for doesn't exist.</p>
      </div>
    );
  }

  // ─── Helpers ───
  const renderCertNode = (cert, idx) => {
    const certStatus = getStatus(cert.id);
    const flatPrereqs = cert.prerequisites ? cert.prerequisites.flat() : [];
    const isPrereqCompleted = flatPrereqs.some(id => getStatus(id) === CERT_STATUS.COMPLETED);
    const isUnlocked = (flatPrereqs.length === 0 || isPrereqCompleted) && certStatus === CERT_STATUS.NOT_STARTED;
    return (
      <CertNode
        key={cert.id}
        cert={cert}
        pathColor={path.color}
        onSelect={setSelectedCert}
        index={idx}
        isTrunk={!cert.branch}
        isUnlocked={isUnlocked}
        isPathIgnored={isPathIgnored(path.id)}
        hideNode={path.id === 'retired-exams'}
      />
    );
  };

  const trunkBottomGroups = [CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY]
    .map(level => ({ level, certs: trunkBottom.filter(c => c.level === level) }))
    .filter(g => g.certs.length > 0);

  // ─── Track SVG Overlay ───
  const renderLineSVG = () => {
    if (linePaths.length === 0) return null;

    return (
      <svg
        className="path-map__line-svg"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          overflow: 'visible',
          zIndex: 1,
        }}
      >
        {/* Background (default) tracks first */}
        <g opacity={0.12}>
          {linePaths.map(tp => (
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
          {linePaths
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
          {linePaths
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
              />
            ))}
        </g>
      </svg>
    );
  };

  const PathIcon = Icons[path.icon] || Icons.Circle;

  return (
    <div className="path-map" style={{ '--path-color': path.color, '--path-glow': path.glowColor }}>

      {/* ─── Path Header ─── */}
      <div className="path-map__header">
        <div className="path-map__header-icon">
          <PathIcon size={28} />
        </div>
        <div className="path-map__header-info">
          <h1 className="path-map__header-title">{path.name}</h1>
          <p className="path-map__header-desc">{path.description}</p>
        </div>
        <div className="path-map__header-stats">
          <div className="path-map__header-progress">
            <ProgressRing percent={pathProgress.percent} size={48} strokeWidth={4} color={path.color} />
          </div>
          <div className="path-map__header-counts">
            <span className="path-map__header-stat">
              <Icons.CheckCircle2 size={14} />
              <strong>{pathProgress.completed}</strong> completed
            </span>
            <span className="path-map__header-stat">
              <Icons.Clock size={14} />
              <strong>{pathProgress.inProgress}</strong> active
            </span>
            <span className="path-map__header-stat">
              <Icons.Circle size={14} />
              <strong>{pathProgress.total - pathProgress.completed - pathProgress.inProgress}</strong> remaining
            </span>
          </div>
        </div>
      </div>

      {/* ─── Map Viewport ─── */}
      <div className="path-map__viewport">
        {/* ─── Tree Container ─── */}
        <div 
          className="path-map__tree-container" 
          ref={treeContainerRef}
          style={hasBranches ? { '--branch-count': branchColumns.length || 1 } : undefined}
        >
          {/* Single SVG overlay for ALL track lines */}
          {renderLineSVG()}

          {hasBranches ? (
            <>
              {/* ── Trunk Top: Fundamentals ── */}
              {trunkFundamentals.length > 0 && (() => {
                const chainedFunds = trunkFundamentals.filter(c => !c.isIndependent);
                const independentFunds = trunkFundamentals.filter(c => c.isIndependent);
                const hasIndependent = independentFunds.length > 0;

                return (
                  <div className={`path-map__trunk-top${hasIndependent ? ' path-map__trunk-top--row' : ''}`}>
                    <div className="path-map__trunk-nodes">
                      {chainedFunds.map((cert, idx) => (
                        <div key={cert.id} className="path-map__trunk-node-wrap">
                          {renderCertNode(cert, idx)}
                        </div>
                      ))}
                    </div>
                    {hasIndependent && independentFunds.map((cert, idx) => (
                      <div key={cert.id} className="path-map__trunk-node-wrap path-map__trunk-node-wrap--independent">
                        {renderCertNode(cert, chainedFunds.length + idx)}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* ── Spacer for fork zone ── */}
              {trunkFundamentals.length > 0 && (
                <div className="path-map__fork-spacer" ref={forkSpacerRef} />
              )}

              {/* ── Branch Columns ── */}
              <div className="path-map__branches-scroll">
                <div
                  className="path-map__branches-grid"
                  ref={gridRef}
                  style={{ gridTemplateColumns: path.id === 'retired-exams' ? '1fr' : `repeat(${branchColumns.length}, minmax(160px, 1fr))` }}
                >
                  {branchColumns.map(branch => {
                    return (
                      <div key={branch.id} className="path-map__branch-column" id={`branch-col-${branch.id}`} style={path.id === 'retired-exams' ? { width: '100%' } : {}}>
                        <div className="path-map__branch-column-header">
                          <div className="path-map__branch-column-header-title">
                            {path.id !== 'retired-exams' && <Icons.GitBranch size={14} />}
                            <span>{branch.name}</span>
                          </div>
                          {branch.description && (
                            <div className="path-map__branch-column-header-desc">
                              {branch.description}
                            </div>
                          )}
                        </div>
                        <div style={path.id === 'retired-exams' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)', width: '100%', marginTop: 'var(--space-4)' } : { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                          {branch.allCerts.map((cert, idx) => (
                            <div key={cert.id} className="path-map__branch-node">
                              {renderCertNode(cert, idx)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Spacer for merge zone ── */}
              {trunkBottom.length > 0 && (
                <div className="path-map__merge-spacer" />
              )}

              {/* ── Trunk Bottom (Expert/Specialty) ── */}
              {trunkBottom.length > 0 && (
                <div className="path-map__trunk-bottom">
                  {trunkBottomGroups.map(group => (
                    <div key={group.level} className="path-map__trunk-level-group">
                      <div className="path-map__trunk-nodes">
                        {group.certs.map((cert, idx) => (
                          <div key={cert.id} className="path-map__trunk-node-wrap">
                            {renderCertNode(cert, idx)}
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
            <div className="path-map__cert-nodes">
              {linearGroups.map(group => (
                <div key={group.level} className="path-map__level-group">
                  <div className="path-map__level-nodes">
                    {group.certs.map((cert, idx) => (
                      <div key={cert.id} className="path-map__node-wrapper path-map__node-wrapper--trunk">
                        {renderCertNode(cert, idx)}
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

export default PathMap;
