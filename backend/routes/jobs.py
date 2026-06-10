from fastapi import APIRouter, HTTPException, Depends
from typing import Optional

from core.dependencies import get_current_user, get_optional_user
from models.job_models import JobMatchRequest, JobMatchResponse, SaveJobRequest
from services.job_fetcher import fetch_jobs
from services.job_scorer import score_jobs
from services.auth import save_job, get_saved_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/match", response_model=JobMatchResponse)
async def match_jobs(
    request: JobMatchRequest,
    user: Optional[dict] = Depends(get_optional_user),
):
    """
    Fetch jobs from Adzuna based on extracted CV profile,
    then score and rank each job against the user's skills.
    """
    profile = request.profile.model_dump()
    keywords = profile.get("search_keywords") or profile.get("job_title") or "software engineer"

    if not keywords:
        raise HTTPException(status_code=400, detail="No keywords found in profile.")

    raw_jobs = await fetch_jobs(
        keywords=keywords,
        country=request.country or "us",
        location=request.location,
        results_per_page=20,
    )

    if not raw_jobs:
        return {"total": 0, "keywords_used": keywords, "jobs": [], "message": "No jobs found. Try a different region."}

    scored = score_jobs(raw_jobs, profile)
    return {"total": len(scored), "keywords_used": keywords, "jobs": scored}


@router.post("/save")
async def save_job_route(
    request: SaveJobRequest,
    user: dict = Depends(get_current_user),
):
    """Save a job to the authenticated user's list."""
    return await save_job(user["user_id"], request.job)


@router.get("/saved")
async def saved_jobs_route(user: dict = Depends(get_current_user)):
    """Fetch all saved jobs for the authenticated user."""
    return await get_saved_jobs(user["user_id"])