import os
from flask import Flask, jsonify
from flask_cors import CORS
from google.cloud import firestore
from jobspy import scrape_jobs
import pandas as pd
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
from fuzzywuzzy import fuzz
import re

app = Flask(__name__)
CORS(app)

# Set Firestore credentials explicitly
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"service-account-file.json"
print("✅ Google credentials set")

# Initialize Firestore client
db = firestore.Client()
print("✅ Firestore initialized")

# Load Named Entity Recognition (NER) model for extracting skills
model_name = "dslim/bert-base-NER"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer)
print("✅ Hugging Face modules imported")

# Define common technical skills for better extraction
COMMON_SKILLS = [
    # Frontend
    "javascript", "html", "css", "react", "angular", "vue", "jquery", "typescript",
    "redux", "webpack", "babel", "sass", "less", "bootstrap", "tailwind", "material-ui",
    "responsive design", "web components", "pwa", "spa", "ssr",
    
    # Backend
    "node.js", "express", "django", "flask", "spring", "ruby on rails", "laravel",
    "asp.net", "php", "java", "python", "c#", "c++", "go", "rust", "kotlin", "scala",
    
    # Database
    "sql", "mysql", "postgresql", "mongodb", "firebase", "dynamodb", "redis", "elasticsearch",
    "cassandra", "oracle", "sqlite", "mariadb", "neo4j", "graphql",
    
    # DevOps & Cloud
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
    "terraform", "ansible", "chef", "puppet", "prometheus", "grafana", "elk stack",
    "ci/cd", "microservices", "serverless",
    
    # Mobile
    "android", "ios", "swift", "react native", "flutter", "xamarin", "ionic", "cordova",
    "kotlin", "objective-c", "mobile development",
    
    # Other
    "git", "rest api", "soap", "json", "xml", "agile", "scrum", "tdd", "bdd",
    "machine learning", "ai", "data science", "big data", "blockchain",
    "security", "oauth", "jwt", "websockets", "testing", "ui/ux"
]

def extract_skills_from_text(description):
    """
    Enhanced function to extract skills from job descriptions.
    """
    if not description or not isinstance(description, str):
        return []
    
    description = description.lower()
    found_skills = []
    
    # First pass: Check for exact matches with word boundaries
    for skill in COMMON_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, description):
            found_skills.append(skill)
    
    # Second pass: Check for skills with variations (e.g., "React.js" vs "React")
    for skill in COMMON_SKILLS:
        if skill not in found_skills:
            # Handle cases like "react.js", "react js", etc.
            variations = [
                skill.replace(".", " "),
                skill.replace(" ", "."),
                skill.replace(".", ""),
                skill + ".js" if not skill.endswith(".js") and not skill.endswith(" js") else skill
            ]
            
            for variation in variations:
                pattern = r'\b' + re.escape(variation) + r'\b'
                if re.search(pattern, description):
                    found_skills.append(skill)  # Add the standardized version
                    break
    
    # Third pass: Check for skills mentioned in context
    skill_contexts = {
        "react": ["component", "jsx", "hooks", "redux"],
        "python": ["django", "flask", "pandas", "numpy", "scipy"],
        "java": ["spring", "hibernate", "maven", "gradle"],
        "cloud": ["aws", "azure", "gcp", "serverless"]
    }
    
    for context_skill, indicators in skill_contexts.items():
        if context_skill not in found_skills:
            for indicator in indicators:
                if indicator in description and indicator not in found_skills:
                    found_skills.append(context_skill)
                    break
    
    # Use NER as a backup for any remaining skills
    try:
        ner_results = ner_pipeline(description[:512])  # Limit text length to avoid errors
        for entity in ner_results:
            if entity["entity"].startswith("B-") or entity["entity"].startswith("I-"):
                skill = entity["word"].replace("##", "").lower()  # Clean word tokens
                # Only add if it's a plausible skill (length > 2 and not already found)
                if len(skill) > 2 and skill not in found_skills:
                    # Additional validation - check if it might be a technical term
                    if any(tech_term in skill for tech_term in ["dev", "code", "program", "script", "tech"]):
                        found_skills.append(skill)
    except Exception as e:
        print(f"NER extraction error: {e}")
    
    return found_skills

