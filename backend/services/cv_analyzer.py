import json
from groq import Groq
from core.config import GROQ_API_KEY, GROQ_MODEL

client = Groq(api_key=GROQ_API_KEY)

ANALYSIS_PROMPT = """
You are an expert CV/Resume analyst and career coach.

Analyze the following CV text and return ONLY a valid JSON object with this exact structure:

{
  "overall_score": <integer 0-100>,
  "breakdown": {
    "clarity": <integer 0-100>,
    "ats_compatibility": <integer 0-100>,
    "keyword_density": <integer 0-100>,
    "structure": <integer 0-100>,
    "impact": <integer 0-100>
  },
  "summary": "<2 sentence overall assessment>",
  "suggestions": [
    {
      "section": "<e.g. Summary, Experience, Skills, Education, Formatting>",
      "issue": "<what is wrong or missing>",
      "fix": "<specific actionable improvement>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"]
}

Rules:
- Return ONLY the JSON. No markdown, no explanation, no backticks.
- Provide 4-6 suggestions minimum, prioritized by impact.
- Be specific and actionable, not generic.

CV TEXT:
{cv_text}
"""

async def analyze_cv(cv_text: str) -> dict:
    prompt = ANALYSIS_PROMPT.replace("{cv_text}", cv_text[:6000])
    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1500,
    )
    raw = completion.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        return {"overall_score": 0, "breakdown": {}, "summary": "Parse error.", "suggestions": [], "strengths": []}