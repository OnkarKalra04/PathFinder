import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import { CAREERS } from '../data/careers';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Search, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import './CareerSelectionStep.css';

const CareerSelectionStep = () => {
  const navigate = useNavigate();
  const { selectedCareers, setSelectedCareers, setCurrentStep } = useCareerContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCareers = CAREERS.filter(career => 
    career.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCareer = (careerId) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(prev => prev.filter(id => id !== careerId));
    } else {
      if (selectedCareers.length < 3) {
        setSelectedCareers(prev => [...prev, careerId]);
      }
    }
  };

  const handleNext = () => {
    setCurrentStep(3);
    navigate('/step-3');
  };

  const handleBack = () => {
    setCurrentStep(1);
    navigate('/step-1');
  };

  const isNextDisabled = selectedCareers.length < 2 || selectedCareers.length > 3;

  return (
    <div className="wizard-step animate-fade-in">
      <ProgressIndicator currentStep={2} totalSteps={4} />
      
      <div className="step-header">
        <h1>Choose Careers to Compare</h1>
        <p className="text-muted">Select 2 to 3 careers you want to analyze side-by-side.</p>
      </div>

      <div className="selection-container">
        {/* Selected Careers Area */}
        <div className="selected-area">
          <h3 className="section-title">Selected Careers ({selectedCareers.length}/3)</h3>
          <div className="selected-grid">
            {selectedCareers.length === 0 ? (
              <div className="empty-selection">No careers selected yet.</div>
            ) : (
              selectedCareers.map(id => {
                const c = CAREERS.find(car => car.id === id);
                return (
                  <div key={id} className="selected-career-chip" onClick={() => toggleCareer(id)}>
                    {c.name}
                    <span className="remove-cross">×</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search careers..." 
            className="form-control pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Careers Grid */}
        <div className="careers-grid">
          {filteredCareers.map(career => {
            const isSelected = selectedCareers.includes(career.id);
            const isDisabled = !isSelected && selectedCareers.length >= 3;
            
            return (
              <Card 
                key={career.id} 
                hoverable={!isDisabled || isSelected} 
                className={`career-choice-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => (!isDisabled || isSelected) && toggleCareer(career.id)}
              >
                <div className="card-content-flex">
                  <div>
                    <h4 className="career-name">{career.name}</h4>
                    <span className="career-meta">{career.skills.length} core skills</span>
                  </div>
                  {isSelected && <CheckCircle2 className="select-icon" />}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="step-actions mt-8">
          <Button variant="secondary" onClick={handleBack}>
            <ChevronLeft size={18} /> Back
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled}>
            Compare Careers <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerSelectionStep;
