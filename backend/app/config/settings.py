"""
app/config/settings.py
──────────────────────
Central configuration for the app.
Values come from the .env file (loaded automatically by python-dotenv).

Why a separate settings file?
  - One place to change config instead of hunting across files.
  - Easy to swap between dev / staging / production values.
"""

import os
from dotenv import load_dotenv

# Load variables from .env file into the environment.
# This must run before we call os.getenv().
load_dotenv()

# ── App metadata ───────────────────────────────────────────────
APP_NAME: str = os.getenv("APP_NAME", "MindSprint AI Backend")
DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

# ── Security ───────────────────────────────────────────────────
# Used to sign tokens. In production, make this a long random string.
SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

# ── Database ───────────────────────────────────────────────────
# Supabase PostgreSQL connection string (Transaction pooler recommended for FastAPI)
# Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DATABASE_URL: str = os.getenv("DATABASE_URL", "")

# ── AI ─────────────────────────────────────────────────────────
# Groq API key — get yours free at https://console.groq.com
GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")

# ── CORS (Cross-Origin Resource Sharing) ──────────────────────
# FRONTEND_URL env var overrides the default for custom deployments.
# The Vercel production URL is always included so Render works without
# requiring FRONTEND_URL to be configured.
FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

_origin_set: set[str] = {
    FRONTEND_URL,
    # Production — Vercel frontend
    "https://mindbuddy-ai.vercel.app",
    # Local development
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
}

ALLOWED_ORIGINS: list[str] = sorted(_origin_set)
