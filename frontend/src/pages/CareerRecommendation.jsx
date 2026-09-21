import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CareerRecommendation() {
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState(() => {
  const savedSkills = sessionStorage.getItem('userSkills')
  return savedSkills ? JSON.parse(savedSkills) : []
  })
  const [availableSkills, setAvailableSkills] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [matchedSkills, setMatchedSkills] = useState([])
  const [unmatchedSkills, setUnmatchedSkills] = useState([])
  const [skillGap, setSkillGap] = useState([])
  const [skillGapCareer, setSkillGapCareer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
  sessionStorage.setItem(
    'userSkills',
    JSON.stringify(skills)
  )
  }, [skills])


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

        setAvailableSkills(
          (data.skills || []).map((item) => item.skill)
        )

      } catch (err) {
        console.error('Failed to load skills:', err)
      }
    }

    fetchSkills()
  }, [])

  const addSkill = () => {
    const skill = skillInput.trim()

    if (!skill) return

    const matchedSkill = availableSkills.find(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    )

    if (!matchedSkill) {
      setError(
        'Please select a skill from the available skill list.'
      )
      return
    }

    if (!skills.includes(matchedSkill)) {
      setSkills([...skills, matchedSkill])
    }

    setSkillInput('')
    setError('')
  }

  const removeSkill = (skillToRemove) => {
    setSkills(
      skills.filter((skill) => skill !== skillToRemove)
    )
  }

  const getRecommendations = async () => {
    if (skills.length === 0) {
      setError('Please add at least one skill.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/recommend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skills: skills,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setRecommendations(data.recommendations || [])
setMatchedSkills(data.matched_skills || [])
setUnmatchedSkills(data.unmatched_skills || [])

// Get skill gap for the top recommended career
if (data.recommendations && data.recommendations.length > 0) {

  const bestCareer = data.recommendations[0].career
  
  setSkillGapCareer(bestCareer)

  const gapResponse = await fetch(
    `http://127.0.0.1:5000/api/skill-gap/${encodeURIComponent(bestCareer)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: skills,
      }),
    }
  )

  const gapData = await gapResponse.json()

  if (gapResponse.ok) {
    setSkillGap(gapData.missing_skills || [])
  }

}

    } catch (err) {
      setError(
        'Unable to connect to the recommendation system.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recommendation-page">

      <div className="recommendation-header">
        <p className="tagline">
          PERSONALIZED CAREER GUIDANCE
        </p>

        <h1>
          Discover Your Best Career Matches
        </h1>

        <p>
          Enter your skills and our data-driven recommendation
          system will identify careers that best match your skill profile.
        </p>
      </div>


      <div className="recommendation-container">

        <div className="skill-input-card">

          <h2>What skills do you have?</h2>

          <p>
            Add the skills you currently have.
          </p>

          <div className="skill-input-row">

            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkill()
                }
              }}
              placeholder="e.g. Python"
              list="skills-list"
            />

            <datalist id="skills-list">
              {availableSkills.map((skill) => (
                <option
                  value={skill}
                  key={skill}
                />
              ))}
            </datalist>

            <button onClick={addSkill}>
              Add Skill
            </button>

          </div>


          <div className="skills-list">

            {skills.map((skill) => (
              <div
                className="skill-tag"
                key={skill}
              >
                {skill}

                <button
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </div>
            ))}

          </div>


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          <button
            className="recommend-button"
            onClick={getRecommendations}
            disabled={loading}
          >
            {loading
              ? 'Analyzing Skills...'
              : 'Get Career Recommendations'}
          </button>

        </div>


        {recommendations.length > 0 && (

          <div className="results-section">

            <h2>Your Career Recommendations</h2>

            <p>
              Based on the skills you provided, these careers
              have the strongest similarity to your skill profile.
            </p>


            <div className="recommendation-grid">

              {recommendations.map((item, index) => (

                <Link
                  to={`/career/${encodeURIComponent(item.career)}`}
                  className={`career-result-card ${
                    index === 0 ? 'top-career' : ''
                  }`}
                  key={item.career}
                >

                  <div className="rank">
                    #{index + 1}
                  </div>

                  <h3>{item.career}</h3>

                  <div className="match-score">
                    {item.match_percentage}%
                  </div>

                  <p>
                    Skill Match
                  </p>

                </Link>

              ))}

            </div>


            <div className="skill-status">

              <div>

                <h3>Matched Skills</h3>

                <div className="status-list">

                  {matchedSkills.map((skill) => (
                    <span
                      className="matched-tag"
                      key={skill}
                    >
                      ✓ {skill}
                    </span>
                  ))}

                </div>

              </div>


              {unmatchedSkills.length > 0 && (

                <div>

                  <h3>Skills Not in Dataset</h3>

                  <div className="status-list">

                    {unmatchedSkills.map((skill) => (
                      <span
                        className="unmatched-tag"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

              )}

            </div>

          </div>

        )}

        {skillGap.length > 0 && (

  <div className="skill-gap-section">

    <h2>
      Skill Gap Analysis
    </h2>

    <h3 className="skill-gap-career">
      Recommended Career: {skillGapCareer}
    </h3>

    <p>
      These are the important skills for your top recommended
      career that are not currently in your skill profile.
      The percentage represents how frequently each skill
      appears in job postings for this career.
    </p>

    <div className="skill-gap-list">

      {skillGap.map((item) => (

        <div
          className="skill-gap-item"
          key={item.skill}
        >

          <div className="skill-gap-info">

            <span>
              {item.skill}
            </span>

            <strong>
              {item.demand_percentage}%
            </strong>

          </div>

          <div className="skill-gap-bar-background">

            <div
              className="skill-gap-bar"
              style={{
                width: `${item.demand_percentage}%`
              }}
            />

          </div>

        </div>

      ))}

    </div>

  </div>

)}

      </div>

    </div>
    
  )
}

export default CareerRecommendation