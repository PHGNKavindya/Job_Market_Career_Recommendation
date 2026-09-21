import { useEffect, useState } from 'react'

function Skills() {
  const [skills, setSkills] = useState([])
  const [search, setSearch] = useState('')
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

  const filteredSkills = skills.filter((item) =>
    item.skill.toLowerCase().includes(search.toLowerCase())
  )

  const highestDemand = skills.length > 0
    ? skills[0].demand
    : 1

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

      {/* Header */}

      <div className="skills-header">

        <p className="tagline">
          SKILL MARKET INSIGHTS
        </p>

        <h1>
          Explore In-Demand Skills
        </h1>

        <p>
          Explore the skills identified from job postings
          and understand their demand across the job market.
        </p>

      </div>


      {/* Summary */}

      <div className="skills-summary">

        <div className="skills-summary-card">
          <span>Total Skills</span>
          <strong>{skills.length}</strong>
        </div>

        <div className="skills-summary-card">
          <span>Total Job Postings</span>
          <strong>15,000</strong>
        </div>

        <div className="skills-summary-card">
          <span>Highest Demand</span>
          <strong>
            {skills.length > 0 ? skills[0].skill : '-'}
          </strong>
        </div>

      </div>


      {/* Search */}

      <div className="skills-search">

        <input
          type="text"
          placeholder="Search for a skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* Skills */}

      <div className="skills-container">

        <div className="skills-list-header">

          <div>
            <h2>Skill Demand</h2>

            <p>
              {filteredSkills.length} skill
              {filteredSkills.length !== 1 ? 's' : ''} found
            </p>
          </div>

        </div>


        <div className="skills-grid">

          {filteredSkills.map((item, index) => (

            <div
              className="skill-explorer-card"
              key={item.skill}
            >

              <div className="skill-card-top">

                <span className="skill-number">
                  #{skills.indexOf(item) + 1}
                </span>

                <span className="skill-demand">
                  {item.demand}%
                </span>

              </div>


              <h2>
                {item.skill}
              </h2>


              <p>
                Required in {item.count.toLocaleString()} job postings
              </p>


              <div className="skill-bar-background">

                <div
                  className="skill-bar-fill"
                  style={{
                    width: `${(item.demand / highestDemand) * 100}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>


        {filteredSkills.length === 0 && (

          <div className="skills-empty">
            No skills found matching "{search}".
          </div>

        )}

      </div>

    </div>
  )
}

export default Skills