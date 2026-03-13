import './ProgressIndicator.css';

const ProgressIndicator = ({ currentStep, totalSteps = 4, className = '' }) => {
  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-text">
        <span>Step {currentStep} of {totalSteps}</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
