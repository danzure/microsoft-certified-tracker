import { useEffect, useState } from 'react';
import { IconMap as Icons } from './IconMap';
import './Toast.css';

const Toast = ({ message, type = 'success', action, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // We don't rely on a hardcoded timeout for the closing animation anymore
    // because duration is dynamic. Instead, the parent context will unmount it.
    // However, to make it smooth, we could listen to a closing prop, but for now 
    // we'll just let it unmount directly or trigger close via button.
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // wait for animation
  };

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick();
    }
    handleClose();
  };

  const Icon = type === 'success' ? Icons.CheckCircle2 : (type === 'info' ? Icons.Info : Icons.AlertTriangle);

  return (
    <div className={`toast toast--${type} ${isClosing ? 'toast--closing' : ''}`}>
      <Icon size={18} className="toast__icon" />
      <span className="toast__message">{message}</span>
      {action && (
        <button className="toast__action-btn" onClick={handleAction}>
          {action.label}
        </button>
      )}
      <button className="toast__close" onClick={handleClose}>
        <Icons.X size={14} />
      </button>
    </div>
  );
};

export default Toast;
