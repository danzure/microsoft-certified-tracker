import './ProgressRing.css';

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
        {showPercent && <span className="progress-ring__value">{percent}%</span>}
        {label && <span className="progress-ring__label">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
