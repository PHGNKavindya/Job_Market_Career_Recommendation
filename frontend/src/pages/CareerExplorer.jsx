import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function CareerExplorer() {

  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchCareers = async () => {

      try {

        const response = await fetch(
          'http://127.0.0.1:5000/api/careers'
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error('Unable to load careers.')
        }

        setCareers(data.careers || [])

      } catch (err) {

        setError('Unable to connect to the career database.')

      } finally {

        setLoading(false)

      }

    }

    fetchCareers()

  }, [])


  if (loading) {
    return (
      <div className="career-explorer-page">
        <div className="explorer-message">
          Loading careers...
        </div>
      </div>
    )
  }


  if (error) {
    return (
      <div className="career-explorer-page">
        <div className="explorer-message">
          {error}
        </div>
      </div>
    )
  }


  return (

    <div className="career-explorer-page">

      <div className="career-explorer-header">

        <p className="tagline">
          CAREER EXPLORER
        </p>

        <h1>
          Explore Career Paths
        </h1>

        <p>
          Explore the career paths identified from our analysis
          of job market skill requirements.
        </p>

      </div>


      <div className="career-explorer-container">

        <div className="career-explorer-grid">

          {careers.map((career, index) => (

            <Link
              to={`/career/${encodeURIComponent(career)}`}
              className="career-explorer-card"
              key={career}
            >

              <div className="career-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <h2>
                {career}
              </h2>

              <p>
                View required skills and market demand
              </p>

              <span className="explore-link">
                Explore Career →
              </span>

            </Link>

          ))}

        </div>

      </div>

    </div>

  )
}

export default CareerExplorer