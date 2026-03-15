import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    let storedSessionId = localStorage.getItem('pathfinder_session_id');
    
    if (!storedSessionId) {
      // Generate a new UUID-like session ID
      storedSessionId = crypto.randomUUID();
      localStorage.setItem('pathfinder_session_id', storedSessionId);
    }
    
    setSessionId(storedSessionId);
    setLoading(false);
  }, []);

  const value = {
    user: sessionId ? { id: sessionId } : null, // Maintain 'user' shape for compatibility
    sessionId,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
