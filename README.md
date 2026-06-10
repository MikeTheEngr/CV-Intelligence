<div align="center">

```
 ██████╗██╗   ██╗    ██╗███╗   ██╗████████╗███████╗██╗     ██╗     ██╗ ██████╗ ███████╗███╗   ██╗ ██████╗███████╗
██╔════╝██║   ██║    ██║████╗  ██║╚══██╔══╝██╔════╝██║     ██║     ██║██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔════╝
██║     ██║   ██║    ██║██╔██╗ ██║   ██║   █████╗  ██║     ██║     ██║██║  ███╗█████╗  ██╔██╗ ██║██║     █████╗  
██║     ╚██╗ ██╔╝    ██║██║╚██╗██║   ██║   ██╔══╝  ██║     ██║     ██║██║   ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  
╚██████╗ ╚████╔╝     ██║██║ ╚████║   ██║   ███████╗███████╗███████╗██║╚██████╔╝███████╗██║ ╚████║╚██████╗███████╗
 ╚═════╝  ╚═══╝      ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝
```

### AI-Powered CV Analysis, Job Matching & Career Intelligence

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=flat-square)
![Adzuna](https://img.shields.io/badge/Adzuna-Jobs_API-FF6B35?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

</div>

## Why CV Intelligence?

Job seekers struggle with two problems — they don't know why their CV gets rejected, and they don't know which jobs they actually qualify for.

CV Intelligence solves both. Upload your CV and within seconds you get an AI-powered score across 5 dimensions, specific actionable improvement suggestions, real job listings ranked by how well your CV matches them, skill gap analysis per job, tailored cover letters, and a full CV rewrite targeted at any job title and country market.

No generic advice. No bloated platforms. Just a clean pipeline from CV to matched opportunity.

---

## Core Architecture

CV Intelligence routes your uploaded CV through a 4-layer AI pipeline before returning results:

```
User uploads CV (PDF / DOCX)
         │
         ▼
┌─────────────────────┐
│   CV Parser         │  PyMuPDF + python-docx → plain text
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   AI Analysis       │  Groq LLM → score, breakdown, suggestions
│   Engine            │  (clarity, ATS, keywords, structure, impact)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Profile           │  Groq LLM → skills, role, experience level,
│   Extractor         │  search keywords
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Job Matcher       │  Adzuna API → fetch live jobs → score each
│                     │  job against CV profile → rank by match %
└─────────────────────┘
```

---

## Features

**CV Analysis**
- Overall score (0–100) across 5 dimensions: Clarity, ATS Compatibility, Keyword Density, Structure, Impact
- Specific improvement suggestions per CV section
- Extracted profile: skills, experience level, education, languages

**Job Matching**
- Live job listings from Adzuna across 10+ countries
- Each job ranked by match percentage against your CV
- Skill gap analysis per job — shows exactly what you're missing
- Save jobs to your account for later

**CV Tailoring**
- Target any job title + country market
- AI rewrites your professional summary for that specific role
- Must-have vs nice-to-have skills breakdown
- Before/after bullet point improvements with copy buttons
- ATS keyword recommendations
- Country-specific market tips

**Cover Letter Generator**
- Tailored cover letter per job in seconds
- Uses your CV profile + job description as context
- One-click copy

**User System**
- Supabase Auth — email/password signup, login, forgot password
- CV analysis history with scores
- Saved jobs list
- User profile with monthly usage tracking
- Free / Pro tier infrastructure (payment integration ready)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Glassmorphism UI |
| Backend | FastAPI, Python 3.12, Uvicorn |
| AI / LLM | Groq (llama-3.3-70b-versatile) |
| Jobs Data | Adzuna Jobs API |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Parsing | PyMuPDF (PDF), python-docx (DOCX) |
| HTTP Client | Axios (frontend), HTTPX (backend) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
cv-intelligence/
├── backend/
│   ├── core/
│   │   ├── config.py          # Environment variables
│   │   └── dependencies.py    # FastAPI auth dependencies
│   ├── routes/
│   │   ├── auth.py            # /auth/signup, /login, /me, /forgot-password
│   │   ├── cv.py              # /cv/analyze, /history, /cover-letter, /tailor
│   │   └── jobs.py            # /jobs/match, /save, /saved
│   ├── services/
│   │   ├── cv_parser.py       # PDF + DOCX → plain text
│   │   ├── cv_analyzer.py     # Groq: score + suggestions
│   │   ├── profile_extractor.py  # Groq: extract structured profile
│   │   ├── job_fetcher.py     # Adzuna API integration
│   │   ├── job_scorer.py      # Match % + skill gap logic
│   │   ├── cover_letter.py    # Groq: tailored cover letter
│   │   ├── cv_tailor.py       # Groq: CV rewrite for target role/market
│   │   └── auth.py            # Supabase auth + DB operations
│   ├── models/
│   │   ├── cv_models.py       # CVAnalysis, CVProfile schemas
│   │   └── job_models.py      # Job, JobMatch schemas
│   ├── main.py
│   ├── schema.sql             # Supabase DB schema
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/
        │   ├── UploadPage.jsx
        │   ├── AnalysisPage.jsx
        │   ├── JobsPage.jsx
        │   ├── CoverLetterPage.jsx
        │   ├── TailorPage.jsx
        │   └── ProfilePage.jsx
        ├── components/
        │   ├── CVScoreCard.jsx
        │   ├── SuggestionList.jsx
        │   ├── JobCard.jsx
        │   ├── UploadZone.jsx
        │   ├── AuthModal.jsx
        │   └── theme.js
        └── services/
            └── api.js
```

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- Supabase account
- Groq API key (free at console.groq.com)
- Adzuna API credentials (free at developer.adzuna.com)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
GROQ_API_KEY=your_groq_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

Run the schema in your Supabase SQL editor (`backend/schema.sql`), then start the server:

```bash
python -m uvicorn main:app --reload
```

Backend runs at `http://localhost:8000` · API docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | — |
| POST | `/api/auth/login` | Sign in | — |
| GET | `/api/auth/me` | Get current user | ✓ |
| POST | `/api/auth/forgot-password` | Send reset email | — |
| POST | `/api/cv/analyze` | Full CV analysis pipeline | Optional |
| GET | `/api/cv/history` | Past CV analyses | ✓ |
| POST | `/api/cv/cover-letter` | Generate cover letter | Optional |
| POST | `/api/cv/tailor` | Tailor CV for role + market | Optional |
| POST | `/api/jobs/match` | Match jobs to CV profile | Optional |
| POST | `/api/jobs/save` | Save a job | ✓ |
| GET | `/api/jobs/saved` | Get saved jobs | ✓ |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Groq API key for LLM | ✓ |
| `ADZUNA_APP_ID` | Adzuna application ID | ✓ |
| `ADZUNA_APP_KEY` | Adzuna application key | ✓ |
| `SUPABASE_URL` | Supabase project URL | ✓ |
| `SUPABASE_ANON_KEY` | Supabase anon public key | ✓ |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (bypasses RLS) | ✓ |
| `VITE_API_URL` | Backend API URL (frontend) | ✓ |

---

## Roadmap

- [x] CV parsing (PDF + DOCX)
- [x] AI scoring + suggestions
- [x] Job matching via Adzuna
- [x] Cover letter generation
- [x] CV tailoring per role + country
- [x] User auth (signup, login, forgot password)
- [x] CV history + saved jobs
- [x] User profile + usage tracking
- [ ] Paystack payment integration
- [ ] Free / Pro tier enforcement
- [ ] Mobile responsive polish
- [ ] Deployment (Vercel + Render)

---

## Built By

**Charles** — AI Engineer & Full Stack Developer  
[@MikeTheEngrr](https://x.com/MikeTheEngrr) · [GitHub](https://github.com/MikeTheEngr)

---

<div align="center">
  <sub>Built with Groq · FastAPI · React · Supabase</sub>
</div>
