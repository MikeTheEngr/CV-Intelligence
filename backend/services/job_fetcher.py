import httpx
from typing import Optional
from core.config import ADZUNA_APP_ID, ADZUNA_APP_KEY, ADZUNA_BASE_URL, ADZUNA_COUNTRIES

async def fetch_jobs(keywords: str, country: str = "us", results_per_page: int = 20, location: Optional[str] = None) -> list[dict]:
    country = country.lower()
    if country not in ADZUNA_COUNTRIES:
        country = "us"

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": keywords,
        "content-type": "application/json",
        "sort_by": "relevance",
    }
    if location:
        params["where"] = location

    url = f"{ADZUNA_BASE_URL}/{country}/search/1"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    return [
        {
            "id": job.get("id", ""),
            "title": job.get("title", ""),
            "company": job.get("company", {}).get("display_name", "Unknown"),
            "location": job.get("location", {}).get("display_name", ""),
            "description": job.get("description", ""),
            "salary_min": job.get("salary_min"),
            "salary_max": job.get("salary_max"),
            "url": job.get("redirect_url", ""),
            "created": job.get("created", ""),
            "category": job.get("category", {}).get("label", ""),
        }
        for job in data.get("results", [])
    ]