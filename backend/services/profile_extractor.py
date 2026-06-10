import json
from groq import Groq
from core.config import GROQ_API_KEY, GROQ_MODEL

client = Groq(api_key=GROQ_API_KEY)

EXTRACTION_PROMPT = """
You are a CV data extraction specialist.
Extract structured profile information and return ONLY a valid JSON object:

{
  "full_name": "<name or null>",
  "email": "<email or null>",
  "job_title": "<most recent or target job title>",
  "experience_level": "<Entry|Junior|Mid|Senior|Lead|Executive>",
  "years_of_experience": <integer or null>,
  "skills": ["<skill1>", ...],
  "top_skills": ["<top 5 skills>"],
  "industries": ["<industry1>", ...],
  "education_level": "<High School|Associate|Bachelor|Master|PhD|Other>",
  "languages": ["<language1>", ...],
  "location": "<city/country or null>",
  "search_keywords": "<3-5 word search phrase for job matching>"
}

Rules:
- Return ONLY the JSON. No markdown, no backticks.
- Skills should be concrete technologies or tools, not soft skills.
- search_keywords should be optimized for job board searching.

CV TEXT:
{cv_text}
"""

async def extract_profile(cv_text: str) -> dict:
    prompt = EXTRACTION_PROMPT.replace("{cv_text}", cv_text[:6000])
    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=800,
    )
    raw = completion.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        return {"job_title": "Professional", "experience_level": "Mid", "skills": [], "top_skills": [], "search_keywords": "professional"}