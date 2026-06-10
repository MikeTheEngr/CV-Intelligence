from supabase import create_client, Client
from fastapi import HTTPException
from core.config import SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY

# Anon client — for auth operations (login, signup, token verification)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Service role client — bypasses RLS for server-side DB writes
db: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY) if SUPABASE_SERVICE_KEY else supabase


async def sign_up(email: str, password: str) -> dict:
    try:
        res = supabase.auth.sign_up({"email": email, "password": password})
        if res.user is None:
            raise HTTPException(status_code=400, detail="Sign-up failed.")
        return {"user_id": res.user.id, "email": res.user.email, "access_token": res.session.access_token if res.session else None}
    except HTTPException:
        raise
    except Exception as e:
        print(f"SIGNUP ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


async def sign_in(email: str, password: str) -> dict:
    try:
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        if res.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        return {"user_id": res.user.id, "email": res.user.email, "access_token": res.session.access_token, "refresh_token": res.session.refresh_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


async def get_user(access_token: str) -> dict:
    try:
        res = supabase.auth.get_user(access_token)
        if res.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token.")
        return {"user_id": res.user.id, "email": res.user.email}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


async def save_analysis(user_id: str, analysis: dict, profile: dict) -> dict:
    try:
        res = db.table("cv_analyses").insert({
            "user_id": user_id,
            "overall_score": analysis.get("overall_score"),
            "analysis_json": analysis,
            "profile_json": profile,
        }).execute()
        return res.data[0] if res.data else {}
    except Exception as e:
        print(f"SAVE ANALYSIS ERROR: {type(e).__name__}: {str(e)}")
        raise


async def get_analyses(user_id: str) -> list:
    res = db.table("cv_analyses").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data or []


async def save_job(user_id: str, job: dict) -> dict:
    try:
        res = db.table("saved_jobs").insert({
            "user_id": user_id,
            "job_title": job.get("title"),
            "company": job.get("company"),
            "location": job.get("location"),
            "job_url": job.get("url"),
            "match_score": job.get("match_score"),
            "skill_gaps": job.get("skill_gaps", []),
        }).execute()
        return res.data[0] if res.data else {}
    except Exception as e:
        print(f"SAVE JOB ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save job: {str(e)}")


async def get_saved_jobs(user_id: str) -> list:
    res = db.table("saved_jobs").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data or []


async def forgot_password(email: str) -> dict:
    try:
        supabase.auth.reset_password_email(
            email,
            options={"redirect_to": "http://localhost:5173/reset-password"}
        )
        return {"message": "Reset link sent. Check your email."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def update_password(user_id: str, new_password: str) -> dict:
    try:
        supabase.auth.admin.update_user_by_id(user_id, {"password": new_password})
        return {"message": "Password updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))