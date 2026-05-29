import { certificationPaths, CERT_STATUS, CERT_LEVELS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import CertDetail from '../CertDetail/CertDetail';
import './MetroOverview.css';

// ─── Layout engine ───────────────────────────────────────────────
// Renders each path as a horizontal swim-lane. Within each lane:
//   - Fundamentals on the left
//   - Associates in the middle  
//   - Expert/Specialty on the right
//   - Main progression trunk is a straight horizontal line
//   - Branches split off vertically from their prerequisite node

const NODE_W = 240;    // horizontal spacing between tiers
const NODE_H = 96;     // vertical spacing between rows in a tier
const LANE_PAD_X = 60; // left padding inside each lane
const LANE_PAD_Y = 46; // top padding inside each lane (below header)

/**
 * Builds a tree-like layout for a single certification path.
 * Returns an array of { cert, x, y } positioned nodes and
 * an array of { from, to } connection lines.
 */
const buildPathLayout = (path) => {
  const certs = path.certifications;
  const branches = path.branches || [];

  // Group certs by level
  const tiers = {
    [CERT_LEVELS.FUNDAMENTALS]: [],
    [CERT_LEVELS.ASSOCIATE]: [],
    [CERT_LEVELS.EXPERT]: [],
    [CERT_LEVELS.SPECIALTY]: [],
  };
  certs.forEach(c => {
    if (tiers[c.level]) tiers[c.level].push(c);
  });

  // Tier X positions (left to right)
  const tierX = {
    [CERT_LEVELS.FUNDAMENTALS]: LANE_PAD_X,
    [CERT_LEVELS.ASSOCIATE]: LANE_PAD_X + NODE_W,
    [CERT_LEVELS.EXPERT]: LANE_PAD_X + NODE_W * 2,
    [CERT_LEVELS.SPECIALTY]: LANE_PAD_X + NODE_W * 2.8,
  };

  // Build the positioned nodes
  const nodes = [];
  const nodePositions = {};

  // Place tiers — trunk certs first (no branch), then grouped by branch order
  const tierOrder = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];

  tierOrder.forEach(level => {
    const tierCerts = tiers[level];
    if (!tierCerts || tierCerts.length === 0) return;

    const x = tierX[level];

    // Separate trunk certs (no branch) from branch certs
    const trunkCerts = tierCerts.filter(c => !c.branch);
    
    // Order branch certs by branch definition order
    const orderedBranchCerts = [];
    branches.forEach(branchDef => {
      tierCerts
        .filter(c => c.branch === branchDef.id)
        .forEach(c => orderedBranchCerts.push(c));
    });
    
    // Fallback: any branch certs whose branch isn't in the definition
    tierCerts
      .filter(c => c.branch && !branches.some(b => b.id === c.branch))
      .forEach(c => orderedBranchCerts.push(c));

    // Place trunk certs first, then branch certs
    const sortedCerts = [...trunkCerts, ...orderedBranchCerts];
    
    sortedCerts.forEach((cert, row) => {
      const isTrunk = !cert.branch;
      const y = LANE_PAD_Y + row * NODE_H;
      nodes.push({ cert, x, y, isTrunk });
      nodePositions[cert.id] = { x, y };
    });
  });

  // Build connections based on prerequisites
  // Note: We use .flat() because prerequisites can contain nested arrays 
  // representing 'OR' logic (e.g. [['sc-200', 'sc-300']] means requires ONE of them).
  // The layout engine draws connection lines from ALL potential prerequisites.
  const connections = [];
  certs.forEach(cert => {
    (cert.prerequisites || []).flat().forEach(prereqId => {
      // Only connect if both are in this path's positioned nodes
      if (nodePositions[prereqId] && nodePositions[cert.id]) {
        connections.push({
          fromId: prereqId,
          toId: cert.id,
          from: nodePositions[prereqId],
          to: nodePositions[cert.id],
        });
      }
    });
  });

  // Calculate lane height
  const maxY = nodes.reduce((max, n) => Math.max(max, n.y), 0);
  const laneHeight = maxY + NODE_H + 10;

  return { nodes, connections, laneHeight };
};

/**
 * Generate an SVG path for a connection.
 * Uses a smooth cubic bezier curve (S-curve) for better aesthetics
 * and consistent metro-line feel.
 */
const connectionPath = (from, to) => {
  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;

  // Straight horizontal
  if (Math.abs(y1 - y2) < 2) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  // Straight vertical
  if (Math.abs(x1 - x2) < 2) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  // Right-angle with rounded corners
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const r = Math.min(10, dx / 3, dy / 3);
  const dirX = x2 > x1 ? 1 : -1;
  const dirY = y2 > y1 ? 1 : -1;

  // Go horizontal first, then vertical
  return `M ${x1} ${y1} `
    + `L ${x2 - dirX * r} ${y1} `
    + `Q ${x2} ${y1}, ${x2} ${y1 + dirY * r} `
    + `L ${x2} ${y2}`;
};


// ─── Component ───────────────────────────────────────────────────

