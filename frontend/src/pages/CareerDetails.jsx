import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function CareerDetails() {

  const { career } = useParams()

  const [careerData, setCareerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchCareerDetails = async () => {

      try {

        const response = await fetch(
          `http://127.0.0.1:5000/api/career/${encodeURIComponent(career)}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Career not found.')
        }

        setCareerData(data)

      } catch (err) {

        setError('Unable to load career details.')

      } finally {

        setLoading(false)

      }

    }

    fetchCareerDetails()

  }, [career])


  if (loading) {
    return (
      <div className="career-details-page">
        <h2>Loading career details...</h2>
      </div>
    )
  }


  if (error) {
    return (
      <div className="career-details-page">

        <h2>{error}</h2>

        <Link to="/recommendation">
          Back to Recommendations
        </Link>

      </div>
    )
  }


  return (

    <div className="career-details-page">

      <div className="career-details-header">

        <p className="tagline">
          CAREER DETAILS
        </p>

        <h1>
          {careerData.career}
        </h1>

        <p>
          Skills commonly required for this career based on
          the analyzed job postings.
        </p>

      </div>


      <div className="career-details-container">

        <div className="career-skills-card">

          <h2>
            Required Skills
          </h2>

          <p className="career-skills-description">
            The percentage represents the proportion of job
            postings for this career that require each skill.
          </p>


          <div className="career-skills-list">

            {careerData.required_skills.map((item) => (

              <div
                className="career-skill-item"
                key={item.skill}
              >

                <div className="skill-info">

                  <span>
                    {item.skill}
                  </span>

                  <strong>
                    {item.demand_percentage}%
                  </strong>

                </div>


                <div className="skill-bar-background">

                  <div
                    className="skill-bar"
                    style={{
                      width: `${item.demand_percentage}%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        <div className="career-details-actions">

          <Link
            to="/recommendation"
            className="secondary-button"
          >
            ← Back to Recommendations
          </Link>

        </div>

      </div>

    </div>

  )
}

export default CareerDetails