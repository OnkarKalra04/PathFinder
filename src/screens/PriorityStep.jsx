import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import Button from '../components/ui/Button';
import { ChevronRight, ChevronLeft, RefreshCcw, Equal } from 'lucide-react';
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
          <div className="point-input-group">
            <label>Salary Potential</label>
            <input 
              type="number" 
              className="form-control text-center point-input"
              value={priorities.salary || ''}
              onChange={(e) => handleInputChange('salary', e.target.value)}
              min="0"
              placeholder="0"
            />
          </div>
          
          <div className="point-input-group">
            <label>Work-Life Balance</label>
            <input 
              type="number" 
              className="form-control text-center point-input"
              value={priorities.wlb || ''}
              onChange={(e) => handleInputChange('wlb', e.target.value)}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="point-input-group">
            <label>Networking Opportunity</label>
            <input 
              type="number" 
              className="form-control text-center point-input"
              value={priorities.networking || ''}
              onChange={(e) => handleInputChange('networking', e.target.value)}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="point-input-group">
            <label>Learning Opportunity</label>
            <input 
              type="number" 
              className="form-control text-center point-input"
              value={priorities.learning || ''}
              onChange={(e) => handleInputChange('learning', e.target.value)}
              min="0"
              placeholder="0"
            />
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
