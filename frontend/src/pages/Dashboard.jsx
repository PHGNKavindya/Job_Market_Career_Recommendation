import { useEffect, useState } from 'react'

function Dashboard() {

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCareer, setSelectedCareer] = useState('All')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const response = await fetch(
        `http://127.0.0.1:5000/api/dashboard?career=${encodeURIComponent(selectedCareer)}&industry=${encodeURIComponent(selectedIndustry)}&experience=${encodeURIComponent(selectedExperience)}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error('Failed to load dashboard.')
        }

        setDashboardData(data)

      } catch (err) {

        setError('Unable to load dashboard data.')

      } finally {

        setLoading(false)

      }

    }

    fetchDashboard()

  }, [selectedCareer, selectedIndustry, selectedExperience])


  if (loading) {
    return (
      <div className="dashboard-message">
        Loading Dashboard...
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




  const topCareers =
    [...dashboardData.jobs_by_career]
      .sort((a, b) => b.job_postings - a.job_postings)
      .slice(0, 5)


  const topSkills =
    [...dashboardData.top_skills]
      .sort((a, b) => b.job_postings - a.job_postings)
      .slice(0, 5)


  const topSalaries =
    [...dashboardData.salary_by_career]
      .sort((a, b) => b.average_salary - a.average_salary)
      .slice(0, 5)


  const topIndustries =
    [...dashboardData.jobs_by_industry]
      .sort((a, b) => b.job_postings - a.job_postings)
      .slice(0, 5)


  return (

    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-header">

        <p className="tagline">
          JOB MARKET ANALYTICS
        </p>

        <h1>
          Job Market Insights
        </h1>

        <p>
          Explore career demand, salary trends and the skills
          employers are looking for.
        </p>

        <div className="dashboard-filters">

        <div className="filter-group">

            <label>
            Career
            </label>

            <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            >

            <option value="All">
                All Careers
            </option>

            <option value="Software Engineer">
                Software Engineer
            </option>

            <option value="UX Designer">
                UX Designer
            </option>

            <option value="Product Manager">
                Product Manager
            </option>

            <option value="Data Analyst">
                Data Analyst
            </option>

            <option value="ML Engineer">
                ML Engineer
            </option>

            <option value="Data Engineer">
                Data Engineer
            </option>

            <option value="Data Scientist">
                Data Scientist
            </option>

            <option value="Backend Engineer">
                Backend Engineer
            </option>

            <option value="DevOps Engineer">
                DevOps Engineer
            </option>

            <option value="Research Scientist">
                Research Scientist
            </option>

            </select>

        </div>


        <div className="filter-group">
            <label>Industry</label>

            <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
            >
                <option value="All">All Industries</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
                <option value="media">Media</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="tech">Tech</option>
                <option value="healthcare">Healthcare</option>
            </select>
            </div>


            <div className="filter-group">
            <label>Experience Level</label>

            <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
            >
                <option value="All">All Experience Levels</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="director">Director</option>
            </select>
            </div>

            <button
            className="reset-filter-btn"
            onClick={() => {
                setSelectedCareer('All')
                setSelectedIndustry('All')
                setSelectedExperience('All')
            }}
            >
            Reset Filters
            </button>

        </div>

      </div>


        {/* KPI Cards */}

        <div className="dashboard-summary">

        <div className="summary-card">
            <span className="summary-label">
            JOB POSTINGS
            </span>

            <h2>
            {dashboardData.summary.total_jobs.toLocaleString()}
            </h2>

            <p>
            Analyzed job advertisements
            </p>
        </div>


        <div className="summary-card">
            <span className="summary-label">
            AVERAGE SALARY
            </span>

            <h2>
            {Math.round(
                dashboardData.summary.average_salary
            ).toLocaleString()}
            </h2>

            <p>
            Average across selected jobs
            </p>
        </div>


        <div className="summary-card">
            <span className="summary-label">
            AVG. APPLICATIONS
            </span>

            <h2>
            {dashboardData.summary.average_applications}
            </h2>

            <p>
            Applications per job posting
            </p>
        </div>


        <div className="summary-card">
            <span className="summary-label">
            AVG. DAYS TO FILL
            </span>

            <h2>
            {dashboardData.summary.average_days_to_fill}
            </h2>

            <p>
            Average recruitment time
            </p>
        </div>

        </div>

      {/* Dashboard Grid */}

      <div className="dashboard-grid">


        {/* Top Careers */}

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <h2>
              Job Postings by Career
            </h2>

            <p>
              Top 5 career categories
            </p>

          </div>


          <div className="horizontal-chart">

            {topCareers.map((item) => (

              <div
                className="horizontal-chart-item"
                key={item.career}
              >

                <div className="chart-label">

                  <span>
                    {item.career}
                  </span>

                  <strong>
                    {item.job_postings.toLocaleString()}
                  </strong>

                </div>


                <div className="chart-bar-background">

                  <div
                    className="chart-bar"
                    style={{
                      width: `${
                        (
                          item.job_postings /
                          topCareers[0].job_postings
                        ) * 100
                      }%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* Top Skills */}

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <h2>
              Top In-Demand Skills
            </h2>

            <p>
              Most frequently requested skills
            </p>

          </div>


          <div className="horizontal-chart">

            {topSkills.map((item) => (

              <div
                className="horizontal-chart-item"
                key={item.skill}
              >

                <div className="chart-label">

                  <span>
                    {item.skill}
                  </span>

                  <strong>
                    {item.job_postings.toLocaleString()}
                  </strong>

                </div>


                <div className="chart-bar-background">

                  <div
                    className="chart-bar"
                    style={{
                      width: `${
                        (
                          item.job_postings /
                          topSkills[0].job_postings
                        ) * 100
                      }%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* Salary */}

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <h2>
              Average Salary by Career
            </h2>

            <p>
              Highest average salaries
            </p>

          </div>


          <div className="horizontal-chart">

            {topSalaries.map((item) => (

              <div
                className="horizontal-chart-item"
                key={item.career}
              >

                <div className="chart-label">

                  <span>
                    {item.career}
                  </span>

                  <strong>
                    {Math.round(
                      item.average_salary
                    ).toLocaleString()}
                  </strong>

                </div>


                <div className="chart-bar-background">

                  <div
                    className="chart-bar salary-bar"
                    style={{
                      width: `${
                        (
                          item.average_salary /
                          topSalaries[0].average_salary
                        ) * 100
                      }%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* Industry */}

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <h2>
              Jobs by Industry
            </h2>

            <p>
              Industries with the most postings
            </p>

          </div>


          <div className="horizontal-chart">

            {topIndustries.map((item) => (

              <div
                className="horizontal-chart-item"
                key={item.industry}
              >

                <div className="chart-label">

                  <span>
                    {item.industry}
                  </span>

                  <strong>
                    {item.job_postings.toLocaleString()}
                  </strong>

                </div>


                <div className="chart-bar-background">

                  <div
                    className="chart-bar"
                    style={{
                      width: `${
                        (
                          item.job_postings /
                          topIndustries[0].job_postings
                        ) * 100
                      }%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}

export default Dashboard