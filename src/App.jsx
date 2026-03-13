import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext';

import LandingPage from './screens/LandingPage';
import ProfileStep from './screens/ProfileStep';
import CareerSelectionStep from './screens/CareerSelectionStep';
import ComparisonStep from './screens/ComparisonStep';
import PriorityStep from './screens/PriorityStep';
import ResultsPage from './screens/ResultsPage';
import TopNav from './components/ui/TopNav';

function App() {
  return (
    <CareerProvider>
      <BrowserRouter>
        <div className="app-container">
          <TopNav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/step-1" element={<ProfileStep />} />
              <Route path="/step-2" element={<CareerSelectionStep />} />
              <Route path="/step-3" element={<ComparisonStep />} />
              <Route path="/step-4" element={<PriorityStep />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CareerProvider>
  );
}

export default App;
