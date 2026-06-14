import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconMap as Icons } from '../common/IconMap';

export const SortableCertItem = ({ id, index, certInfo, status, statusText, nodeClass, badgeClass, StatusIcon, onNavigate, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="cpb-timeline-step cpb-timeline-step--sortable">
      <div className="cpb-timeline-indicator">
        <div className={`cpb-timeline-node ${nodeClass}`}>
          {status === 'COMPLETED' ? (
            <Icons.Check size={20} />
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
      </div>
      <div 
        className="cpb-timeline-card"
        style={{ '--card-color': certInfo.pathColor }}
      >
        <div className="cpb-timeline-card-header">
          <div>
            <div className="cpb-timeline-cert-code">{certInfo.examCode}</div>
            <div className="cpb-timeline-cert-name">{certInfo.name}</div>
          </div>
          <div className="cpb-timeline-card-actions">
            <div className={`cpb-timeline-badge ${badgeClass}`}>
              <StatusIcon size={12} />
              {statusText}
            </div>
            {onRemove && (
              <button 
                className="cpb-timeline-action-btn cpb-timeline-remove-btn" 
                onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                title="Remove from custom list"
              >
                <Icons.X size={16} />
              </button>
            )}
            <div 
              className="cpb-timeline-action-btn cpb-timeline-drag-handle" 
              {...attributes} 
              {...listeners}
              title="Drag to reorder"
            >
              <Icons.GripVertical size={20} />
            </div>
          </div>
        </div>
        <div className="cpb-timeline-cert-desc" onClick={() => onNavigate(`/path/${certInfo.pathId}`)}>
          {certInfo.description}
        </div>
      </div>
    </div>
  );
};
