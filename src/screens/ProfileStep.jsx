import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import { SKILLS } from '../data/skills';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import Button from '../components/ui/Button';
import SkillPill from '../components/ui/SkillPill';
import { Search, ChevronRight } from 'lucide-react';
import './ProfileStep.css';

const INTERESTS_OPTIONS = [
  "Technology", "Business", "Creativity", "Research", "Leadership", "Problem Solving"
];

const ProfileStep = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, userSkills, setUserSkills, setCurrentStep } = useCareerContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const suggestionListRef = useRef(null);

  // Sorting skills alphabetically A-Z just to be safe (though likely already sorted in data)
  const sortedSkills = [...SKILLS].sort((a, b) => a.localeCompare(b));

  // Determine available skills (filtered by search and excluding already selected)
  const availableSkills = sortedSkills.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !userSkills.includes(skill)
  );

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery, showSuggestions]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && suggestionListRef.current) {
      const activeElement = suggestionListRef.current.children[activeIndex];
      if (activeElement) {
         // Custom logic to ensure element is within view nicely
         const elementTop = activeElement.offsetTop;
         const elementBottom = elementTop + activeElement.offsetHeight;
         const containerTop = suggestionListRef.current.scrollTop;
         const containerBottom = containerTop + suggestionListRef.current.clientHeight;

         if (elementTop < containerTop) {
             suggestionListRef.current.scrollTop = elementTop;
         } else if (elementBottom > containerBottom) {
             suggestionListRef.current.scrollTop = elementBottom - suggestionListRef.current.clientHeight;
         }
      }
    }
  }, [activeIndex]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addSkill = (skill) => {
    if (userSkills.length < 15 && !userSkills.includes(skill)) {
      setUserSkills(prev => [...prev, skill]);
      setSearchQuery('');
      // Maintain focus on input but don't close suggestions
      if (searchRef.current) {
        const input = searchRef.current.querySelector('input');
        if (input) input.focus();
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setUserSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < availableSkills.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < availableSkills.length) {
        addSkill(availableSkills[activeIndex]);
      } else if (availableSkills.length === 1 && searchQuery.trim() !== '') {
        // If there's exactly one match and user hits enter, accept it
        addSkill(availableSkills[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
    navigate('/step-2');
  };

  const isNextDisabled = userSkills.length < 3 || userSkills.length > 15 || !userProfile.education || !userProfile.experience;
  const isMaxSkillsReached = userSkills.length >= 15;

  return (
    <div className="wizard-step animate-fade-in">
      <ProgressIndicator currentStep={1} totalSteps={4} />
      
      <div className="step-header">
        <h1>Tell Us About Yourself</h1>
        <p className="text-muted">This helps us align career matches with your background.</p>
      </div>

      <div className="profile-form">
        <div className="form-group grid md:grid-cols-3 gap-4">
          <div>
            <label>Education Level</label>
            <select name="education" value={userProfile.education} onChange={handleProfileChange} className="form-control">
              <option value="">Select Level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Diploma">Diploma</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Field of Study</label>
            <select name="fieldOfStudy" value={userProfile.fieldOfStudy} onChange={handleProfileChange} className="form-control">
              <option value="">Select Field</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Work Experience</label>
            <select name="experience" value={userProfile.experience} onChange={handleProfileChange} className="form-control">
              <option value="">Select Experience</option>
              <option value="None">No experience</option>
              <option value="0-2">0–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <label>Interests</label>
          <div className="interests-grid">
            {INTERESTS_OPTIONS.map(interest => (
              <div 
                key={interest} 
                className={`interest-card ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Your Professional Skills ({userSkills.length}/15)</label>
          <div className="skill-input-header">
            <p className="text-sm text-muted">Select 3 to 15 skills to help us match you with careers.</p>
            {isMaxSkillsReached && <span className="text-sm font-medium text-error">You can select up to 15 skills.</span>}
          </div>
          
          <div className="skill-search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="form-control search-input" 
                placeholder={isMaxSkillsReached ? "Maximum skills selected" : "Search or select a skill..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                disabled={isMaxSkillsReached}
              />
            </div>
            
            {showSuggestions && !isMaxSkillsReached && (
              <div className="suggestions-dropdown" ref={suggestionListRef}>
                {availableSkills.length > 0 ? (
                  availableSkills.map((skill, index) => (
                    <div 
                      key={skill} 
                      className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => addSkill(skill)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-empty">No skills found.</div>
                )}
              </div>
            )}
          </div>

          <div className="selected-skills-container mt-4">
            {userSkills.map(skill => (
              <SkillPill key={skill} skill={skill} onRemove={removeSkill} variant="primary" />
            ))}
            {userSkills.length === 0 && (
              <span className="text-muted text-sm italic">No skills selected yet.</span>
            )}
          </div>
        </div>

        <div className="step-actions mt-8">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled}>
            Continue <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
