from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.dependencies import get_current_user
from services.auth import sign_up, sign_in, forgot_password, update_password

router = APIRouter(prefix="/auth", tags=["Auth"])


class AuthRequest(BaseModel):
    email: str
    password: str

class EmailRequest(BaseModel):
    email: str

class PasswordRequest(BaseModel):
    password: str


@router.post("/signup")
async def signup(body: AuthRequest):
    return await sign_up(body.email, body.password)

@router.post("/login")
async def login(body: AuthRequest):
    return await sign_in(body.email, body.password)

@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return user

@router.post("/forgot-password")
async def forgot(body: EmailRequest):
    return await forgot_password(body.email)

@router.post("/update-password")
async def update_pwd(body: PasswordRequest, user: dict = Depends(get_current_user)):
    return await update_password(user["user_id"], body.password)