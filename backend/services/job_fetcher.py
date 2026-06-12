import httpx
import asyncio
from typing import Optional
from core.config import (
    ADZUNA_APP_ID, ADZUNA_APP_KEY, ADZUNA_BASE_URL, ADZUNA_COUNTRIES,
    JSEARCH_API_KEY, REMOTIVE_BASE_URL,
)

# ─── ADZUNA ──────────────────────────────────────────────────────────────────
async def fetch_adzuna(keywords: str, country: str = "us", location: Optional[str] = None, limit: int = 10) -> list[dict]:
    country = country.lower()
    if country not in ADZUNA_COUNTRIES:
        country = "us"

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": limit,
        "what": keywords,
        "content-type": "application/json",
        "sort_by": "relevance",
    }
    if location:
        params["where"] = location

    url = f"{ADZUNA_BASE_URL}/{country}/search/1"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        return [
            {
                "id": f"adzuna_{job.get('id', i)}",
                "source": "Adzuna",
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
            for i, job in enumerate(data.get("results", []))
        ]
    except Exception as e:
        print(f"Adzuna fetch error: {e}")
        return []


# ─── JSEARCH (LinkedIn + Indeed + Glassdoor) ──────────────────────────────────
async def fetch_jsearch(keywords: str, location: Optional[str] = None, limit: int = 10) -> list[dict]:
    if not JSEARCH_API_KEY:
        return []

    params = {
        "query": f"{keywords} {location or ''}".strip(),
        "page": "1",
        "num_pages": "1",
        "date_posted": "month",
    }
    headers = {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://jsearch.p.rapidapi.com/search",
                params=params,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()

        jobs = data.get("data", [])[:limit]
        return [
            {
                "id": f"jsearch_{job.get('job_id', i)}",
                "source": job.get("job_publisher", "JSearch"),
                "title": job.get("job_title", ""),
                "company": job.get("employer_name", "Unknown"),
                "location": f"{job.get('job_city', '')} {job.get('job_country', '')}".strip(),
                "description": job.get("job_description", "")[:500],
                "salary_min": job.get("job_min_salary"),
                "salary_max": job.get("job_max_salary"),
                "url": job.get("job_apply_link", ""),
                "created": job.get("job_posted_at_datetime_utc", ""),
                "category": job.get("job_required_experience", {}).get("required_experience_in_months", ""),
            }
            for i, job in enumerate(jobs)
        ]
    except Exception as e:
        print(f"JSearch fetch error: {e}")
        return []


# ─── REMOTIVE (Remote jobs) ───────────────────────────────────────────────────
async def fetch_remotive(keywords: str, limit: int = 10) -> list[dict]:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{REMOTIVE_BASE_URL}/remote-jobs",
                params={"search": keywords, "limit": limit},
            )
            response.raise_for_status()
            data = response.json()

        jobs = data.get("jobs", [])[:limit]
        return [
            {
                "id": f"remotive_{job.get('id', i)}",
                "source": "Remotive",
                "title": job.get("title", ""),
                "company": job.get("company_name", "Unknown"),
                "location": job.get("candidate_required_location", "Remote"),
                "description": job.get("description", "")[:500],
                "salary_min": None,
                "salary_max": None,
                "url": job.get("url", ""),
                "created": job.get("publication_date", ""),
                "category": job.get("category", ""),
            }
            for i, job in enumerate(jobs)
        ]
    except Exception as e:
        print(f"Remotive fetch error: {e}")
        return []


# ─── DEDUPLICATION ────────────────────────────────────────────────────────────
def deduplicate(jobs: list[dict]) -> list[dict]:
    """Remove duplicate jobs based on title + company similarity."""
    seen = set()
    unique = []
    for job in jobs:
        key = f"{job['title'].lower().strip()}_{job['company'].lower().strip()}"
        if key not in seen:
            seen.add(key)
            unique.append(job)
    return unique


# ─── MAIN FETCHER ─────────────────────────────────────────────────────────────
async def fetch_jobs(
    keywords: str,
    country: str = "us",
    location: Optional[str] = None,
    results_per_page: int = 30,
) -> list[dict]:
    """
    Fetch jobs from Adzuna + JSearch + Remotive in parallel.
    Returns up to 30 deduplicated results ranked by source.
    """
    per_source = results_per_page // 3  # 10 from each source

    # Fetch all sources in parallel
    adzuna_jobs, jsearch_jobs, remotive_jobs = await asyncio.gather(
        fetch_adzuna(keywords, country, location, per_source),
        fetch_jsearch(keywords, location, per_source),
        fetch_remotive(keywords, per_source),
    )

    print(f"Fetched → Adzuna: {len(adzuna_jobs)} | JSearch: {len(jsearch_jobs)} | Remotive: {len(remotive_jobs)}")

    # Combine and deduplicate
    all_jobs = adzuna_jobs + jsearch_jobs + remotive_jobs
    unique_jobs = deduplicate(all_jobs)

    # Cap at 30
    return unique_jobs[:30]