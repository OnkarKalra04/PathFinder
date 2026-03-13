import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Target, Compass, Award, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useCareerContext();

  const handleStart = () => {
    setCurrentStep(1);
    navigate('/step-1');
  };

  return (
    <div className="landing-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <h1 className="hero-title">Make Smarter Career Decisions</h1>
        <p className="hero-subtitle text-muted">
          Compare career paths, understand what matters most to you, and discover the skills you need to grow.
        </p>
        <Button size="lg" onClick={handleStart} className="hero-cta">
          Start Career Match <ArrowRight size={20} style={{ marginLeft: '8px' }} />
        </Button>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="section-header text-center">
          <h2>Choosing the Right Career Is Hard</h2>
          <p className="text-muted">
            Career information is scattered and difficult to compare. Salary potential, work-life balance, networking opportunities, and learning potential are rarely presented in a structured, actionable way.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <div className="section-header text-center">
          <h2>A Structured Way to Compare Careers</h2>
          <p className="text-muted">
            Our tool allows you to compare careers side-by-side, set your personal priorities, and discover exactly which skills you need to build next.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="text-center" style={{ marginBottom: 'var(--space-6)' }}>How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="static-step-card text-center">
            <div className="step-icon">
              <Compass size={32} />
            </div>
            <h3>Step 1</h3>
            <p className="step-card-title">Tell us about yourself</p>
            <p className="text-muted text-sm mt-2">Enter your current education, experience, and professional skills.</p>
          </Card>
          
          <Card className="static-step-card text-center">
            <div className="step-icon">
              <Target size={32} />
            </div>
            <h3>Step 2</h3>
            <p className="step-card-title">Compare career paths</p>
            <p className="text-muted text-sm mt-2">Select the careers you're interested in and compare them across key factors.</p>
          </Card>
          
          <Card className="static-step-card text-center">
            <div className="step-icon">
              <Award size={32} />
            </div>
            <h3>Step 3</h3>
            <p className="step-card-title">Get your career match</p>
            <p className="text-muted text-sm mt-2">Weigh your priorities to calculate your personalized career match score.</p>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bottom-cta text-center">
        <Button size="lg" onClick={handleStart}>
          Start Career Match
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
