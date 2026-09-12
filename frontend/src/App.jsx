import './App.css'

function App() {
  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Career<span>Match</span>
        </div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Career Recommendation</a>
          <a href="#">Career Explorer</a>
          <a href="#">Dashboard</a>
          <a href="#">Skills</a>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="tagline">
            DATA-DRIVEN CAREER GUIDANCE
          </p>

          <h1>
            Find the Career That
            <br />
            <span>Matches Your Skills</span>
          </h1>

          <p className="hero-text">
            Analyze current job market demand, discover the skills
            employers are looking for, and get personalized career
            recommendations based on your skills.
          </p>

          <div className="hero-buttons">
            <button className="primary-button">
              Find My Career
            </button>

            <button className="secondary-button">
              Explore Job Market
            </button>
          </div>

        </div>


        {/* Hero Statistics */}
        <div className="hero-stats">

          <div className="stat-card">
            <h2>15,000+</h2>
            <p>Job Postings</p>
          </div>

          <div className="stat-card">
            <h2>69</h2>
            <p>Skills Analyzed</p>
          </div>

          <div className="stat-card">
            <h2>10</h2>
            <p>Career Paths</p>
          </div>

        </div>

      </section>


      {/* Features */}
      <section className="features">

        <h2>Make Better Career Decisions</h2>

        <p className="section-description">
          Use job market data and skill analysis to understand
          where your skills can take you.
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🎯</div>

            <h3>Career Recommendation</h3>

            <p>
              Enter your skills and receive career recommendations
              based on job market skill requirements.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📊</div>

            <h3>Job Market Insights</h3>

            <p>
              Explore which skills, careers and industries are
              currently in demand.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">🚀</div>

            <h3>Skill Gap Analysis</h3>

            <p>
              Identify the important skills you need to develop
              for your target career.
            </p>
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer>
        <p>
          Job Market Skill Demand Analysis & Career Recommendation System
        </p>

        <p>
          Data Science Capstone Project II
        </p>
      </footer>

    </div>
  )
}

export default App