import './Badge.css';

/**
 * A reusable Badge component for displaying small labels like certification paths or levels.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The badge content
 * @param {string} [props.variant='default'] - Predefined style variant
 * @param {string} [props.color] - Custom theme color overriding the variant
 * @param {boolean} [props.small=false] - If true, renders a smaller badge
 * @param {boolean} [props.outline=false] - If true, renders with an outline instead of solid background
 */
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
