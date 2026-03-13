import './SkillPill.css';
import { X } from 'lucide-react';

const SkillPill = ({ skill, onRemove, variant = 'default', className = '' }) => {
  return (
    <span className={`skill-pill skill-pill-${variant} ${className}`}>
      {skill}
      {onRemove && (
        <button 
          type="button" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className="skill-pill-remove"
          aria-label={`Remove ${skill}`}
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
};

export default SkillPill;
