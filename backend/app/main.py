"""
app/main.py
───────────
Entry point for the MindSprint AI FastAPI backend.

Run with:
    uvicorn app.main:app --reload

Interactive API docs will be at:
    http://127.0.0.1:8000/docs
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import APP_NAME, DEBUG, ALLOWED_ORIGINS
from app.db.database import Base, engine
from app.routes import auth, study, flashcards, quiz, analytics, planner


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables that don't exist yet (safe to run on every startup)
    Base.metadata.create_all(bind=engine)
    yield


# ── Create the FastAPI application ─────────────────────────────────────────

app = FastAPI(
    title=APP_NAME,
    description="Backend API for MindSprint AI — your intelligent study companion.",
    version="0.1.0",
    docs_url="/docs",       # Swagger UI  → http://127.0.0.1:8000/docs
    redoc_url="/redoc",     # ReDoc UI    → http://127.0.0.1:8000/redoc
    debug=DEBUG,
    lifespan=lifespan,
)

# ── CORS — allow the Next.js frontend to talk to this backend ───────────────
# Without this, the browser will block requests from localhost:3000

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,      # e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],                # GET, POST, PATCH, DELETE, OPTIONS, …
    allow_headers=["*"],                # Authorization, Content-Type, …
)

# ── Register all routers ────────────────────────────────────────────────────
# Each router handles one feature area and lives in app/routes/

app.include_router(auth.router)         # /auth/login, /auth/signup
app.include_router(study.router)        # /study/generate
app.include_router(flashcards.router)   # /flashcards, /flashcards/{deck_id}
app.include_router(quiz.router)         # /quiz, /quiz/{quiz_id}, /quiz/{quiz_id}/submit
app.include_router(analytics.router)    # /analytics
app.include_router(planner.router)      # /planner, /planner/{task_id}


# ── Health check ────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    """Quick health check — confirms the server is running."""
    return {"status": "ok", "app": APP_NAME}


@app.get("/health", tags=["Health"])
def health():
    """Detailed health check for load balancers / uptime monitors."""
    return {"status": "healthy", "version": "0.1.0"}
