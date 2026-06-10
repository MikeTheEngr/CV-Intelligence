from typing import List


def score_jobs(jobs: list[dict], profile: dict) -> list[dict]:
    """
    Score each job against the user's CV profile.
    Returns jobs sorted by match_score descending, with skill_gaps added.
    """
    user_skills = set(s.lower() for s in profile.get("skills", []))
    top_skills = set(s.lower() for s in profile.get("top_skills", []))
    experience_level = profile.get("experience_level", "Mid")

    scored = []
    for job in jobs:
        score, skill_gaps = _compute_match(
            job_title=job["title"],
            job_description=job["description"],
            user_skills=user_skills,
            top_skills=top_skills,
            experience_level=experience_level
        )
        scored.append({
            **job,
            "match_score": score,
            "skill_gaps": skill_gaps,
        })

    # Sort by match score descending
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored


def _compute_match(
    job_title: str,
    job_description: str,
    user_skills: set,
    top_skills: set,
    experience_level: str
) -> tuple[int, List[str]]:
    """
    Compute a match score (0-100) and extract skill gaps.
    Logic:
      - 50% weight: top skills found in job description
      - 30% weight: general skills found in job description
      - 20% weight: experience level alignment
    """
    desc_lower = (job_title + " " + job_description).lower()

    # --- Top skills match (50 points max) ---
    top_hits = sum(1 for skill in top_skills if skill in desc_lower)
    top_score = (top_hits / max(len(top_skills), 1)) * 50

    # --- General skills match (30 points max) ---
    general_hits = sum(1 for skill in user_skills if skill in desc_lower)
    general_score = (general_hits / max(len(user_skills), 1)) * 30

    # --- Experience level alignment (20 points max) ---
    level_score = _level_match_score(experience_level, desc_lower)

    total = int(top_score + general_score + level_score)
    total = max(10, min(total, 100))  # floor at 10, cap at 100

    # --- Skill gaps: skills mentioned in job desc but NOT in user skills ---
    common_tech_keywords = _extract_tech_keywords(desc_lower)
    skill_gaps = [kw for kw in common_tech_keywords if kw not in user_skills][:5]

    return total, skill_gaps


def _level_match_score(user_level: str, desc_lower: str) -> int:
    level_map = {
        "Entry":     ["entry", "graduate", "junior", "intern", "trainee", "fresher"],
        "Junior":    ["junior", "associate", "entry"],
        "Mid":       ["mid", "intermediate", "experienced", "2+ years", "3+ years"],
        "Senior":    ["senior", "lead", "5+ years", "6+ years", "7+ years"],
        "Lead":      ["lead", "principal", "staff", "architect"],
        "Executive": ["director", "vp", "head of", "chief", "executive"],
    }
    keywords = level_map.get(user_level, level_map["Mid"])
    for kw in keywords:
        if kw in desc_lower:
            return 20
    return 8  # partial credit if no level match


def _extract_tech_keywords(text: str) -> list[str]:
    """Simple keyword extraction for common tech/skill terms in job descriptions."""
    candidates = [
        "python", "javascript", "typescript", "react", "node.js", "java", "go", "rust",
        "sql", "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes",
        "aws", "gcp", "azure", "terraform", "ci/cd", "git", "linux", "fastapi",
        "django", "flask", "graphql", "rest api", "machine learning", "pytorch",
        "tensorflow", "spark", "kafka", "elasticsearch", "figma", "tailwind",
        "next.js", "vue", "angular", "flutter", "swift", "kotlin", "c++", "c#",
        "data analysis", "tableau", "power bi", "excel", "communication",
    ]
    return [kw for kw in candidates if kw in text]