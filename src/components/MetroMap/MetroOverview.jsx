import { certificationPaths, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import CertDetail from '../CertDetail/CertDetail';
import './MetroOverview.css';

const mapCoords = {
  // M365 (Orange)
  'ms-900': { x: 150, y: 120 },
  'ms-102': { x: 450, y: 120 },
  'ms-721': { x: 450, y: 180 },
  'md-102': { x: 750, y: 60 },
  'ms-700': { x: 750, y: 180 },

  // Azure (Blue) & DevOps (Amber)
  'az-900': { x: 150, y: 300 },
  'az-204': { x: 450, y: 240 },
  'az-104': { x: 450, y: 300 },
  'az-700': { x: 750, y: 220 },
  'az-800': { x: 750, y: 300 },
  'az-305': { x: 1050, y: 300 },
  'az-400': { x: 750, y: 380 },
  'az-120': { x: 750, y: 440 },
  'az-140': { x: 750, y: 500 },

  // AI & ML (Violet)
  'ai-901': { x: 150, y: 600 },
  'ai-101': { x: 450, y: 540 },
  'ai-102': { x: 450, y: 600 },
  'ai-200': { x: 450, y: 660 },
  'ai-103': { x: 450, y: 720 },
  'ai-300': { x: 750, y: 660 },

  // Data (Emerald)
  'dp-900': { x: 150, y: 900 },
  'dp-300': { x: 450, y: 840 },
  'dp-600': { x: 450, y: 900 },
  'dp-203': { x: 450, y: 960 },
  'dp-750': { x: 750, y: 900 },
  'dp-800': { x: 750, y: 960 },
  'dp-420': { x: 750, y: 1020 },

  // Security (Crimson)
  'sc-900': { x: 150, y: 1200 },
  'az-500': { x: 450, y: 1140 },
  'sc-200': { x: 450, y: 1200 },
  'sc-300': { x: 450, y: 1260 },
  'sc-401': { x: 450, y: 1320 },
  'sc-500': { x: 450, y: 1380 },
  'sc-730': { x: 450, y: 1440 },
  'sc-100': { x: 750, y: 1380 },
  'sc-710': { x: 750, y: 1200 },

  // Power Platform (Purple)
  'pl-900': { x: 150, y: 1620 },
  'pl-400': { x: 450, y: 1560 },
  'pl-500': { x: 450, y: 1620 },
  'pl-200': { x: 450, y: 1680 },
  'pl-300': { x: 450, y: 1740 },
  'pl-600': { x: 750, y: 1680 },

  // Dynamics (Teal)
  'ab-900': { x: 150, y: 2160 },
  'mb-800': { x: 450, y: 1800 },
  'mb-820': { x: 750, y: 1800 },
  'mb-210': { x: 450, y: 1860 },
  'mb-230': { x: 450, y: 1920 },
  'mb-240': { x: 450, y: 1980 },
  'mb-260': { x: 450, y: 2040 },
  'ab-210': { x: 450, y: 2100 },
  'ab-700': { x: 450, y: 2160 },
  'mb-300': { x: 450, y: 2220 },
  'mb-500': { x: 750, y: 2160 },
  'mb-310': { x: 750, y: 2220 },
  'mb-700': { x: 1050, y: 2220 },
  'mb-330': { x: 750, y: 2280 },
  'mb-335': { x: 1050, y: 2280 },
  'ab-410': { x: 450, y: 2340 },
  'ab-701': { x: 450, y: 2400 },
  'ab-250': { x: 450, y: 2460 },
  'ab-100': { x: 750, y: 2340 },

  // GitHub (Dark)
  'gh-foundations': { x: 150, y: 2700 },
  'gh-actions': { x: 450, y: 2580 },
  'gh-security': { x: 450, y: 2640 },
  'gh-admin': { x: 450, y: 2700 },
  'gh-copilot': { x: 450, y: 2760 },
  'gh-600': { x: 450, y: 2820 },
};

const mapLines = [
  {
    id: 'microsoft-365',
    color: 'var(--line-m365)',
    segments: [['ms-900', 'ms-102'], ['ms-900', 'ms-721'], ['ms-102', 'md-102'], ['ms-102', 'ms-700']],
    offsetY: 0,
  },
  {
    id: 'azure-infrastructure',
    color: 'var(--line-azure)',
    segments: [['az-900', 'az-204'], ['az-900', 'az-104'], ['az-104', 'az-700'], ['az-104', 'az-800'], ['az-104', 'az-305'], ['az-104', 'az-120'], ['az-104', 'az-140']],
    offsetY: 0,
  },
  {
    id: 'devops',
    color: 'var(--line-devops)',
    segments: [['az-900', 'az-104'], ['az-104', 'az-400']],
    offsetY: 8,
  },
  {
    id: 'ai-machine-learning',
    color: 'var(--line-ai)',
    segments: [['ai-901', 'ai-101'], ['ai-901', 'ai-102'], ['ai-901', 'ai-200'], ['ai-901', 'ai-103'], ['ai-200', 'ai-300']],
    offsetY: 0,
  },
  {
    id: 'data-engineering',
    color: 'var(--line-data)',
    segments: [['dp-900', 'dp-300'], ['dp-900', 'dp-600'], ['dp-900', 'dp-203'], ['dp-203', 'dp-750'], ['dp-203', 'dp-800'], ['dp-203', 'dp-420']],
    offsetY: 0,
  },
  {
    id: 'security',
    color: 'var(--line-security)',
    segments: [['sc-900', 'az-500'], ['sc-900', 'sc-200'], ['sc-900', 'sc-300'], ['sc-900', 'sc-401'], ['sc-900', 'sc-500'], ['sc-900', 'sc-730'], ['sc-900', 'sc-710'], ['sc-500', 'sc-100'], ['az-500', 'sc-100']],
    offsetY: 0,
  },
  {
    id: 'power-platform',
    color: 'var(--line-power)',
    segments: [['pl-900', 'pl-400'], ['pl-900', 'pl-500'], ['pl-900', 'pl-200'], ['pl-900', 'pl-300'], ['pl-200', 'pl-600']],
    offsetY: 0,
  },
  {
    id: 'agentic-ai',
    color: 'var(--line-dynamics)',
    segments: [['ab-900', 'ab-210'], ['ab-900', 'ab-700'], ['ab-900', 'ab-410'], ['ab-900', 'ab-701'], ['ab-900', 'ab-250'], ['ab-410', 'ab-100']],
    offsetY: 0,
  },
  {
    id: 'dynamics-365',
    color: 'var(--line-dynamics)',
    segments: [['mb-800', 'mb-820'], ['mb-300', 'mb-500'], ['mb-300', 'mb-310'], ['mb-310', 'mb-700'], ['mb-300', 'mb-330'], ['mb-330', 'mb-335']],
    offsetY: 0,
  },
  {
    id: 'github',
    color: 'var(--line-github)',
    segments: [['gh-foundations', 'gh-actions'], ['gh-foundations', 'gh-security'], ['gh-foundations', 'gh-admin'], ['gh-foundations', 'gh-copilot'], ['gh-foundations', 'gh-600']],
    offsetY: 0,
  },
];

const generateSvgPath = (segments, offsetY = 0) => {
  return segments
    .map(([start, end]) => {
      const p1 = mapCoords[start];
      const p2 = mapCoords[end];
      if (!p1 || !p2) return '';

      const y1 = p1.y + offsetY;
      const y2 = p2.y + offsetY;

      // Draw horizontal line if Y is same
      if (y1 === y2) {
        return `M ${p1.x} ${y1} L ${p2.x} ${y2}`;
      }

      // Draw smooth S-curve for diagonal branching
      const midX = (p1.x + p2.x) / 2;
      return `M ${p1.x} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${p2.x} ${y2}`;
    })
    .join(' ');
};

const MetroOverview = () => {
  const { getStatus, toggleStatus } = useProgressContext();
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  const handleStationClick = (cert, path) => {
    setSelectedCert(cert);
    setSelectedPath(path);
  };

  const handleStationToggle = (e, certId) => {
    e.stopPropagation();
    toggleStatus(certId);
  };

  return (
    <div className="metro-overview">
      <div className="metro-overview__header">
        <h1 className="metro-overview__title">
          <Icons.Map size={28} />
          Metro Map
        </h1>
        <p className="metro-overview__subtitle">
          Explore the interconnected Microsoft certification landscape. Pan and scroll to explore all paths.
        </p>
      </div>

      <div className="metro-overview__canvas-wrapper">
        <div className="metro-overview__canvas">
          {/* SVG Tracks */}
          <svg className="metro-overview__svg-layer" width="1200" height="3100">
            <defs>
              <filter id="track-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background glowing lines */}
            {mapLines.map((line) => (
              <path
                key={`${line.id}-bg`}
                d={generateSvgPath(line.segments, line.offsetY)}
                fill="none"
                stroke={line.color}
                strokeWidth="10"
                strokeOpacity="0.15"
                filter="url(#track-glow)"
              />
            ))}

            {/* Main solid lines */}
            {mapLines.map((line) => (
              <path
                key={line.id}
                d={generateSvgPath(line.segments, line.offsetY)}
                fill="none"
                stroke={line.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="metro-overview__track-line"
              />
            ))}
          </svg>

          {/* Station Nodes */}
          {certificationPaths.map((path) =>
            path.certifications.map((cert) => {
              const coords = mapCoords[cert.id];
              if (!coords) return null; // Skip if no coords defined

              const status = getStatus(cert.id);
              const isInterchange = cert.isInterchange;

              return (
                <div
                  key={`${path.id}-${cert.id}`}
                  className={`metro-overview__station metro-overview__station--${status} ${
                    isInterchange ? 'metro-overview__station--interchange' : ''
                  }`}
                  style={{
                    left: coords.x,
                    top: coords.y,
                    '--station-color': path.color,
                  }}
                  onClick={() => handleStationClick(cert, path)}
                  title={`${cert.examCode} - ${cert.name}`}
                >
                  <div className="metro-overview__node-outer">
                    <div className="metro-overview__node-inner">
                      {status === CERT_STATUS.COMPLETED && <Icons.Check size={14} strokeWidth={3} />}
                    </div>
                    {status === CERT_STATUS.IN_PROGRESS && <div className="metro-overview__node-half" />}
                  </div>

                  {status === CERT_STATUS.IN_PROGRESS && <div className="metro-overview__pulse" />}

                  <div className="metro-overview__label">
                    <span className="metro-overview__label-code">{cert.examCode}</span>
                    <span className="metro-overview__label-name">{cert.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