def extract_skills_from_title(title):
    """Extract likely skills from job title"""
    if not title or not isinstance(title, str):
        return []
    
    title = title.lower()
    found_skills = []
    
    # Common job title patterns that indicate skills
    title_skill_mapping = {
        "java developer": ["java", "spring", "hibernate"],
        "python developer": ["python", "django", "flask"],
        "frontend developer": ["javascript", "html", "css", "react"],
        "backend developer": ["api", "database", "server"],
        "full stack": ["frontend", "backend", "full-stack"],
        "node": ["node.js", "javascript", "express"],
        "react": ["react", "javascript", "frontend"],
        "angular": ["angular", "typescript", "frontend"],
        "devops": ["docker", "kubernetes", "ci/cd"],
        "data scientist": ["python", "machine learning", "data analysis"],
        "mobile developer": ["mobile development", "android", "ios"]
    }
    
    for pattern, skills in title_skill_mapping.items():
        if pattern in title:
            found_skills.extend(skills)
    
    return list(set(found_skills))  # Remove duplicates

def fuzzy_match(text1, text2, threshold=60):
    """
    Returns True if the similarity between text1 and text2 is above the threshold.
    """
    if not text1 or not text2:
        return False
    return fuzz.partial_ratio(str(text1).lower(), str(text2).lower()) >= threshold

