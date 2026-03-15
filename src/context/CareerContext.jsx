import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CareerContext = createContext();

export const useCareerContext = () => useContext(CareerContext);

export const CareerProvider = ({ children }) => {
  const { sessionId } = useAuth();
  
  // Navigation State
  const [currentStep, setCurrentStep] = useState(1);

  // Profile & Skills State (Step 1)
  const [userProfile, setUserProfile] = useState({
    name: '',
    education: '',
    fieldOfStudy: '',
    experience: ''
  });
  const [userSkills, setUserSkills] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  // Career Selection State (Step 2)
  const [selectedCareers, setSelectedCareers] = useState([]);

  // Priorities State (Step 4)
  const [priorities, setPriorities] = useState({
    salary: 25,
    wlb: 25,
    networking: 25,
    learning: 25
  });

  // Saved Roadmaps State
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [activeTab, setActiveTab] = useState('my-careers');

  // Load data from Supabase on mount/auth change
  useEffect(() => {
    if (sessionId) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (data && !error) {
          setUserProfile(data.profile || { name: '', education: '', fieldOfStudy: '', experience: '' });
          setUserSkills(data.skills || []);
          setUserInterests(data.interests || []);
          setSelectedCareers(data.selected_careers || []);
          setPriorities(data.priorities || { salary: 25, wlb: 25, networking: 25, learning: 25 });
          setSavedRoadmaps(data.saved_roadmaps || []);
        }
      };
      fetchData();
    }
  }, [sessionId]);

  // Sync data to Supabase
  useEffect(() => {
    if (sessionId) {
      const syncData = async () => {
        const { error } = await supabase.from('profiles').upsert({
          id: sessionId,
          profile: userProfile,
          interests: userInterests,
          skills: userSkills,
          selected_careers: selectedCareers,
          priorities: priorities,
          saved_roadmaps: savedRoadmaps,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error('Failed to sync data to Supabase:', error);
        }
      };
      
      const timeoutId = setTimeout(syncData, 1000); // Debounce sync
      return () => clearTimeout(timeoutId);
    }
  }, [sessionId, userProfile, userInterests, userSkills, selectedCareers, priorities, savedRoadmaps]);

  const saveRoadmap = (career) => {
    if (!savedRoadmaps.find(r => r.id === career.id)) {
      setSavedRoadmaps([...savedRoadmaps, career]);
    }
  };

  const unsaveRoadmap = (careerId) => {
    setSavedRoadmaps(savedRoadmaps.filter(r => r.id !== careerId));
  };

  const value = {
    currentStep,
    setCurrentStep,
    userProfile,
    setUserProfile,
    userSkills,
    setUserSkills,
    userInterests,
    setUserInterests,
    selectedCareers,
    setSelectedCareers,
    priorities,
    setPriorities,
    savedRoadmaps,
    saveRoadmap,
    unsaveRoadmap,
    activeTab,
    setActiveTab
  };

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
};
