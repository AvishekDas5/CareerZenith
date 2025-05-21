import os
import ast
import math
import pandas as pd
import re
from flask import Flask, jsonify
from flask_cors import CORS
from google.cloud import firestore
from jobspy import scrape_jobs
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from fuzzywuzzy import fuzz

app = Flask(__name__)
CORS(app)

# Set Google Cloud Firestore credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"service-account-file.json"

# Initialize Firestore
db = firestore.Client()

# Global variable to store the NER pipeline
_ner_pipeline = None

def get_ner_pipeline():
    global _ner_pipeline
    if _ner_pipeline is None:
        model_name = "dslim/bert-base-NER"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForTokenClassification.from_pretrained(model_name)
        _ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
    return _ner_pipeline

# Load course dataset
COURSE_CSV_PATH = "coursera_courses.csv"
courses_df = pd.read_csv(COURSE_CSV_PATH)

# Clean and normalize tags
courses_df["Tags"] = courses_df["Tags"].apply(
    lambda x: [tag.strip(" '[]") for tag in x.split(',')] if isinstance(x, str) else []
)

# Predefined known skills
sales_skills = [
    "communication", "negotiation", "lead generation", "cold calling", "closing deals",
    "CRM", "customer relationship management", "B2B sales", "B2C sales", "sales strategy",
    "product knowledge", "salesforce", "HubSpot", "presentation skills", "active listening",
    "email marketing", "social selling", "pipeline management", "target achievement",
    "market research", "customer service", "networking", "upselling", "cross-selling",
    "objection handling", "sales forecasting", "territory management", "account management",
    "client relationship", "solution selling", "retail sales", "telemarketing", "inside sales",
    "outside sales", "quota attainment", "prospecting", "referral marketing", "pricing strategy",
    "consultative selling", "value proposition", "sales enablement", "customer acquisition",
    "sales analytics", "deal negotiation", "sales operations", "channel sales", "discovery call",
    "follow-up strategies", "competitive analysis", "event selling", "branding", "CRM automation"
]

computer_science_skills = [
    # Programming Languages
    "python", "java", "c++", "c", "html", "css", "javascript", "typescript", "go",
    "ruby", "swift", "rust", "php", "kotlin", "r", "scala", "bash",

    # Web Development
    "react", "vue.js", "angular", "next.js", "node.js", "express.js", "svelte", "tailwind css",
    "bootstrap", "jquery",

    # Backend & API
    "django", "flask", "fastapi", "spring boot", "graphql", "rest api", "microservices",
    "api development", "socket programming",

    # Database
    "sql", "mysql", "postgresql", "sqlite", "oracle", "mongodb", "firebase", "cassandra",
    "redis", "neo4j",

    # DevOps & Tools
    "git", "github", "gitlab", "bitbucket", "docker", "kubernetes", "jenkins",
    "ansible", "terraform", "linux", "bash scripting", "ci/cd", "nginx",

    # Cloud Computing
    "aws", "azure", "gcp", "cloud functions", "serverless", "lambda", "s3", "ec2", "cloud run",

    # AI / ML
    "machine learning", "deep learning", "natural language processing", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "huggingface", "transformers", "openai api",

    # Data Science
    "pandas", "numpy", "matplotlib", "seaborn", "data cleaning", "data analysis",
    "feature engineering", "model evaluation", "data pipelines",

    # Software Engineering
    "object oriented programming", "functional programming", "data structures", "algorithms",
    "system design", "design patterns", "software architecture", "testing", "unit testing",
    "integration testing", "debugging", "code review", "version control",

    # Security
    "cybersecurity", "penetration testing", "vulnerability assessment", "authentication",
    "authorization", "encryption", "network security", "ethical hacking",

    # Other
    "blockchain", "smart contracts", "solidity", "web3", "data engineering", "ETL",
    "data lakes", "hadoop", "spark", "airflow", "big data", "agile", "scrum"
]

# Combined known skills list for validation
known_skills = set(skill.lower() for skill in sales_skills + computer_science_skills)

# --- Utility Functions ---

def safe_type(value):
    return None if value is None or (isinstance(value, float) and math.isnan(value)) else value

def is_noise(skill):
    return len(skill) < 2 or skill in {"a", "an", "the", "is", "us", "u", "to", "in", "on", "of", "and", "for"}

def clean_skills(skill_list):
    return [skill for skill in skill_list if not is_noise(skill)]

SKILL_ALIASES = {
    "java script": "javascript",
    "java-script": "javascript",
    "dev o": "devops",
    "html5": "html",
    "py": "python",
    "ml": "machine learning",
    "ai/ml": "ai",
}

def normalize_alias(skill):
    return SKILL_ALIASES.get(skill.lower(), skill.lower())

def fuzzy_match(text1, text2, threshold=70):
    return fuzz.partial_ratio(text1.lower(), text2.lower()) >= threshold