const MetroOverview = () => {
  const { getStatus } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  // Precompute layouts for all paths
  const pathLayouts = useMemo(() => {
    return certificationPaths.map(path => ({
      path,
      ...buildPathLayout(path),
    }));
  }, []);

  const handleStationClick = (cert, path) => {
    setSelectedCert(cert);
    setSelectedPath(path);
  };

  return (
    <div className="metro-overview">
      <div className="metro-overview__header">
        <h1 className="metro-overview__title">
          <Icons.Map size={28} />
          Metro Map
        </h1>
        <p className="metro-overview__subtitle">
          Explore Microsoft certification paths. Each lane shows a progression from fundamentals → associate → expert.
        </p>
      </div>

      <div className="metro-overview__lanes-wrapper">
        {pathLayouts.map(({ path, nodes, connections, laneHeight }) => {
          const Icon = Icons[path.icon] || Icons.Circle;
          const canvasWidth = LANE_PAD_X + NODE_W * 3.2 + 40;

          return (
            <div
              key={path.id}
              className="metro-overview__lane"
              style={{ '--lane-color': path.color }}
            >
              {/* Lane header */}
              <div className="metro-overview__lane-header">
                <div className="metro-overview__lane-icon">
                  <Icon size={16} />
                </div>
                <span className="metro-overview__lane-name">{path.name}</span>
                <div className="metro-overview__lane-divider" />
              </div>

              {/* Lane canvas */}
              <div className="metro-overview__lane-canvas" style={{ height: laneHeight }}>
                {/* SVG connections */}
                <svg
                  className="metro-overview__svg-layer"
                  width={canvasWidth}
                  height={laneHeight}
                >
                  {/* Background tracks (default) */}
                  <g opacity={0.12}>
                    {connections.map(conn => (
                      <path
                        key={`${conn.fromId}-${conn.toId}-bg`}
                        d={connectionPath(conn.from, conn.to)}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    ))}
                  </g>

                  {/* Foreground tracks (progress-based) - Unlocked */}
                  <g opacity={0.4}>
                    {connections.filter(conn => {
                      const fromStatus = getStatus(conn.fromId);
                      const toStatus = getStatus(conn.toId);
                      const fromCompleted = fromStatus === CERT_STATUS.COMPLETED;
                      const toActive = toStatus === CERT_STATUS.COMPLETED || toStatus === CERT_STATUS.IN_PROGRESS;
                      return fromCompleted && !toActive; // strictly 'unlocked'
                    }).map(conn => (
                      <path
                        key={`${conn.fromId}-${conn.toId}-unlocked`}
                        d={connectionPath(conn.from, conn.to)}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="metro-overview__track-line"
                      />
                    ))}
                  </g>

                  {/* Foreground tracks (progress-based) - Active */}
                  <g opacity={1}>
                    {connections.filter(conn => {
                      const fromStatus = getStatus(conn.fromId);
                      const toStatus = getStatus(conn.toId);
                      const fromCompleted = fromStatus === CERT_STATUS.COMPLETED;
                      const toActive = toStatus === CERT_STATUS.COMPLETED || toStatus === CERT_STATUS.IN_PROGRESS;
                      return fromCompleted && toActive; // strictly 'active'
                    }).map(conn => (
                      <path
                        key={`${conn.fromId}-${conn.toId}-active`}
                        d={connectionPath(conn.from, conn.to)}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="metro-overview__track-line"
                      />
                    ))}
                  </g>
                  {/* Main trunk line (horizontal at y = LANE_PAD_Y) */}
                  <line
                    x1={LANE_PAD_X - 20}
                    y1={LANE_PAD_Y}
                    x2={canvasWidth - 40}
                    y2={LANE_PAD_Y}
                    stroke={path.color}
                    strokeWidth="2"
                    strokeOpacity="0.08"
                    strokeDasharray="4 6"
                  />
                </svg>

                {/* Station nodes */}
                {nodes.map(({ cert, x, y, isTrunk }) => {
                  const status = getStatus(cert.id);
                  const isInterchange = cert.isInterchange;

                  return (
                    <div
                      key={cert.id}
                      className={`metro-overview__station metro-overview__station--${status} ${
                        isInterchange ? 'metro-overview__station--interchange' : ''
                      } ${isTrunk ? 'metro-overview__station--trunk' : 'metro-overview__station--branch'}`}
                      style={{
                        left: x,
                        top: y,
                        '--station-color': path.color,
                      }}
                      onClick={() => handleStationClick(cert, path)}
                      title={`${cert.examCode} — ${cert.name}`}
                    >
                      <div className="metro-overview__node-outer">
                        <div className="metro-overview__node-inner">
                          {status === CERT_STATUS.COMPLETED && <Icons.Check size={10} strokeWidth={3} />}
                        </div>
                        {status === CERT_STATUS.IN_PROGRESS && <div className="metro-overview__node-half" />}
                      </div>

                      <div className="metro-overview__label">
                        <span className="metro-overview__label-code">{cert.examCode}</span>
                        <span className="metro-overview__label-name">{cert.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selectedCert && selectedPath && (
        <CertDetail
          cert={selectedCert}
          path={selectedPath}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default MetroOverview;
