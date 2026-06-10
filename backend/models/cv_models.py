from pydantic import BaseModel
from typing import Optional


class ScoreBreakdown(BaseModel):
    clarity: int
    ats_compatibility: int
    keyword_density: int
    structure: int
    impact: int


class Suggestion(BaseModel):
    section: str
    issue: str
    fix: str


class CVAnalysis(BaseModel):
    overall_score: int
    breakdown: ScoreBreakdown
    summary: str
    strengths: list[str]
    suggestions: list[Suggestion]


class CVProfile(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    job_title: str
    experience_level: str           # Entry | Junior | Mid | Senior | Lead | Executive
    years_of_experience: Optional[int] = None
    skills: list[str] = []
    top_skills: list[str] = []
    industries: list[str] = []
    education_level: Optional[str] = None
    languages: list[str] = []
    location: Optional[str] = None
    search_keywords: str


class CVAnalyzeResponse(BaseModel):
    cv_text_length: int
    analysis: CVAnalysis
    profile: CVProfile


# ─── Request bodies ───────────────────────────────────────────────────────────

class CoverLetterRequest(BaseModel):
    profile: CVProfile
    job: dict