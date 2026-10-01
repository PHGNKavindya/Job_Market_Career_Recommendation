function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <p className="tagline">ABOUT CAREERMATCH</p>
        <h1>Data-Driven Career Guidance</h1>
        <p>
          A web-based system that combines job-market analysis, NLP, recommendation
          techniques, and supervised machine learning to support career exploration.
        </p>
      </div>

      <div className="about-content">
        <section className="about-card about-card-wide">
          <p className="about-kicker">PROJECT OVERVIEW</p>
          <h2>Job Market Skill Demand Analysis & Career Recommendation System</h2>
          <p>
            CareerMatch analyzes a dataset of 15,000 job postings to identify skill demand
            across 10 career categories. The system converts job-market skill information
            into career profiles and provides users with career recommendations and skill-gap
            information.
          </p>
          <p>
            A supervised machine learning component was also developed to predict a career
            category from seven user-available features: skills, experience level, education,
            industry, work type, expected minimum salary, and expected maximum salary.
          </p>
        </section>

        <section className="about-card-grid">
          <div className="about-card">
            <div className="about-icon">📊</div>
            <h3>Job Market Analysis</h3>
            <p>
              Explores careers, industries, experience levels, salaries, remote work,
              and skill demand using the job-posting dataset.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🎯</div>
            <h3>Career Recommendation</h3>
            <p>
              Uses career-skill profiles and cosine similarity to identify careers that
              have the strongest match with the user's selected skills.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🤖</div>
            <h3>ML Career Prediction</h3>
            <p>
              Compares Logistic Regression, Random Forest, SVM, and Gradient Boosting
              before integrating the selected SVM model into the application.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🧩</div>
            <h3>Skill-Gap Analysis</h3>
            <p>
              Identifies additional skills associated with a selected career that are not
              currently included in the user's skill profile.
            </p>
          </div>
        </section>

        <section className="about-card about-card-wide">
          <p className="about-kicker">MACHINE LEARNING EVALUATION</p>
          <h2>Career Prediction Model Comparison</h2>
          <p>
            Four supervised machine learning models were evaluated using a stratified 80/20
            train-test split. Accuracy, macro precision, macro recall, and macro F1-score were
            used to compare the models.
          </p>
          <div className="model-table-wrap">
            <table className="model-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="selected-model">
                  <td><strong>SVM</strong> <span className="selected-label">DEPLOYED</span></td>
                  <td>98.80%</td>
                  <td>98.84%</td>
                  <td>98.81%</td>
                  <td>98.80%</td>
                </tr>
                <tr>
                  <td><strong>Random Forest</strong></td>
                  <td>98.63%</td>
                  <td>98.63%</td>
                  <td>98.64%</td>
                  <td>98.63%</td>
                </tr>
                <tr>
                  <td><strong>Logistic Regression</strong></td>
                  <td>98.43%</td>
                  <td>98.43%</td>
                  <td>98.43%</td>
                  <td>98.43%</td>
                </tr>
                <tr>
                  <td><strong>Gradient Boosting</strong></td>
                  <td>98.33%</td>
                  <td>98.34%</td>
                  <td>98.34%</td>
                  <td>98.33%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="about-card about-card-wide">
          <p className="about-kicker">TECHNOLOGY</p>
          <div className="technology-list">
            <span>Python</span>
            <span>Pandas</span>
            <span>Scikit-learn</span>
            <span>Flask</span>
            <span>React</span>
            <span>Vite</span>
            <span>JavaScript</span>
            <span>HTML / CSS</span>
          </div>
        </section>

        <section className="about-card about-card-wide project-note-card">
          <p className="about-kicker">PURPOSE</p>
          <h2>Supporting informed career exploration</h2>
          <p>
            CareerMatch is designed as a career exploration support tool. Its results are
            based on the analyzed job-market dataset and user-provided information and are
            intended to help users explore career options and understand skill requirements.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
