import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Credit Path AI</span>
          </div>
          <div className="nav-buttons">
            <button 
              className="nav-btn signin-btn" 
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
            <button 
              className="nav-btn register-btn" 
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">🚀 AI-Powered Risk Assessment</span>
          </div>
          <h1 className="hero-title">
            Predict Loan Default Risk with
            <span className="gradient-text"> Artificial Intelligence</span>
          </h1>
          <p className="hero-description">
            Transform your lending decisions with cutting-edge machine learning. 
            Analyze credit risk, predict default probabilities, and make smarter 
            loan approvals in seconds.
          </p>
          <div className="hero-buttons">
            <button 
              className="cta-button primary" 
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <span className="button-icon">→</span>
            </button>
            <button 
              className="cta-button secondary" 
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">99.2%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">&lt;2s</div>
              <div className="stat-label">Analysis Time</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Predictions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-description">
            Everything you need to assess credit risk intelligently
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Real-Time Analysis</h3>
            <p className="feature-description">
              Get instant risk assessments and default probability predictions 
              for individual or batch loan applications.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Multi-Factor Scoring</h3>
            <p className="feature-description">
              Comprehensive evaluation based on credit score, income, LTV, DTI, 
              and 20+ other critical financial indicators.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Batch Processing</h3>
            <p className="feature-description">
              Analyze multiple borrower applications simultaneously with 
              comparative insights and portfolio-level risk metrics.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure & Compliant</h3>
            <p className="feature-description">
              Bank-grade security with encrypted data storage and full 
              compliance with lending regulations and privacy standards.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Smart Recommendations</h3>
            <p className="feature-description">
              Receive AI-driven approval recommendations with detailed 
              explanations and risk mitigation strategies.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Easy Integration</h3>
            <p className="feature-description">
              Simple API integration with your existing systems or use our 
              intuitive web interface for instant access.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Three simple steps to smarter lending decisions
          </p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Input Application Data</h3>
            <p className="step-description">
              Enter borrower information including financial details, loan 
              specifications, and credit history through our user-friendly form.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">AI Analyzes Risk</h3>
            <p className="step-description">
              Our machine learning model processes 25+ variables to calculate 
              default probability and assign a risk category.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Get Recommendations</h3>
            <p className="step-description">
              Receive detailed risk assessment with approval recommendations and 
              actionable insights for your lending decision.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Lending?</h2>
          <p className="cta-description">
            Join thousands of lenders making smarter, faster decisions with AI
          </p>
          <button 
            className="cta-button-large" 
            onClick={() => navigate('/register')}
          >
            Get Started Now
            <span className="button-icon">→</span>
          </button>
          <p className="cta-note">No credit card required • Free trial included</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Credit Path AI</span>
          </div>
          <p className="footer-text">
            © 2024 Credit Path AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;