import React from 'react';
import { useCareerContext } from '../../context/CareerContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Star, Map } from 'lucide-react';

const BottomNav = () => {
  const { activeTab, setActiveTab, currentStep } = useCareerContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on landing page or if user hasn't started the journey potentially
  // However, the user says "regardless of which section", so I'll show it 
  // if they are not on the very first landing page.
  if (location.pathname === '/') return null;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (location.pathname !== '/results') {
      navigate('/results');
    }
  };

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        <button 
          className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => handleTabClick('explore')}
        >
          <Sparkles size={20} />
          <span>Explore</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'my-careers' ? 'active' : ''}`}
          onClick={() => handleTabClick('my-careers')}
        >
          <Star size={20} />
          <span>My Careers</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'roadmaps' ? 'active' : ''}`}
          onClick={() => handleTabClick('roadmaps')}
        >
          <Map size={20} />
          <span>Roadmaps</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
