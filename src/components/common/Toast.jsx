import { useEffect, useState } from 'react';
import { IconMap as Icons } from './IconMap';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start closing animation slightly before the actual unmount
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // wait for animation
  };

  const Icon = type === 'success' ? Icons.CheckCircle2 : Icons.AlertTriangle;

  return (
    <div className={`toast toast--${type} ${isClosing ? 'toast--closing' : ''}`}>
      <Icon size={18} className="toast__icon" />
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={handleClose}>
        <Icons.X size={14} />
      </button>
    </div>
  );
};

export default Toast;
