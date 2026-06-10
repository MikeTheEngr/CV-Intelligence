from pydantic import BaseModel
from typing import Optional
from models.cv_models import CVProfile


class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    url: str
    created: Optional[str] = None
    category: Optional[str] = None


class JobMatch(Job):
    match_score: int
    skill_gaps: list[str] = []


class JobMatchRequest(BaseModel):
    profile: CVProfile
    country: Optional[str] = "us"
    location: Optional[str] = None


class JobMatchResponse(BaseModel):
    total: int
    keywords_used: str
    jobs: list[JobMatch]


class SaveJobRequest(BaseModel):
    job: dict


class AuthRequest(BaseModel):
    email: str
    password: str