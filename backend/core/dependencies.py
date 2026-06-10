from fastapi import Header, HTTPException
from typing import Optional
from services.auth import get_user


def _extract_token(authorization: Optional[str]) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing.")
    return authorization[7:] if authorization.startswith("Bearer ") else authorization


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency: requires valid Bearer token. Returns user dict."""
    token = _extract_token(authorization)
    return await get_user(token)


async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """Dependency: returns user if token present, None otherwise."""
    if not authorization:
        return None
    try:
        token = _extract_token(authorization)
        return await get_user(token)
    except Exception:
        return None