function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <p className="tagline">ABOUT THE SYSTEM</p>

        <h1>
          Job Market Career Recommendation System
        </h1>

        <p>
          A data-driven web application that analyzes job market
          skill demand and provides personalized career
          recommendations and skill-gap analysis.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h2>What This System Does</h2>
          <p>
            The system analyzes job postings to identify
            in-demand skills, career requirements, salary
            patterns, and other job market characteristics.
          </p>
        </div>

        <div className="about-card">
          <h2>Career Recommendation</h2>
          <p>
            Users can enter their skills and receive career
            recommendations based on similarity between their
            skill profile and career skill-demand profiles.
          </p>
        </div>

        <div className="about-card">
          <h2>Skill Gap Analysis</h2>
          <p>
            The system identifies important skills that are
            missing from a user's profile for a selected career.
          </p>
        </div>

        <div className="about-card">
          <h2>Technology</h2>
          <p>
            The project uses Python, Flask, React, Pandas,
            Scikit-learn, NLP techniques, and Machine Learning.
          </p>
        </div>
      </div>

      <div className="methodology-card">
        <h2>Methodology</h2>

        <div className="methodology-steps">
          <div>
            <span>01</span>
            <h3>Data Analysis</h3>
            <p>
              Analyze job postings and identify market trends.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>NLP Analysis</h3>
            <p>
              Process job descriptions and extract important
              terms and skills.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Skill Matching</h3>
            <p>
              Compare user skills with career skill profiles.
            </p>
          </div>

          <div>
            <span>04</span>
            <h3>Recommendation</h3>
            <p>
              Generate career recommendations and identify
              skill gaps.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About