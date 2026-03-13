import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import Button from '../components/ui/Button';
import { ChevronRight, ChevronLeft, RefreshCcw, Equal, Info } from 'lucide-react';
import './PriorityStep.css';
import './PriorityStep.css';

const PriorityStep = () => {
  const navigate = useNavigate();
  const { priorities, setPriorities, setCurrentStep } = useCareerContext();
  const [errorMsg, setErrorMsg] = useState('');

  const total = priorities.salary + priorities.wlb + priorities.networking + priorities.learning;

  useEffect(() => {
    if (total > 100) {
      setErrorMsg("Total cannot exceed 100 points.");
    } else {
      setErrorMsg('');
    }
  }, [total]);

  const handleInputChange = (key, value) => {
    // Basic validation to only allow numbers
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) numValue = 0;
    
    // Prevent negative numbers
    if (numValue < 0) numValue = 0;

    setPriorities(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const handleEqualDistribution = () => {
    setPriorities({
      salary: 25,
      wlb: 25,
      networking: 25,
      learning: 25
    });
    setErrorMsg('');
  };

  const handleReset = () => {
    setPriorities({
      salary: 0,
      wlb: 0,
      networking: 0,
      learning: 0
    });
    setErrorMsg('');
  };

  const handleNext = () => {
    if (total < 100) {
      setErrorMsg("Please distribute all 100 points before continuing.");
      return;
    }
    
    if (total > 100) {
      return; // Handled by useEffect, button should be disabled anyway but safe-guard
    }
    
    navigate('/results');
  };

  const handleBack = () => {
    setCurrentStep(3);
    navigate('/step-3');
  };

  return (
    <div className="wizard-step animate-fade-in">
      <ProgressIndicator currentStep={4} totalSteps={4} />
      
      <div className="step-header">
        <h1>What Matters Most?</h1>
        <p className="text-muted">Distribute exactly 100 points across the factors below.</p>
      </div>

      <div className="priority-container">
        
        <div className={`total-indicator text-center ${total > 100 ? 'total-error' : total === 100 ? 'total-success' : ''}`}>
          <div className="total-value">{total} / 100</div>
          <div className="text-muted text-sm uppercase">Total Points Used</div>
        </div>

        {errorMsg && (
          <div className="error-message">
            {errorMsg}
          </div>
        )}

        <div className="point-allocation-wrapper">
          
          {/* Salary Potential */}
          <div className="point-input-group">
            <div className="point-header">
              <div className="point-header-left">
                <label>Salary Potential</label>
                <div className="tooltip-container">
                  <Info size={16} className="tooltip-icon" />
                  <span className="tooltip-text">Estimated earning potential in this career.</span>
                </div>
              </div>
            </div>
            <div className="point-controls">
              <input 
                type="range" 
                className="slider-control" 
                min="0" 
                max="100" 
                value={priorities.salary || 0} 
                onChange={(e) => handleInputChange('salary', e.target.value)}
              />
              <input 
                type="number" 
                className="form-control point-input"
                value={priorities.salary || ''}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>
          
          {/* Work-Life Balance */}
          <div className="point-input-group">
            <div className="point-header">
              <div className="point-header-left">
                <label>Work-Life Balance</label>
                <div className="tooltip-container">
                  <Info size={16} className="tooltip-icon" />
                  <span className="tooltip-text">How manageable work hours and lifestyle are.</span>
                </div>
              </div>
            </div>
            <div className="point-controls">
              <input 
                type="range" 
                className="slider-control" 
                min="0" 
                max="100" 
                value={priorities.wlb || 0} 
                onChange={(e) => handleInputChange('wlb', e.target.value)}
              />
              <input 
                type="number" 
                className="form-control point-input"
                value={priorities.wlb || ''}
                onChange={(e) => handleInputChange('wlb', e.target.value)}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>

          {/* Networking Opportunity */}
          <div className="point-input-group">
            <div className="point-header">
              <div className="point-header-left">
                <label>Networking Opportunity</label>
                <div className="tooltip-container">
                  <Info size={16} className="tooltip-icon" />
                  <span className="tooltip-text">How much interaction and relationship-building the role involves.</span>
                </div>
              </div>
            </div>
            <div className="point-controls">
              <input 
                type="range" 
                className="slider-control" 
                min="0" 
                max="100" 
                value={priorities.networking || 0} 
                onChange={(e) => handleInputChange('networking', e.target.value)}
              />
              <input 
                type="number" 
                className="form-control point-input"
                value={priorities.networking || ''}
                onChange={(e) => handleInputChange('networking', e.target.value)}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>

          {/* Learning Opportunity */}
          <div className="point-input-group">
             <div className="point-header">
              <div className="point-header-left">
                <label>Learning Opportunity</label>
                <div className="tooltip-container">
                  <Info size={16} className="tooltip-icon" />
                  <span className="tooltip-text">How much skill growth and development the career offers.</span>
                </div>
              </div>
            </div>
            <div className="point-controls">
              <input 
                type="range" 
                className="slider-control" 
                min="0" 
                max="100" 
                value={priorities.learning || 0} 
                onChange={(e) => handleInputChange('learning', e.target.value)}
              />
              <input 
                type="number" 
                className="form-control point-input"
                value={priorities.learning || ''}
                onChange={(e) => handleInputChange('learning', e.target.value)}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>

        </div>

        <div className="helper-actions mt-6">
          <Button variant="outline" size="sm" onClick={handleEqualDistribution}>
            <Equal size={14} style={{ marginRight: '6px' }} /> Equal Distribution
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw size={14} style={{ marginRight: '6px' }} /> Reset
          </Button>
        </div>

        <div className="step-actions mt-8">
          <Button variant="secondary" onClick={handleBack}>
            <ChevronLeft size={18} /> Back
          </Button>
          <Button onClick={handleNext} disabled={total !== 100}>
            See Career Match Results <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriorityStep;
