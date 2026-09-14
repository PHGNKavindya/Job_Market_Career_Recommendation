from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


app = Flask(__name__)
CORS(app)


# ==================================================
# Load Career Skill Matrix
# ==================================================

career_skill_matrix = pd.read_csv(
    "data/career_skill_matrix.csv",
    index_col=0
)

# Convert percentages to proportions
career_skill_vectors = career_skill_matrix / 100


# ==================================================
# Load Job Market Dataset
# ==================================================

job_data = pd.read_csv(
    "data/job_postings_processed.csv"
)

job_data["posted_date"] = pd.to_datetime(
    job_data["posted_date"]
)


# ==================================================
# Home
# ==================================================

@app.route("/")
def home():

    return jsonify({
        "message": "Job Market Career Recommendation API is running"
    })


# ==================================================
# Get Available Careers
# ==================================================

@app.route("/api/careers")
def get_careers():

    careers = career_skill_vectors.index.tolist()

    return jsonify({
        "careers": careers
    })


# ==================================================
# Career Recommendation
# ==================================================

@app.route("/api/recommend", methods=["POST"])
def recommend_careers():

    data = request.get_json()

    user_skills = data.get("skills", [])

    if not user_skills:

        return jsonify({
            "error": "Please provide at least one skill."
        }), 400


    # Clean skill names
    user_skills = [
        skill.strip()
        for skill in user_skills
        if isinstance(skill, str)
    ]


    # Skills available in dataset
    matched_skills = [
        skill
        for skill in user_skills
        if skill in career_skill_vectors.columns
    ]


    # Skills not available in dataset
    unmatched_skills = [
        skill
        for skill in user_skills
        if skill not in career_skill_vectors.columns
    ]


    # Create user skill vector
    user_vector = pd.Series(
        0,
        index=career_skill_vectors.columns,
        dtype=float
    )


    for skill in matched_skills:

        user_vector[skill] = 1


    # Calculate cosine similarity
    similarity_scores = cosine_similarity(
        user_vector.values.reshape(1, -1),
        career_skill_vectors.values
    )[0]


    # Create recommendation results
    recommendations = pd.DataFrame({

        "career": career_skill_vectors.index,

        "similarity_score": similarity_scores

    })


    recommendations["match_percentage"] = (
        recommendations["similarity_score"] * 100
    ).round(2)


    recommendations = recommendations.sort_values(
        "similarity_score",
        ascending=False
    )


    recommendations = recommendations.head(5)


    return jsonify({

        "recommendations":
            recommendations[
                ["career", "match_percentage"]
            ].to_dict(orient="records"),

        "matched_skills":
            matched_skills,

        "unmatched_skills":
            unmatched_skills

    })


# ==================================================
# Career Details
# ==================================================

@app.route("/api/career/<career>")
def get_career_details(career):

    if career not in career_skill_vectors.index:

        return jsonify({
            "error": "Career not found."
        }), 404


    career_profile = career_skill_vectors.loc[career]


    required_skills = career_profile[
        career_profile > 0
    ].sort_values(ascending=False)


    skills = []


    for skill, demand in required_skills.items():

        skills.append({

            "skill": skill,

            "demand_percentage":
                round(float(demand * 100), 2)

        })


    return jsonify({

        "career": career,

        "required_skills": skills

    })


# ==================================================
# Skill Gap Analysis
# ==================================================

@app.route("/api/skill-gap/<career>", methods=["POST"])
def get_skill_gap(career):

    if career not in career_skill_vectors.index:

        return jsonify({
            "error": "Career not found."
        }), 404


    data = request.get_json()

    user_skills = data.get("skills", [])


    if not user_skills:

        return jsonify({
            "error": "Please provide at least one skill."
        }), 400


    # Clean user skills
    user_skills = [
        skill.strip()
        for skill in user_skills
        if isinstance(skill, str)
    ]


    # Skills available in dataset
    available_skills = career_skill_vectors.columns


    matched_skills = [
        skill
        for skill in user_skills
        if skill in available_skills
    ]


    unmatched_skills = [
        skill
        for skill in user_skills
        if skill not in available_skills
    ]


    # Get required skills for career
    career_profile = career_skill_vectors.loc[career]


    required_skills = career_profile[
        career_profile > 0
    ].sort_values(ascending=False)


    # Find missing skills
    missing_skills = required_skills[
        ~required_skills.index.isin(matched_skills)
    ]


    skill_gap = []


    for skill, demand in missing_skills.items():

        skill_gap.append({

            "skill": skill,

            "demand_percentage":
                round(float(demand * 100), 2)

        })


    return jsonify({

        "career": career,

        "matched_skills":
            matched_skills,

        "unmatched_skills":
            unmatched_skills,

        "missing_skills":
            skill_gap

    })


