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
# These are the frontend URLs allowed to call this API.
# Without this, the browser will block requests from Next.js.
FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

ALLOWED_ORIGINS: list[str] = [
    FRONTEND_URL,
    "http://localhost:3000",    # Next.js default dev port
    "http://127.0.0.1:3000",   # Same as above but different format
    "http://localhost:3001",    # Alt port (useful during testing)
]
