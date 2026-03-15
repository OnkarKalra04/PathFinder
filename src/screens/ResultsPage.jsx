import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCareerContext } from '../context/CareerContext';
import { CAREERS } from '../data/careers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SkillPill from '../components/ui/SkillPill';
import { RefreshCcw, Star, TrendingUp, X, Map, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = () => {
  const { 
    selectedCareers, priorities, userSkills, 
    setCurrentStep, setPriorities, setSelectedCareers, 
    setUserSkills, setUserProfile, savedRoadmaps, 
    saveRoadmap, unsaveRoadmap, activeTab, setActiveTab 
  } = useCareerContext();
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState(null);
  const [showSuggested, setShowSuggested] = useState(false);
  
  // AI Roadmap States
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIRoadmap, setShowAIRoadmap] = useState(false);
  
  // Close modal when hitting ESC, and manage body scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    
    // Prevent body scrolling when modal is open
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [activeModal]);

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

  // 4. Generate Career Transition Path
  const generateTransitionPath = (missingSkills) => {
    const skillsList = missingSkills.length > 0 
      ? missingSkills.join(", ") 
      : "advanced techniques in this field";

    return [
      "Learn the core fundamentals related to this career.",
      `Develop the missing skills: ${skillsList}.`,
      "Build practical projects or case studies using these skills.",
      "Create a portfolio demonstrating your work.",
      "Apply for entry-level roles in this field."
    ];
  };

  // Sub-component for Explore Careers card with flip animation
  const ExploreCard = ({ career }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Fallback description if not provided in data
    const description = career.description || `A dynamic career path in ${career.name}, focusing on leveraging key skills to solve complex problems and drive value.`;

    return (
      <div 
        className={`explore-card-container ${isFlipped ? 'is-flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <h3 className="result-career-name">{career.name}</h3>
            <p className="tap-hint" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              Click to learn more
            </p>
          </div>
          <div className="flip-card-back">
            <h4>{career.name}</h4>
            <p>{description}</p>
          </div>
        </div>
      </div>
    );
  };

  // 5. Generate Career Roadmap
  const generateRoadmap = (missingSkills) => {
    const skillsList = missingSkills.length > 0
      ? missingSkills.join(", ")
      : "advanced concepts";

    return [
      { phase: "0–3 Months", text: `Start learning the core fundamentals of this field and begin studying: ${skillsList}.` },
      { phase: "3–6 Months", text: "Practice these skills through exercises, online courses, or small projects." },
      { phase: "6–9 Months", text: "Build portfolio projects demonstrating your capabilities in these areas." },
      { phase: "9–12 Months", text: "Prepare for interviews and apply for entry-level roles in this career." }
    ];
  };

  // 6. Process all careers helper
  const processCareer = (c) => {
    const missing = getMissingSkills(c.skills);
    return {
      ...c,
      matchScore: calculateScore(c),
      missingSkills: missing,
      explanation: generateExplanation(c),
      transitionPath: generateTransitionPath(missing),
      roadmap: generateRoadmap(missing)
    };
  };

  const allScoredCareers = CAREERS.map(processCareer);

  // 7. Separate user-selected vs suggested
  let selected = allScoredCareers.filter(c => selectedCareers.includes(c.id));
  selected.sort((a,b) => b.matchScore - a.matchScore);

  let unselected = allScoredCareers.filter(c => !selectedCareers.includes(c.id));
  unselected.sort((a,b) => b.matchScore - a.matchScore);
  
  const suggested = unselected.slice(0, 3);

  const renderCareerCard = (career, isTopMatch = false, isExplore = false) => {
    if (isExplore) {
      return <ExploreCard key={career.id} career={career} />;
    }

    return (
      <Card key={career.id} className={`result-card ${isTopMatch ? 'result-card-top' : ''}`}>
        {isTopMatch && (
          <div className="best-match-badge">
            <Star size={14} fill="currentColor" /> Best Match
          </div>
        )}
        
        <div className="result-card-header">
          <h3 className="result-career-name">{career.name}</h3>
          <div className="result-score-circle">
            <span className="fit-score-label">Fit Score</span>
            <span className="fit-score-value">{career.matchScore}</span>
          </div>
        </div>

        <div className="result-explanation">
          <h4 className="explanation-title">Career Fit Summary</h4>
          <p className="explanation-text">{career.explanation}</p>
        </div>

        <div className="result-factors-grid" style={{ marginTop: 'var(--space-4)' }}>
          <div className="result-factor">
            <span className="rf-label">Salary</span>
            <span className="rf-value">{career.factors.salary}</span>
          </div>
          <div className="result-factor">
            <span className="rf-label">WLB</span>
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
          <h4 className="skills-to-build-title">Skills Overview</h4>
          <div className="missing-skills-flex">
            {career.missingSkills.length > 0 ? (
              career.missingSkills.slice(0, 3).map(s => <SkillPill key={s} skill={s} variant="missing" />)
            ) : (
              <span className="text-sm text-muted">You have all core skills!</span>
            )}
            {career.missingSkills.length > 3 && (
              <span className="text-xs text-muted" style={{ padding: '0.25rem' }}>+{career.missingSkills.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2" style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', display: 'flex' }}>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => setActiveModal(career)}
          >
             View Details
          </Button>
          {!isExplore && (
             <Button 
              variant={selectedCareers.includes(career.id) ? "secondary" : "primary"}
              fullWidth
              onClick={() => {
                if (selectedCareers.includes(career.id)) {
                  setSelectedCareers(selectedCareers.filter(id => id !== career.id));
                } else {
                  setSelectedCareers([...selectedCareers, career.id]);
                }
              }}
            >
              {selectedCareers.includes(career.id) ? "Remove" : "Add"}
            </Button>
          )}
        </div>
      </Card>
    );
  };

  const renderModal = () => {
    if (!activeModal) return null;
    const career = activeModal;
    const isSaved = savedRoadmaps.some(r => r.id === career.id);

    const handleGenerateAIRoadmap = () => {
      setIsGeneratingAI(true);
      // Simulate API call for AI generation
      setTimeout(() => {
        setShowAIRoadmap(true);
        setIsGeneratingAI(false);
      }, 1500);
    };

    const handleCloseModal = () => {
      setActiveModal(null);
      // Reset AI Roadmap visibility for the next time a modal opens
      setTimeout(() => setShowAIRoadmap(false), 300); 
    };

    const handleSaveRoadmap = () => {
      if (isSaved) {
        unsaveRoadmap(career.id);
      } else {
        saveRoadmap(career);
      }
    };

    return createPortal(
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h3>{career.name} Path Details</h3>
              <p className="text-xs text-muted mt-1">Explore your transition roadmap below</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isSaved ? "secondary" : "outline"} 
                size="sm" 
                onClick={handleSaveRoadmap}
                style={{ height: '32px', fontSize: '12px' }}
              >
                {isSaved ? "Roadmap Saved" : "Save Roadmap"}
              </Button>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="modal-body">
            <div className="result-skills-section">
              <h4 className="skills-to-build-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} /> All Skills to Build
              </h4>
              <div className="missing-skills-flex">
                {career.missingSkills.length > 0 ? (
                  career.missingSkills.map(s => <SkillPill key={s} skill={s} variant="missing" />)
                ) : (
                  <span className="text-sm text-muted">You are fully equipped for this role!</span>
                )}
              </div>
            </div>

            <div className="result-transition-section">
              <h4 className="skills-to-build-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} /> Career Transition Path
              </h4>
              <ol className="transition-path-list">
                {career.transitionPath.map((step, idx) => (
                  <li key={idx} className="transition-step">
                    <div className="step-number">Step {idx + 1}</div>
                    <p className="step-text">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="result-roadmap-section">
              <h4 className="skills-to-build-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map size={16} /> Standard 12-Month Career Roadmap
              </h4>
              <div className="roadmap-timeline">
                {career.roadmap.map((phase, idx) => (
                  <div key={idx} className="roadmap-phase">
                    <div className="phase-marker"></div>
                    <div className="phase-content">
                      <div className="phase-title">{phase.phase}</div>
                      <p className="phase-text">{phase.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Generated Roadmap Section */}
            <div className="ai-roadmap-section mt-6">
              {!showAIRoadmap ? (
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    onClick={handleGenerateAIRoadmap}
                    disabled={isGeneratingAI}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="spin-animation" size={18} /> Generating Custom AI Roadmap...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Generate AI Career Roadmap
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="ai-roadmap-content animate-fade-in">
                  <div className="ai-badge-header mb-4">
                    <Sparkles size={16} className="text-primary" />
                    <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>AI Suggested Roadmap</span>
                  </div>
                  <h4 className="skills-to-build-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Map size={16} /> 12-Month Accelerated Plan
                  </h4>
                  <div className="roadmap-timeline ai-timeline">
                    {/* Simulated Custom AI Output */}
                    <div className="roadmap-phase">
                      <div className="phase-marker ai-marker"></div>
                      <div className="phase-content ai-content">
                        <div className="phase-title">Month 0–3: Rapid Upskilling</div>
                        <p className="phase-text">Focus purely on intensive bootcamps and hands-on mini-projects related to <strong>{career.missingSkills[0] || 'core concepts'}</strong>. Network heavily on LinkedIn.</p>
                      </div>
                    </div>
                    <div className="roadmap-phase">
                      <div className="phase-marker ai-marker"></div>
                      <div className="phase-content ai-content">
                        <div className="phase-title">Month 3–6: Practical Application</div>
                        <p className="phase-text">Contribute to open-source or freelance projects. Shadow professionals in the {career.name} space to gain empirical knowledge.</p>
                      </div>
                    </div>
                    <div className="roadmap-phase">
                      <div className="phase-marker ai-marker"></div>
                      <div className="phase-content ai-content">
                        <div className="phase-title">Month 6–12: Market Entry</div>
                        <p className="phase-text">Finalize your specialized portfolio. Launch a personal brand highlighting your unique strengths in {userSkills.slice(0, 2).join(' and ')}. Begin aggressive outreach for roles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const resetJourney = () => {
    setUserProfile({ name: '', education: '', fieldOfStudy: '', experience: '' });
    setUserSkills([]);
    setSelectedCareers([]);
    setPriorities({ salary: 25, wlb: 25, networking: 25, learning: 25 });
    setCurrentStep(1);
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <section className="results-section animate-fade-in">
            <div className="section-header-row">
              <h2 className="section-title-large">Explore All Careers</h2>
              <p className="text-muted">Browse the system catalog to discover diverse career paths.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {allScoredCareers.map(career => renderCareerCard(career, false, true))}
            </div>
          </section>
        );
      case 'my-careers':
        return (
          <>
            <section className="results-section">
              <h2 className="section-title-large">Your Selected Careers</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {selected.length > 0 ? (
                  selected.map((career, index) => renderCareerCard(career, index === 0))
                ) : (
                  <div className="col-span-3 text-center py-12 bg-surface border border-dashed border-border rounded-xl">
                    <p className="text-muted">No careers selected yet. Go to Explore to add some!</p>
                  </div>
                )}
              </div>
            </section>

            <div className="text-center" style={{ marginTop: 'var(--space-6)' }}>
              <Button variant={showSuggested ? "secondary" : "primary"} onClick={() => setShowSuggested(!showSuggested)}>
                {showSuggested ? "Hide Suggested Careers" : "See Suggested Careers"}
              </Button>
            </div>

            {showSuggested && (
              <section className="results-section suggested-section animate-fade-in">
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
            )}
          </>
        );
      case 'roadmaps':
        return (
          <section className="results-section animate-fade-in">
            <h2 className="section-title-large">Saved Roadmaps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {savedRoadmaps.length > 0 ? (
                savedRoadmaps.map(career => renderCareerCard(career, false))
              ) : (
                <div className="col-span-3 text-center py-12 bg-surface border border-dashed border-border rounded-xl">
                  <p className="text-muted">You haven't saved any roadmaps yet. Open a career detail to save its roadmap.</p>
                </div>
              )}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="results-page animate-fade-in">
      <div className="results-hero text-center">
        <h1>{activeTab === 'explore' ? 'Career Catalog' : activeTab === 'roadmaps' ? 'Your Roadmaps' : 'Your Career Match Results'}</h1>
        <p className="text-muted text-lg">
          {activeTab === 'explore' ? 'Explore and discover new career paths' : 'Based on your priorities, skills, and selected paths.'}
        </p>
      </div>

      {renderContent()}

      {renderModal()}

      {activeTab === 'my-careers' && (
        <div className="results-footer text-center">
          <Button variant="outline" onClick={resetJourney}>
            <RefreshCcw size={18} style={{ marginRight: '8px' }} /> Start Over
          </Button>
        </div>
      )}
    </div>
  );
};


export default ResultsPage;