# ==================================================
# Job Market Dashboard
# ==================================================

@app.route("/api/dashboard")
def get_dashboard_data():

    # --------------------------------------------------
    # Get optional filters
    # --------------------------------------------------

    career_filter = request.args.get("career")
    industry_filter = request.args.get("industry")
    experience_filter = request.args.get("experience")


    # --------------------------------------------------
    # Create filtered dataset
    # --------------------------------------------------

    filtered_data = job_data.copy()


    if career_filter and career_filter != "All":

        filtered_data = filtered_data[
            filtered_data["title"] == career_filter
        ]


    if industry_filter and industry_filter != "All":

        filtered_data = filtered_data[
            filtered_data["industry"] == industry_filter
        ]

    if experience_filter and experience_filter != "All":
        filtered_data = filtered_data[
            filtered_data["experience_level"] == experience_filter
        ]


    # --------------------------------------------------
    # Basic Statistics
    # --------------------------------------------------

    total_jobs = len(filtered_data)

    total_careers = filtered_data["title"].nunique()


    # --------------------------------------------------
    # Extract Skills
    # --------------------------------------------------

    skills = (
        filtered_data["required_skills"]
        .str.split("|")
        .explode()
        .str.strip()
    )


    total_skills = skills.nunique()


    # --------------------------------------------------
    # Jobs by Career
    # --------------------------------------------------

    career_counts = (
        filtered_data["title"]
        .value_counts()
        .reset_index()
    )


    career_counts.columns = [
        "career",
        "job_postings"
    ]


    # --------------------------------------------------
    # Average Salary by Career
    # --------------------------------------------------

    salary_by_career = (
        filtered_data
        .groupby("title")["salary_avg"]
        .mean()
        .round(2)
        .reset_index()
    )


    salary_by_career.columns = [
        "career",
        "average_salary"
    ]


    # --------------------------------------------------
    # Jobs by Industry
    # --------------------------------------------------

    industry_counts = (
        filtered_data["industry"]
        .value_counts()
        .reset_index()
    )


    industry_counts.columns = [
        "industry",
        "job_postings"
    ]


    # --------------------------------------------------
    # Jobs by Experience Level
    # --------------------------------------------------

    experience_counts = (
        filtered_data["experience_level"]
        .value_counts()
        .reset_index()
    )


    experience_counts.columns = [
        "experience_level",
        "job_postings"
    ]


    # --------------------------------------------------
    # Jobs by Remote Type
    # --------------------------------------------------

    remote_counts = (
        filtered_data["remote_type"]
        .value_counts()
        .reset_index()
    )


    remote_counts.columns = [
        "remote_type",
        "job_postings"
    ]


    # --------------------------------------------------
    # Jobs by Year
    # --------------------------------------------------

    yearly_counts = (
        filtered_data["posted_date"]
        .dt.year
        .value_counts()
        .sort_index()
        .reset_index()
    )


    yearly_counts.columns = [
        "year",
        "job_postings"
    ]


    # --------------------------------------------------
    # Top Skills
    # --------------------------------------------------

    skill_counts = skills.value_counts().head(10)


    top_skills = pd.DataFrame({

        "skill": skill_counts.index,

        "job_postings": skill_counts.values

    })


    # --------------------------------------------------
    # Return Dashboard Data
    # --------------------------------------------------

    return jsonify({

        "summary": {
        "total_jobs": int(total_jobs),
        "total_careers": int(total_careers),
        "total_skills": int(total_skills),
        "average_salary": round(
            float(filtered_data["salary_avg"].mean()), 2
        ),
        "average_applications": round(
            float(filtered_data["applications"].mean()), 2
        ),
        "average_days_to_fill": round(
            float(filtered_data["days_to_fill"].mean()), 2
        )
    },


        "jobs_by_career":
            career_counts.to_dict(
                orient="records"
            ),


        "salary_by_career":
            salary_by_career.to_dict(
                orient="records"
            ),


        "jobs_by_industry":
            industry_counts.to_dict(
                orient="records"
            ),


        "jobs_by_experience":
            experience_counts.to_dict(
                orient="records"
            ),


        "jobs_by_remote":
            remote_counts.to_dict(
                orient="records"
            ),


        "jobs_by_year":
            yearly_counts.to_dict(
                orient="records"
            ),


        "top_skills":
            top_skills.to_dict(
                orient="records"
            )

    })


# ==================================================
# Run Application
# ==================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )