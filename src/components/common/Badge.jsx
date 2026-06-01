import './Badge.css';

const Badge = ({ children, variant = 'default', color, small = false, outline = false }) => {
  const style = color ? { 
    '--badge-color': color, 
    '--badge-bg': outline ? 'transparent' : `${color}22`,
    '--badge-border': color 
  } : {};

  return (
    <span className={`badge badge--${variant} ${small ? 'badge--small' : ''} ${outline ? 'badge--outline' : ''}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
