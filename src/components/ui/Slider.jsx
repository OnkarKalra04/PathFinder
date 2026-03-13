import './Slider.css';

const Slider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  className = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider-container ${className}`}>
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{value}%</span>
      </div>
      <div className="slider-input-wrapper">
        <div 
          className="slider-track-active" 
          style={{ width: `${percentage}%` }}
        ></div>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step}
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input"
        />
      </div>
    </div>
  );
};

export default Slider;
