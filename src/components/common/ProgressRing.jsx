import './ProgressRing.css';

/**
 * An SVG-based circular progress indicator.
 * 
 * @param {Object} props
 * @param {number} [props.percent=0] - Completion percentage (0-100)
 * @param {number} [props.size=64] - Diameter of the ring in pixels
 * @param {number} [props.strokeWidth=4] - Width of the progress stroke
 * @param {string} [props.color='#0078d4'] - Color of the filled progress section
 * @param {string} [props.label] - Optional text label displayed below the ring
 * @param {boolean} [props.showPercent=true] - Whether to show the percentage text inside the ring
 */
const ProgressRing = ({ percent = 0, size = 64, strokeWidth = 4, color = '#0078d4', label, showPercent = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring__bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ '--ring-color': color }}
        />
      </svg>
      <div className="progress-ring__content">
        {showPercent && <span className="progress-ring__value" style={{ fontSize: Math.max(12, size * 0.25) }}>{percent}%</span>}
        {label && <span className="progress-ring__label">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
