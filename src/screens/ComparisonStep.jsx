import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import { CAREERS } from '../data/careers';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import Button from '../components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './ComparisonStep.css';

const getFactorLabel = (score) => {
  if (score >= 80) return { label: 'High', class: 'label-high' };
  if (score >= 60) return { label: 'Medium', class: 'label-medium' };
  return { label: 'Low', class: 'label-low' };
};

const ComparisonStep = () => {
  const navigate = useNavigate();
  const { selectedCareers, setCurrentStep } = useCareerContext();

  const careersToCompare = selectedCareers.map(id => CAREERS.find(c => c.id === id));

  const handleNext = () => {
    setCurrentStep(4);
    navigate('/step-4');
  };

  const handleBack = () => {
    setCurrentStep(2);
    navigate('/step-2');
  };

  if (careersToCompare.length === 0) {
    return (
      <div className="wizard-step animate-fade-in text-center">
        <h2>No Careers Selected</h2>
        <Button onClick={handleBack} className="mt-4">Go Back to Select Careers</Button>
      </div>
    );
  }

  return (
    <div className="wizard-step animate-fade-in">
      <ProgressIndicator currentStep={3} totalSteps={4} />
      
      <div className="step-header">
        <h1>Compare Career Paths</h1>
        <p className="text-muted">Review how your choices stack up across fundamental career factors.</p>
      </div>

      <div className="comparison-container">
        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="factor-col">Factor</th>
                {careersToCompare.map(career => (
                  <th key={career.id} className="career-col">
                    <div className="career-header-card">
                      {career.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="factor-label">
                  <strong>Salary Potential</strong>
                  <span className="factor-desc">Earning capacity and growth.</span>
                </td>
                {careersToCompare.map(career => {
                  const factor = getFactorLabel(career.factors.salary);
                  return (
                    <td key={career.id}>
                      <span className={`factor-badge ${factor.class}`}>{factor.label}</span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="factor-label">
                  <strong>Work-Life Balance</strong>
                  <span className="factor-desc">Hours and predictability.</span>
                </td>
                {careersToCompare.map(career => {
                  const factor = getFactorLabel(career.factors.wlb);
                  return (
                    <td key={career.id}>
                      <span className={`factor-badge ${factor.class}`}>{factor.label}</span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="factor-label">
                  <strong>Networking Opportunity</strong>
                  <span className="factor-desc">Professional connections.</span>
                </td>
                {careersToCompare.map(career => {
                  const factor = getFactorLabel(career.factors.networking);
                  return (
                    <td key={career.id}>
                      <span className={`factor-badge ${factor.class}`}>{factor.label}</span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="factor-label">
                  <strong>Learning Opportunity</strong>
                  <span className="factor-desc">Skill acquisition and growth.</span>
                </td>
                {careersToCompare.map(career => {
                  const factor = getFactorLabel(career.factors.learning);
                  return (
                    <td key={career.id}>
                      <span className={`factor-badge ${factor.class}`}>{factor.label}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="step-actions mt-8">
          <Button variant="secondary" onClick={handleBack}>
            <ChevronLeft size={18} /> Back
          </Button>
          <Button onClick={handleNext}>
            Calculate Career Match <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonStep;
