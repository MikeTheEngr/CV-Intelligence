from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from routes.auth import router as auth_router
from routes.cv import router as cv_router
from routes.jobs import router as jobs_router

app = FastAPI(
    title="AI CV Intelligence & Job Match API",
    description="Upload your CV, get AI-powered analysis and matched jobs.",
    version="1.0.0",
)

# Handle CORS preflight OPTIONS requests manually
@app.middleware("http")
async def cors_handler(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "86400"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(cv_router,   prefix="/api")
app.include_router(jobs_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "CV Intelligence API running", "docs": "/docs"}