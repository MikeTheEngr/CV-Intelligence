import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY      = os.environ.get("GROQ_API_KEY", "")
ADZUNA_APP_ID     = os.environ.get("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY    = os.environ.get("ADZUNA_APP_KEY", "")
SUPABASE_URL      = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

GROQ_MODEL        = "llama-3.3-70b-versatile"
ADZUNA_BASE_URL   = "https://api.adzuna.com/v1/api/jobs"
ADZUNA_COUNTRIES  = {"us", "gb", "au", "ca", "de", "fr", "in", "nl", "nz", "za", "sg", "br"}