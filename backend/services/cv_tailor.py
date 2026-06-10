from groq import Groq
from core.config import GROQ_API_KEY, GROQ_MODEL
import json

client = Groq(api_key=GROQ_API_KEY)

TAILOR_PROMPT = """
You are an expert CV/Resume writer and career coach specializing in international job markets.

A candidate wants to tailor their CV for a specific role and country.

Candidate Profile:
- Current Job Title: {job_title}
- Experience Level: {experience_level}
- Years of Experience: {years_of_experience}
- Current Skills: {skills}
- Education: {education_level}

Target:
- Job Title: {target_job}
- Target Country/Market: {target_country}

Task: Rewrite and tailor the CV content for this specific target. Return ONLY a valid JSON object:

{{
  "summary": "<A powerful 3-sentence professional summary tailored for the target job and country market. Use keywords common in that market. Be specific and compelling.>",
  "skills": {{
    "must_have": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
    "nice_to_have": ["<skill1>", "<skill2>", "<skill3>"],
    "remove": ["<skills from their profile that are irrelevant to this role>"]
  }},
  "bullet_improvements": [
    {{
      "original": "<generic bullet they might have>",
      "improved": "<specific, quantified, keyword-rich version for the target role>"
    }},
    {{
      "original": "<generic bullet>",
      "improved": "<improved version>"
    }},
    {{
      "original": "<generic bullet>",
      "improved": "<improved version>"
    }},
    {{
      "original": "<generic bullet>",
      "improved": "<improved version>"
    }},
    {{
      "original": "<generic bullet>",
      "improved": "<improved version>"
    }}
  ],
  "market_tips": [
    "<Specific tip about the {target_country} job market for {target_job}>",
    "<Another market-specific tip>",
    "<Third tip>"
  ],
  "keywords_to_add": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>", "<keyword6>"]
}}

Rules:
- Return ONLY the JSON. No markdown, no backticks, no explanation.
- Make the summary genuinely compelling, not generic.
- Market tips must be specific to the actual country and job — no generic advice.
- Keywords must be ATS-relevant for that specific role and country.
"""

async def tailor_cv(profile: dict, target_job: str, target_country: str) -> dict:
    """Tailor CV content for a specific job and country market."""
    prompt = TAILOR_PROMPT.format(
        job_title=profile.get("job_title", "Professional"),
        experience_level=profile.get("experience_level", "Mid"),
        years_of_experience=profile.get("years_of_experience", "several"),
        skills=", ".join(profile.get("skills", [])),
        education_level=profile.get("education_level", "Bachelor"),
        target_job=target_job,
        target_country=target_country,
    )

    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=1500,
    )

    raw = completion.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"error": "Failed to parse tailor response", "raw": raw}