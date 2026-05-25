"""
app/schemas/analytics.py
────────────────────────
Pydantic schemas for the /analytics route.
"""

from pydantic import BaseModel


class DayData(BaseModel):
    """Study data for a single day of the week."""
    day: str             # "Mon", "Tue", etc.
    study_minutes: int
    xp: int
    quizzes_taken: int


class SubjectStat(BaseModel):
    """Mastery stats for a single subject."""
    subject: str
    mastery_pct: int         # 0-100
    study_minutes: int
    quizzes_completed: int
    color_hex: str           # Colour for charts, e.g. "#7c3aed"


class ActivityEntry(BaseModel):
    """A single entry in the recent activity feed."""
    id: str
    type: str          # "quiz", "flashcard", "study", "achievement"
    title: str
    subtitle: str
    xp_gained: int
    score: int | None = None
    created_at: str


class AnalyticsSummary(BaseModel):
    """High-level summary stats shown at the top of the analytics page."""
    total_study_hours: float
    total_xp: int
    quizzes_completed: int
    average_quiz_score: int
    current_streak: int


class AnalyticsResponse(BaseModel):
    """Full response from GET /analytics."""
    summary: AnalyticsSummary
    weekly_data: list[DayData]
    subject_stats: list[SubjectStat]
    recent_activity: list[ActivityEntry]
