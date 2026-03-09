import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from database import engine, Base
import models  # noqa: F401 — register all models

from routes import auth, events, users, admin

# ─── Create tables ───────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── App ─────────────────────────────────────────────────────────
app = FastAPI(
    title="CSMU Event Management API",
    description="Backend API for Chhatrapati Shivaji Maharaj University Event Portal",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ────────────────────────────────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        # Add your Netlify URL here after deploy:
        # "https://your-csmu-portal.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(users.router)
app.include_router(admin.router)


# ─── Health check ────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def health():
    return {
        "status": "online",
        "service": "CSMU Event Management API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
