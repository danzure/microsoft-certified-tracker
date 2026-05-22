import './Badge.css';

const Badge = ({ children, variant = 'default', color, small = false }) => {
  const style = color ? { '--badge-color': color, '--badge-bg': `${color}22` } : {};

  return (
    <span className={`badge badge--${variant} ${small ? 'badge--small' : ''}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
