from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# Load career skill matrix
# --------------------------------------------------

career_skill_matrix = pd.read_csv(
    "data/career_skill_matrix.csv",
    index_col=0
)

# Convert percentages to proportions
career_skill_vectors = career_skill_matrix / 100


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "Job Market Career Recommendation API is running"
    })


# --------------------------------------------------
# Get available careers
# --------------------------------------------------

@app.route("/api/careers")
def get_careers():

    careers = career_skill_vectors.index.tolist()

    return jsonify({
        "careers": careers
    })


# --------------------------------------------------
# Career recommendation
# --------------------------------------------------

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

    # Skills available in our dataset
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
        "recommendations": recommendations[
            ["career", "match_percentage"]
        ].to_dict(orient="records"),

        "matched_skills": matched_skills,

        "unmatched_skills": unmatched_skills
    })


# --------------------------------------------------
# Run application
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)