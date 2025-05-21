from fastapi import FastAPI
from jobspy import scrape_jobs
import pandas as pd

app = FastAPI()

@app.get("/scrape_jobs")
async def get_jobs(search_term: str, location: str, results_wanted: int = 20):
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "glassdoor", "bayt", "naukri"],
        search_term=search_term,
        google_search_term=f"{search_term} jobs near {location}",
        location=location,
        results_wanted=results_wanted,
        hours_old=72,
        country_indeed="USA"
    )

    if jobs.empty:
        return {"message": "No jobs found"}

    # ✅ Convert NaN values explicitly to empty strings
    jobs = jobs.astype(str).replace("nan", "")

    return jobs.to_dict(orient="records")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
