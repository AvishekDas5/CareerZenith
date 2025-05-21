from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta, timezone
import pandas as pd

from gdeltdoc import GdeltDoc, Filters

app = FastAPI()

# Enable CORS for development; adjust allowed origins in production as needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model to serialize each article
class Article(BaseModel):
    url: str
    url_mobile: str
    title: str
    seendate: str
    socialimage: str
    domain: str
    language: str
    sourcecountry: str

@app.get("/news", response_model=List[Article])
def get_news():
    
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=2)
    
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
    # Set up the filters; adjust the parameters as needed.
    f = Filters(
        keyword="employment",
        language="english",
        start_date=start_date_str,
        end_date=end_date_str
    )
    
    gd = GdeltDoc()
    # Search for articles matching the filters – this returns a DataFrame.
    articles_df = gd.article_search(f)
    
    # Convert the DataFrame into a list of dictionaries.
    articles = articles_df.to_dict(orient="records")
    
    return articles

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
