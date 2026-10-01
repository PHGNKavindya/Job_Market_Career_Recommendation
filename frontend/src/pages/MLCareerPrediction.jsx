import { useState } from 'react'

function MLCareerPrediction() {
  const [formData, setFormData] = useState({
    skills: '',
    experience_level: 'entry',
    education_required: 'bachelor',
    industry: 'tech',
    remote_type: 'remote',
    salary_min: '',
    salary_max: ''
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const predictCareer = async (e) => {
    e.preventDefault()

    if (!formData.skills.trim()) {
      setError('Please enter at least one skill.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/predict-career',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            skills: formData.skills,
            experience_level: formData.experience_level,
            education_required: formData.education_required,
            industry: formData.industry,
            remote_type: formData.remote_type,
            salary_min: Number(formData.salary_min) || 0,
            salary_max: Number(formData.salary_max) || 0
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Prediction failed.')
      }

      setResult(data)
    } catch (err) {
      setError(
        err.message ||
        'Unable to connect to the ML prediction service.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ml-prediction-page">

      {/* Header */}
      <div className="ml-prediction-header">
        <p className="tagline">SUPERVISED MACHINE LEARNING</p>

        <h1>Predict Your Career</h1>

        <p>
          Enter the information you know about yourself.
          The trained machine learning model will predict a
          career category based on your profile and job market data.
        </p>
      </div>

      <div className="ml-prediction-container">

        {/* Input Form */}
        <form
          className="ml-prediction-card"
          onSubmit={predictCareer}
        >

          <div className="ml-card-heading">
            <div>
              <h2>Career Prediction Input</h2>

              <p>
                Provide the information you can realistically provide.
              </p>
            </div>
          </div>

          <div className="ml-form-grid">

            {/* Skills */}
            <div className="ml-form-group ml-full">

              <label htmlFor="skills">
                Skills
              </label>

              <input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Python | SQL | Machine Learning | Data Analysis"
              />

              <small>
                Separate skills using | (for example: Python | SQL | Machine Learning).
              </small>

            </div>

            {/* Experience */}
            <div className="ml-form-group">

              <label htmlFor="experience_level">
                Experience Level
              </label>

              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
              >
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="director">Director</option>
              </select>

            </div>

            {/* Education */}
            <div className="ml-form-group">

              <label htmlFor="education_required">
                Education
              </label>

              <select
                id="education_required"
                name="education_required"
                value={formData.education_required}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </select>

            </div>

            {/* Industry */}
            <div className="ml-form-group">

              <label htmlFor="industry">
                Industry
              </label>

              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
                <option value="media">Media</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="healthcare">Healthcare</option>
              </select>

            </div>

            {/* Work Type */}
            <div className="ml-form-group">

              <label htmlFor="remote_type">
                Work Type
              </label>

              <select
                id="remote_type"
                name="remote_type"
                value={formData.remote_type}
                onChange={handleChange}
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>

            </div>

            {/* Minimum Salary */}
            <div className="ml-form-group">

              <label htmlFor="salary_min">
                Minimum Salary
              </label>

              <input
                id="salary_min"
                name="salary_min"
                type="number"
                min="0"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="100000"
              />

            </div>

            {/* Maximum Salary */}
            <div className="ml-form-group">

              <label htmlFor="salary_max">
                Maximum Salary
              </label>

              <input
                id="salary_max"
                name="salary_max"
                type="number"
                min="0"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="150000"
              />

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="ml-error-message">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="ml-predict-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Predicting Career...'
              : 'Predict Career'}
          </button>

        </form>

        {/* Result */}
        {result && (
          <div className="ml-results-section">

            <div className="ml-main-result">

              <p className="ml-result-label">
                PREDICTED CAREER
              </p>

              <h2>
                {result.predicted_career}
              </h2>

              <p>
                Based on the submitted skills, experience,
                education, industry, work type, and salary
                preferences, the model predicted this career category.
              </p>

            </div>

            {/* Matched Skills */}
            {result.matched_skills &&
              result.matched_skills.length > 0 && (
                <div className="ml-matched-skills">

                  <h3>Matched Skills</h3>

                  <div className="ml-skill-list">

                    {result.matched_skills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="ml-skill-tag"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

          </div>
        )}

      </div>
    </div>
  )
}

export default MLCareerPrediction
