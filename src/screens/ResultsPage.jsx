import { useCareerContext } from '../context/CareerContext';
import { CAREERS } from '../data/careers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SkillPill from '../components/ui/SkillPill';
import { RefreshCcw, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = () => {
  const { selectedCareers, priorities, userSkills, setCurrentStep, setPriorities, setSelectedCareers, setUserSkills, setUserProfile } = useCareerContext();
  const navigate = useNavigate();

  // 1. Calculate matching score
  const calculateScore = (career) => {
    const p = priorities;
    const f = career.factors;
    
    const salaryWeight = p.salary / 100;
    const wlbWeight = p.wlb / 100;
    const netWeight = p.networking / 100;
    const learnWeight = p.learning / 100;

    const score = (f.salary * salaryWeight) + (f.wlb * wlbWeight) + (f.networking * netWeight) + (f.learning * learnWeight);
    return Math.round(score);
  };

  // 2. Compute missing skills
  const getMissingSkills = (careerReqSkills) => {
    const missing = careerReqSkills.filter(s => !userSkills.includes(s));
    return missing.slice(0, 5); // Return top 4-5 missing
  };

  // 3. Generate explanation engine (Text generated based on priorities)
  const generateExplanation = (career) => {
    const highestPriority = Object.keys(priorities).reduce((a, b) => priorities[a] > priorities[b] ? a : b);
    
    let priorityName = "salary potential";
    if (highestPriority === 'wlb') priorityName = "work-life balance";
    if (highestPriority === 'networking') priorityName = "networking opportunities";
    if (highestPriority === 'learning') priorityName = "learning and growth";

    const isStrongMatch = career.factors[highestPriority] >= 75;
    
    if (isStrongMatch) {
      return `Your priority emphasizes ${priorityName}, which aligns wonderfully with the strengths of this career path.`;
    } else {
      return `While this career may not maximize ${priorityName}, it offers a balanced alternative aligned with your skills.`;
    }
  };

  // 4. Process all careers
  const allScoredCareers = CAREERS.map(c => ({
    ...c,
    matchScore: calculateScore(c),
    missingSkills: getMissingSkills(c.skills),
    explanation: generateExplanation(c)
  }));

  // 5. Separate user-selected vs suggested
  let selected = allScoredCareers.filter(c => selectedCareers.includes(c.id));
  selected.sort((a,b) => b.matchScore - a.matchScore);

  let unselected = allScoredCareers.filter(c => !selectedCareers.includes(c.id));
  unselected.sort((a,b) => b.matchScore - a.matchScore);
  
  const suggested = unselected.slice(0, 3);

  const renderCareerCard = (career, isTopMatch = false) => (
    <Card key={career.id} className={`result-card ${isTopMatch ? 'result-card-top' : ''}`}>
      {isTopMatch && (
        <div className="best-match-badge">
          <Star size={14} fill="currentColor" /> Best Match
        </div>
      )}
      
      <div className="result-card-header">
        <h3 className="result-career-name">{career.name}</h3>
        <div className="result-score-circle">
          <span>{career.matchScore}</span>
        </div>
      </div>

      <div className="result-factors-grid">
        <div className="result-factor">
          <span className="rf-label">Salary</span>
          <span className="rf-value">{career.factors.salary}</span>
        </div>
        <div className="result-factor">
          <span className="rf-label">WLB</span>
          <span className="rf-value">{career.factors.wlb}</span>
        </div>
        <div className="result-factor">
          <span className="rf-label">Network</span>
          <span className="rf-value">{career.factors.networking}</span>
        </div>
        <div className="result-factor">
          <span className="rf-label">Learning</span>
          <span className="rf-value">{career.factors.learning}</span>
        </div>
      </div>

      <div className="result-skills-section">
        <h4 className="skills-to-build-title">Skills to Build Next</h4>
        <div className="missing-skills-flex">
          {career.missingSkills.length > 0 ? (
            career.missingSkills.map(s => <SkillPill key={s} skill={s} variant="missing" />)
          ) : (
            <span className="text-sm text-muted">You have all core skills!</span>
          )}
        </div>
      </div>

      <div className="result-explanation">
        <h4 className="explanation-title">Why This Career Matches You</h4>
        <p className="explanation-text">{career.explanation}</p>
      </div>
    </Card>
  );

  const resetJourney = () => {
    setUserProfile({ education: '', fieldOfStudy: '', experience: '' });
    setUserSkills([]);
    setSelectedCareers([]);
    setPriorities({ salary: 25, wlb: 25, networking: 25, learning: 25 });
    setCurrentStep(1);
    navigate('/');
  };

  return (
    <div className="results-page animate-fade-in">
      <div className="results-hero text-center">
        <h1>Your Career Match Results</h1>
        <p className="text-muted text-lg">Based on your priorities, skills, and selected paths.</p>
      </div>

      <section className="results-section">
        <h2 className="section-title-large">Your Selected Careers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {selected.map((career, index) => renderCareerCard(career, index === 0))}
        </div>
      </section>

      <section className="results-section suggested-section">
        <div className="suggested-header">
          <TrendingUp className="suggested-icon" size={24} />
          <div>
            <h2 className="section-title-large mb-1">Suggested Careers For You</h2>
            <p className="text-muted">Based on your priorities and skills, you may also consider these alternative paths.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {suggested.map(career => renderCareerCard(career, false))}
        </div>
      </section>

      <div className="results-footer text-center">
        <Button variant="outline" onClick={resetJourney}>
          <RefreshCcw size={18} style={{ marginRight: '8px' }} /> Start Over
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
