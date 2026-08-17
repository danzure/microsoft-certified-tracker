import { useState, useRef, useEffect } from 'react';
import { useProgressContext } from '../../context/ProgressContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { CURRENCIES } from '../../utils/pricing';
import { IconMap as Icons } from './IconMap';
import './DataModal.css';

/**
 * DataModal Component
 * 
 * Provides a management modal for exporting/importing certification progress,
 * configuring global currency preference, and resetting data with confirmation.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 */
const DataModal = ({ isOpen, onClose }) => {
  const { exportProgressJSON, importProgressJSON, resetAll } = useProgressContext();
  const { currency, setCurrency } = useCurrency();
  const { addToast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = () => {
    exportProgressJSON();
    addToast('Progress backup exported successfully', 'success');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = importProgressJSON(content);
      if (res.success) {
        addToast('Progress restored successfully from backup', 'success');
        onClose();
      } else {
        addToast(`Failed to import backup: ${res.error}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be re-selected if needed
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetAll();
    setConfirmReset(false);
    addToast('All progress and custom tracks have been reset', 'info');
    onClose();
  };

  return (
    <div className="data-modal-overlay" onClick={onClose}>
      <div 
        className="data-modal" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="data-modal-title"
      >
        <div className="data-modal__header">
          <div className="data-modal__title-group">
            <div className="data-modal__icon">
              <Icons.DatabaseIcon size={20} />
            </div>
            <h2 className="data-modal__title" id="data-modal-title">Data & Preferences</h2>
          </div>
          <button 
            className="data-modal__close-btn" 
            onClick={onClose} 
            aria-label="Close dialog"
          >
            <Icons.X size={18} />
          </button>
        </div>

        <div className="data-modal__body">
          {/* Backup & Restore Section */}
          <div className="data-modal__section">
            <h3 className="data-modal__section-title">Backup & Restore</h3>
            <p className="data-modal__section-desc">
              Save your progress to a local JSON file or restore from a previous backup.
            </p>
            <div className="data-modal__actions-row">
              <button 
                className="data-modal__btn data-modal__btn--primary" 
                onClick={handleExport}
              >
                <Icons.Download size={16} />
                Export Backup (JSON)
              </button>
              <button 
                className="data-modal__btn data-modal__btn--secondary" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Icons.Upload size={16} />
                Import Backup (JSON)
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".json,application/json" 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          {/* Currency Preference Section */}
          <div className="data-modal__section">
            <h3 className="data-modal__section-title">Global Exam Currency</h3>
            <p className="data-modal__section-desc">
              Select your preferred display currency for estimated certification exam costs.
            </p>
            <div className="data-modal__currency-group">
              {Object.entries(CURRENCIES).map(([code, data]) => (
                <button
                  key={code}
                  className={`data-modal__currency-btn ${currency === code ? 'data-modal__currency-btn--active' : ''}`}
                  onClick={() => setCurrency(code)}
                >
                  <span className="data-modal__currency-symbol">{data.symbol}</span>
                  <span className="data-modal__currency-label">{data.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Section */}
          <div className="data-modal__section data-modal__section--danger">
            <h3 className="data-modal__section-title">Reset Progress</h3>
            <p className="data-modal__section-desc">
              Clear all certification completion statuses, dates, and your custom career track.
            </p>
            <div className="data-modal__actions-row">
              <button 
                className={`data-modal__btn ${confirmReset ? 'data-modal__btn--danger' : 'data-modal__btn--subtle-danger'}`} 
                onClick={handleReset}
              >
                <Icons.AlertTriangle size={16} />
                {confirmReset ? 'Confirm Reset: Clear All Progress' : 'Reset All Progress'}
              </button>
              {confirmReset && (
                <button 
                  className="data-modal__btn data-modal__btn--secondary" 
                  onClick={() => setConfirmReset(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