def is_valid_skill(skill, known_skills, threshold=85):
    """Improved skill validation with exact matching prioritized."""
    # Direct match first (case insensitive)
    if skill.lower() in [ks.lower() for ks in known_skills]:
        return True
    
    # Check for substring matches
    for known_skill in known_skills:
        if skill.lower() in known_skill.lower() or known_skill.lower() in skill.lower():
            # For very short skills, require exact match
            if len(skill) < 3:
                continue
            return True
    
    # Finally try fuzzy matching with higher threshold
    for known_skill in known_skills:
        if fuzzy_match(skill, known_skill, threshold):
            return True
    
    return False

def extract_skills(text):
    """Extract skills using NER and additional pattern matching."""
    if not text:
        return []

    # Extract skills using NER with aggregation strategy
    ner_results = get_ner_pipeline()(text)
    ner_skills = []
    
    for entity in ner_results:
        if entity["entity_group"] in ["ORG", "MISC"]:
            ner_skills.append(entity["word"].lower())

    # Add regex pattern matching for technical skills
    tech_pattern = r'\b(python|java|javascript|react|angular|vue|node\.js|html|css|sql|aws|azure|docker|kubernetes|machine learning|data science)\b'
    pattern_skills = [match.lower() for match in re.findall(tech_pattern, text.lower())]
    
    # Combine skills from both methods
    all_skills = list(set(ner_skills + pattern_skills))
    return list(set(clean_skills(all_skills)))

def get_validated_skills_from_job_descriptions(search_term="software engineer", results_wanted=30):
    """Extract and validate skills from job descriptions - consolidated function for both endpoints."""
    try:
        jobs = scrape_jobs(
            site_name=["indeed", "linkedin", "glassdoor"],
            search_term=search_term,
            location="remote",
            results_wanted=results_wanted,
            hours_old=72,
            country_indeed="USA"
        )

        descriptions = jobs["description"].dropna().tolist()
        all_extracted_skills = []

        # Extract skills from job descriptions
        for desc in descriptions:
            extracted = extract_skills(desc)
            # Apply normalization to standardize terms
            normalized = [normalize_alias(skill) for skill in extracted]
            all_extracted_skills.extend(normalized)

        # Filter skills against known skills list to eliminate hallucinations
        valid_skills = [
            skill for skill in all_extracted_skills
            if is_valid_skill(skill, known_skills)
        ]

        # Get trending skills (most frequently occurring valid skills)
        trending_skills = pd.Series(valid_skills).value_counts().head(10).index.tolist()
        
        print(f"Trending skills after validation: {trending_skills}")
        
        return {
            "valid_skills": valid_skills,
            "trending_skills": trending_skills
        }

    except Exception as e:
        print(f"❌ Error scraping jobs: {e}")
        return {
            "valid_skills": [],
            "trending_skills": []
        }

# --- API Endpoints ---

@app.route('/api/trending_skills', methods=['GET'])
def get_trending_skills():
    """Return trending skills filtered against known skills list."""
    skills_data = get_validated_skills_from_job_descriptions()
    return jsonify(skills_data["trending_skills"])

@app.route('/api/skill_gap_analysis/<uid>', methods=['GET'])
def skill_gap_analysis(uid):
    """Analyze skill gaps for a user with proper filtering of hallucinated skills."""
    # Get user data from Firestore
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"error": "User not found"}), 404

    user_data = user_doc.to_dict()
    
    # Normalize and validate user skills
    raw_user_skills = user_data.get("skills", [])
    user_skills = []
    for skill in raw_user_skills:
        normalized = normalize_alias(skill)
        if is_valid_skill(normalized, known_skills):
            user_skills.append(normalized)
    
    # Get validated skills from job descriptions
    skills_data = get_validated_skills_from_job_descriptions()
    trending_skills = skills_data["trending_skills"]
    
    # Log for debugging
    print(f"User skills after validation: {user_skills}")
    print(f"Trending skills after validation: {trending_skills}")
    
    # Identify missing skills (skills in trending but not in user's profile)
    missing_skills = []
    for skill in trending_skills:
        # Check if this skill or a similar one exists in user skills
        if not any(fuzzy_match(skill, user_skill, 85) for user_skill in user_skills):
            missing_skills.append(skill)
    
    print(f"Missing skills after validation: {missing_skills}")

    # Recommend courses for missing skills
    recommended_courses = []
    for missing_skill in missing_skills:
        for _, row in courses_df.iterrows():
            course_tags = row["Tags"]
            for tag in course_tags:
                if fuzzy_match(missing_skill, tag, 70):
                    recommended_courses.append({
                        "name": row["Name"],
                        "url": row["Url"],
                        "rating": safe_type(row["Rating"]),
                        "difficulty": safe_type(row["Difficulty"]),
                        "tags": course_tags,
                        "for_skill": missing_skill  # Add this to show which skill this course is for
                    })
                    break
    
    # Limit to top 12 recommended courses
    recommended_courses = recommended_courses[:12]

    return jsonify({
        "user_skills": user_skills,
        "trending_skills": trending_skills,
        "missing_skills": missing_skills,
        "recommended_courses": recommended_courses
    })

if __name__ == '__main__':
    app.run(port=5002, debug=True)
