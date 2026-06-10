from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.cv import router as cv_router
from routes.jobs import router as jobs_router

app = FastAPI(
    title="AI CV Intelligence & Job Match API",
    description="Upload your CV, get AI-powered analysis and matched jobs.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(cv_router,   prefix="/api")
app.include_router(jobs_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "CV Intelligence API running", "docs": "/docs"}