@app.route('/api/recommend_jobs/<uid>', methods=['GET'])
def recommend_jobs(uid):
    """
    Fetches jobs from Firestore and scraped data, extracts skills dynamically,
    then filters jobs based on user's preferences and skills using fuzzy matching.
    """
    print(f"Received UID: {uid}")
    # Fetch user preferences from Firestore
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        print(f"❌ User {uid} not found in Firestore")
        return jsonify({"error": "User not found"}), 404

    user_data = user_doc.to_dict()
    print(f"🔍 User Data: {user_data}")

    preferred_role = user_data.get("preferred_role", "").lower()
    user_skills = [skill.lower() for skill in user_data.get("skills", [])]
    location = user_data.get("location", "").lower()

    # ✅ Fetch jobs from Firestore
    jobs_ref = db.collection('jobs')
    job_docs = jobs_ref.stream()
    
    firestore_jobs = []
    for job_doc in job_docs:
        job_data = job_doc.to_dict()
        
        # Extract skills from job description
        job_skills = extract_skills_from_text(job_data.get("description", ""))
        
        firestore_jobs.append({
            "title": job_data.get("job_title", ""),
            "company": job_data.get("company", ""),
            "location": job_data.get("location", ""),
            "description": job_data.get("description", ""),
            "url": job_data.get("url", ""),
            "skills": job_skills,
            "source": "firestore"
        })
    
    firestore_jobs_df = pd.DataFrame(firestore_jobs)
    print(f"🔥 Firestore Jobs Fetched: {len(firestore_jobs_df)}")

    # ✅ Fetch jobs dynamically using `jobspy`
    search_term = preferred_role if preferred_role else "software engineer"
    results_wanted = 20  # Fetch 20 jobs

    try:
        scraped_jobs = scrape_jobs(
            site_name=["indeed", "linkedin"],
            search_term=search_term,
            location=location if location else "India",
            results_wanted=results_wanted,
            hours_old=72,
            country_indeed="India",
            delay=1.5,  # Slightly longer delay to avoid rate limiting
            detailed=True,  # Request detailed information
            proxy=None,     # Set to a proxy if needed
            return_as="dataframe"
        )
        print(f"🕵️ Scraped Jobs Fetched: {len(scraped_jobs)}")
        
        # Clean and prepare scraped jobs - improved handling
        # Replace NaN values with empty strings but preserve lists
        for col in scraped_jobs.columns:
            if col != "skills":  # Don't convert skills column if it's already a list
                scraped_jobs[col] = scraped_jobs[col].apply(
                    lambda x: "" if pd.isna(x) else str(x)
                )
        
        # Process each job to extract skills and create a consistent format
        processed_jobs = []
        for _, job in scraped_jobs.iterrows():
            job_description = job.get("description", "")
            job_title = job.get("title", "")
            
            # Ensure URL is properly extracted and not empty
            job_url = job.get("url", "")
            if pd.isna(job_url) or job_url == "":
                # Try to extract from other fields if available
                job_url = job.get("job_url", job.get("link", job.get("apply_link", "")))
            
            # Extract skills from job description
            job_skills = extract_skills_from_text(job_description)
            
            # If job has no skills extracted, try to extract from title
            if not job_skills:
                job_skills = extract_skills_from_title(job_title)
            
            processed_jobs.append({
                "title": job_title,
                "company": job.get("company", ""),
                "location": job.get("location", ""),
                "description": job_description,
                "url": job_url,
                "skills": job_skills,
                "source": "scraped"
            })
        
        scraped_jobs_df = pd.DataFrame(processed_jobs)

    except Exception as e:
        print(f"❌ Error while scraping jobs: {e}")
        scraped_jobs_df = pd.DataFrame(columns=["title", "company", "location", "description", "url", "skills", "source"])

    # ✅ Combine Firestore and Scraped Jobs
    all_jobs = pd.concat([firestore_jobs_df, scraped_jobs_df], ignore_index=True)
    
    # Fill missing values
    all_jobs["skills"] = all_jobs["skills"].apply(lambda x: x if isinstance(x, list) else [])
    all_jobs["location"] = all_jobs["location"].fillna("")
    all_jobs["title"] = all_jobs["title"].fillna("")
    all_jobs["company"] = all_jobs["company"].fillna("")
    all_jobs["description"] = all_jobs["description"].fillna("")
    all_jobs["url"] = all_jobs["url"].fillna("")

    print(f"📊 Total Jobs Available: {len(all_jobs)}")

    # ✅ Scoring and filtering jobs based on user preferences
    scored_jobs = []
    for _, job in all_jobs.iterrows():
        job_title = str(job.get("title", "")).lower()
        job_location = str(job.get("location", "")).lower()
        job_skills = [str(s).lower() for s in job.get("skills", [])]
        
        # If job has no skills extracted, try to extract from title and description
        if not job_skills:
            job_skills = extract_skills_from_text(job_title + " " + str(job.get("description", "")))
            
            # If still no skills, try to infer from job title
            if not job_skills:
                job_skills = extract_skills_from_title(job_title)
        
        print(f"🔎 Checking Job: {job.get('title', 'Unknown')} | Location: {job_location} | Skills: {job_skills}")
        
        # Calculate match scores (0-100 for each category)
        title_score = 0
        location_score = 0
        skills_score = 0
        
        # Title matching (0-100)
        if preferred_role and job_title:
            title_match = fuzzy_match(preferred_role, job_title, 70)
            title_score = 100 if title_match else 0
            
            # Special case: if job title contains the preferred role exactly, boost score
            if preferred_role in job_title:
                title_score = 100
        else:
            title_score = 50  # Neutral if no preference
            
        # Location matching (0-100)
        if location and job_location:
            location_score = fuzz.partial_ratio(location, job_location)
        else:
            location_score = 50  # Neutral if no location preference
            
        # Skills matching (0-100)
        if user_skills and job_skills:
            # Calculate percentage of user skills found in job skills
            matches = 0
            for user_skill in user_skills:
                if any(fuzzy_match(user_skill, job_skill, 70) for job_skill in job_skills):
                    matches += 1
            
            skills_score = int((matches / len(user_skills)) * 100) if user_skills else 50
        elif not user_skills:
            skills_score = 50  # Neutral if user has no skills listed
        
        # Calculate weighted total score (title is most important)
        total_score = (title_score * 0.5) + (location_score * 0.3) + (skills_score * 0.2)
        
        # Only include jobs with a minimum score
        if total_score >= 60:  # Adjust threshold as needed
            job_dict = job.to_dict()
            job_dict['match_score'] = round(total_score, 1)
            scored_jobs.append(job_dict)
        else:
            print(f"❌ Skipped: Low match score ({round(total_score, 1)})")
    
    # Sort by match score (highest first)
    recommendations = sorted(scored_jobs, key=lambda x: x['match_score'], reverse=True)
    
    # Fallback: If no recommendations, include jobs that at least match the role
    if len(recommendations) < 5:
        print("⚠️ Using fallback recommendations")
        fallback_jobs = []
        for _, job in all_jobs.iterrows():
            job_title = str(job.get("title", "")).lower()
            
            # Only check if title contains the role or is similar
            if preferred_role in job_title or fuzzy_match(preferred_role, job_title, 60):
                job_dict = job.to_dict()
                job_dict['match_score'] = 50  # Default fallback score
                fallback_jobs.append(job_dict)
        
        # Add fallback jobs that aren't already in recommendations
        existing_urls = {job.get('url', '') for job in recommendations}
        for job in fallback_jobs:
            if job.get('url', '') not in existing_urls and len(recommendations) < 10:
                recommendations.append(job)
                existing_urls.add(job.get('url', ''))
    
    print(f"✅ Final Recommendations: {len(recommendations)} jobs")
    return jsonify(recommendations)

if __name__ == '__main__':
    print("🚀 recommendation_api is starting...")
    app.run(port=5003, debug=True)
