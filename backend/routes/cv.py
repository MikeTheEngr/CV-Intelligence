from fastapi import APIRouter, UploadFile, File, Depends
from typing import Optional
from pydantic import BaseModel

from core.dependencies import get_current_user, get_optional_user
from models.cv_models import CVAnalyzeResponse, CoverLetterRequest
from services.cv_parser import parse_cv
from services.cv_analyzer import analyze_cv
from services.profile_extractor import extract_profile
from services.cover_letter import generate_cover_letter
from services.cv_tailor import tailor_cv
from services.auth import save_analysis, get_analyses

router = APIRouter(prefix="/cv", tags=["CV"])


@router.post("/analyze", response_model=CVAnalyzeResponse)
async def analyze(
    file: UploadFile = File(...),
    user: Optional[dict] = Depends(get_optional_user),
):
    """
    Full CV pipeline:
    1. Parse PDF/DOCX → plain text
    2. Groq: score + suggestions
    3. Groq: extract structured profile
    Saves to Supabase if user is authenticated.
    """
    cv_text = await parse_cv(file)
    analysis = await analyze_cv(cv_text)
    profile = await extract_profile(cv_text)

    if user:
        try:
            await save_analysis(user["user_id"], analysis, profile)
        except Exception as e:
            print(f"WARNING: Could not save analysis: {e}")  # don't fail the request if DB save fails

    return {"cv_text_length": len(cv_text), "analysis": analysis, "profile": profile}


@router.get("/history")
async def cv_history(user: dict = Depends(get_current_user)):
    """Return all past CV analyses for the authenticated user."""
    return await get_analyses(user["user_id"])


@router.post("/cover-letter")
async def cover_letter(
    request: CoverLetterRequest,
    user: Optional[dict] = Depends(get_optional_user),
):
    """Generate a tailored cover letter for a specific job."""
    letter = await generate_cover_letter(request.profile.model_dump(), request.job)
    return {"cover_letter": letter}


class TailorRequest(BaseModel):
    profile: dict
    target_job: str
    target_country: str


@router.post("/tailor")
async def tailor(
    request: TailorRequest,
    user: Optional[dict] = Depends(get_optional_user),
):
    """Tailor CV content for a specific job title and country market."""
    result = await tailor_cv(request.profile, request.target_job, request.target_country)
    return result