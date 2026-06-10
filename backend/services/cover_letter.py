from groq import Groq
from core.config import GROQ_API_KEY, GROQ_MODEL

client = Groq(api_key=GROQ_API_KEY)

PROMPT = """
You are an expert career coach and professional writer.
Write a compelling, personalized cover letter for the following application.

Candidate Profile:
- Name: {full_name}
- Job Title: {job_title}
- Experience Level: {experience_level}
- Years of Experience: {years_of_experience}
- Top Skills: {top_skills}

Target Job:
- Title: {target_title}
- Company: {company}
- Location: {location}
- Job Description: {job_description}

Instructions:
- 3 paragraphs: hook + value prop, skills match, closing CTA
- Reference the company name and role directly
- Confident, professional, human tone
- 250-320 words max
- No date/address headers — start with a strong opening sentence
- Return only the cover letter text, nothing else.
"""

async def generate_cover_letter(profile: dict, job: dict) -> str:
    prompt = PROMPT.format(
        full_name=profile.get("full_name", "the candidate"),
        job_title=profile.get("job_title", "Professional"),
        experience_level=profile.get("experience_level", "Mid"),
        years_of_experience=profile.get("years_of_experience", "several"),
        top_skills=", ".join(profile.get("top_skills", [])),
        target_title=job.get("title", ""),
        company=job.get("company", "your company"),
        location=job.get("location", ""),
        job_description=job.get("description", "")[:800],
    )
    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=600,
    )
    return completion.choices[0].message.content.strip()