import { useEffect, useState } from 'react'

function Skills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:5000/api/skills'
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error('Failed to load skills.')
        }

        setSkills(data.skills || [])
      } catch (err) {
        setError('Unable to load skills.')
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading Skills...
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-message">
        {error}
      </div>
    )
  }

  return (
    <div className="skills-page">

      <div className="skills-header">

        <p className="tagline">
          SKILL MARKET INSIGHTS
        </p>

        <h1>
          Explore In-Demand Skills
        </h1>

        <p>
          Explore the skills identified from job postings
          and understand their importance across different careers.
        </p>

      </div>


      <div className="skills-container">

        <div className="skills-summary">

          <div className="skills-summary-card">
            <span>Total Skills</span>
            <strong>{skills.length}</strong>
          </div>

        </div>


        <div className="skills-grid">

          {skills.map((skill, index) => (

            <div
              className="skill-explorer-card"
              key={skill}
            >

              <div className="skill-number">
                #{index + 1}
              </div>

              <h2>
                {skill}
              </h2>

              <p>
                Skill identified from job market data
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Skills