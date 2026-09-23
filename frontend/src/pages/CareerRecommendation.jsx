import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CareerRecommendation() {
  const [skillInput, setSkillInput] = useState('')
  const [description, setDescription] = useState('')

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

  // Save user skills
  useEffect(() => {
    sessionStorage.setItem(
      'userSkills',
      JSON.stringify(skills)
    )
  }, [skills])

  // Load available skills
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
          (data.skills || []).map(
            (item) => item.skill
          )
        )

      } catch (err) {
        console.error(
          'Failed to load skills:',
          err
        )
      }
    }

    fetchSkills()
  }, [])

  // Add skill
  const addSkill = () => {
    const skill = skillInput.trim()

    if (!skill) return

    const matchedSkill = availableSkills.find(
      (item) =>
        item.toLowerCase() ===
        skill.toLowerCase()
    )

    if (!matchedSkill) {
      setError(
        'Please select a skill from the available skill list.'
      )
      return
    }

    if (!skills.includes(matchedSkill)) {
      setSkills([
        ...skills,
        matchedSkill
      ])
    }

    setSkillInput('')
    setError('')
  }

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setSkills(
      skills.filter(
        (skill) =>
          skill !== skillToRemove
      )
    )
  }

  // Get career recommendations
  const getRecommendations = async () => {

    // User must provide either skills or description
    if (
      skills.length === 0 &&
      !description.trim()
    ) {
      setError(
        'Please add at least one skill or enter a description.'
      )
      return
    }

    setLoading(true)
    setError('')

    try {

      let data

      // ==========================================
      // DESCRIPTION-ONLY RECOMMENDATION
      // ==========================================

      if (
        description.trim() &&
        skills.length === 0
      ) {

        const response = await fetch(
          'http://127.0.0.1:5000/api/recommend-description',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              description:
                description,
            }),
          }
        )

        data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
            'Something went wrong.'
          )
        }

        setRecommendations(
          data.recommendations || []
        )

        setMatchedSkills([])
        setUnmatchedSkills([])
        setSkillGap([])
        setSkillGapCareer('')

      }

      // ==========================================
      // SKILL-BASED RECOMMENDATION
      // ==========================================

      else {

        const response = await fetch(
          'http://127.0.0.1:5000/api/recommend',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              skills: skills,
            }),
          }
        )

        data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
            'Something went wrong.'
          )
        }

        setRecommendations(
          data.recommendations || []
        )

        setMatchedSkills(
          data.matched_skills || []
        )

        setUnmatchedSkills(
          data.unmatched_skills || []
        )

        // ==========================================
        // SKILL GAP ANALYSIS
        // ==========================================

        if (
          data.recommendations &&
          data.recommendations.length > 0
        ) {

          const bestCareer =
            data.recommendations[0].career

          setSkillGapCareer(
            bestCareer
          )

          const gapResponse =
            await fetch(
              `http://127.0.0.1:5000/api/skill-gap/${encodeURIComponent(bestCareer)}`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body: JSON.stringify({
                  skills: skills,
                }),
              }
            )

          const gapData =
            await gapResponse.json()

          if (gapResponse.ok) {

            setSkillGap(
              gapData.missing_skills ||
              []
            )

          }
        }
      }

    } catch (err) {

      console.error(err)

      setError(
        'Unable to connect to the recommendation system.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="recommendation-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="recommendation-header">

        <p className="tagline">
          PERSONALIZED CAREER GUIDANCE
        </p>

        <h1>
          Discover Your Best Career Matches
        </h1>

        <p>
          Enter your skills or describe yourself
          and our data-driven recommendation system
          will identify careers that best match
          your profile.
        </p>

      </div>


      <div className="recommendation-container">

        {/* ==========================================
            INPUT CARD
        ========================================== */}

        <div className="skill-input-card">

          <h2>
            What skills do you have?
          </h2>

          <p>
            Add the skills you currently have.
          </p>


          {/* SKILL INPUT */}

          <div className="skill-input-row">

            <input
              type="text"
              value={skillInput}
              onChange={(e) =>
                setSkillInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkill()
                }
              }}
              placeholder="e.g. Python"
              list="skills-list"
            />

            <datalist id="skills-list">

              {availableSkills.map(
                (skill) => (
                  <option
                    value={skill}
                    key={skill}
                  />
                )
              )}

            </datalist>

            <button
              onClick={addSkill}
            >
              Add Skill
            </button>

          </div>


          {/* ==========================================
              DESCRIPTION INPUT
          ========================================== */}

          <div className="description-section">

            <h2>
              Or Describe Yourself
            </h2>

            <p>
              Describe your skills, experience,
              education, interests, and the type
              of work you are interested in.
            </p>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Example: I have experience in Python and SQL. I enjoy working with data, building machine learning models, analyzing datasets and creating visualizations..."
              rows="7"
            />

          </div>


          {/* ==========================================
              SELECTED SKILLS
          ========================================== */}

          <div className="skills-list">

            {skills.map(
              (skill) => (

                <div
                  className="skill-tag"
                  key={skill}
                >

                  {skill}

                  <button
                    onClick={() =>
                      removeSkill(skill)
                    }
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>


          {/* ERROR */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* RECOMMEND BUTTON */}

          <button
            className="recommend-button"
            onClick={
              getRecommendations
            }
            disabled={loading}
          >

            {loading
              ? 'Analyzing Profile...'
              : 'Get Career Recommendations'}

          </button>

        </div>


        {/* ==========================================
            RECOMMENDATION RESULTS
        ========================================== */}

        {recommendations.length > 0 && (

          <div className="results-section">

            <h2>
              Your Career Recommendations
            </h2>

            <p>
              Based on your profile, these careers
              have the strongest similarity to your
              skills or description.
            </p>


            <div className="recommendation-grid">

              {recommendations.map(
                (item, index) => (

                  <Link
                    to={`/career/${encodeURIComponent(
                      item.career
                    )}`}
                    className={`career-result-card ${
                      index === 0
                        ? 'top-career'
                        : ''
                    }`}
                    key={item.career}
                  >

                    <div className="rank">
                      #{index + 1}
                    </div>

                    <h3>
                      {item.career}
                    </h3>

                    <div className="match-score">
                      {
                        item.match_percentage
                      }%
                    </div>

                    <p>
                      Match
                    </p>

                  </Link>

                )
              )}

            </div>


            {/* ==========================================
                SKILL STATUS
            ========================================== */}

            {matchedSkills.length > 0 && (

              <div className="skill-status">

                <div>

                  <h3>
                    Matched Skills
                  </h3>

                  <div className="status-list">

                    {matchedSkills.map(
                      (skill) => (

                        <span
                          className="matched-tag"
                          key={skill}
                        >
                          ✓ {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>


                {unmatchedSkills.length > 0 && (

                  <div>

                    <h3>
                      Skills Not in Dataset
                    </h3>

                    <div className="status-list">

                      {unmatchedSkills.map(
                        (skill) => (

                          <span
                            className="unmatched-tag"
                            key={skill}
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

        )}


        {/* ==========================================
            SKILL GAP ANALYSIS
        ========================================== */}

        {skillGap.length > 0 && (

          <div className="skill-gap-section">

            <h2>
              Skill Gap Analysis
            </h2>

            <h3 className="skill-gap-career">
              Recommended Career: {
                skillGapCareer
              }
            </h3>

            <p>
              These are the important skills
              for your top recommended career
              that are not currently in your
              skill profile. The percentage
              represents how frequently each
              skill appears in job postings
              for this career.
            </p>


            <div className="skill-gap-list">

              {skillGap.map(
                (item) => (

                  <div
                    className="skill-gap-item"
                    key={item.skill}
                  >

                    <div className="skill-gap-info">

                      <span>
                        {item.skill}
                      </span>

                      <strong>
                        {
                          item.demand_percentage
                        }%
                      </strong>

                    </div>


                    <div className="skill-gap-bar-background">

                      <div
                        className="skill-gap-bar"
                        style={{
                          width:
                            `${item.demand_percentage}%`
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default CareerRecommendation