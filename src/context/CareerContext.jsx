import { createContext, useContext, useState } from 'react';

const CareerContext = createContext();

export const useCareerContext = () => useContext(CareerContext);

export const CareerProvider = ({ children }) => {
  // Navigation State
  const [currentStep, setCurrentStep] = useState(1);

  // Profile & Skills State (Step 1)
  const [userProfile, setUserProfile] = useState({
    education: '',
    fieldOfStudy: '',
    experience: ''
  });
  const [userSkills, setUserSkills] = useState([]);

  // Career Selection State (Step 2)
  const [selectedCareers, setSelectedCareers] = useState([]);

  // Priorities State (Step 4)
  const [priorities, setPriorities] = useState({
    salary: 25,
    wlb: 25,
    networking: 25,
    learning: 25
  });

  const value = {
    currentStep,
    setCurrentStep,
    userProfile,
    setUserProfile,
    userSkills,
    setUserSkills,
    selectedCareers,
    setSelectedCareers,
    priorities,
    setPriorities
  };

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
};
