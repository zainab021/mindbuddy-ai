"""
app/routes/analytics.py
────────────────────────
Analytics route:
  GET /analytics — return full analytics dashboard data
"""

from fastapi import APIRouter
from app.schemas.analytics import AnalyticsResponse
from app.data.mock import (
    MOCK_STATS,
    MOCK_WEEKLY,
    MOCK_SUBJECT_STATS,
    MOCK_ACTIVITY,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsResponse)
def get_analytics():
    """
    Return all analytics data for the dashboard:
      - summary stats (total hours, XP, streaks, etc.)
      - weekly study breakdown (Mon–Sun)
      - per-subject mastery stats
      - recent activity feed
    """
    return {
        "summary": MOCK_STATS,
        "weekly_data": MOCK_WEEKLY,
        "subject_stats": MOCK_SUBJECT_STATS,
        "recent_activity": MOCK_ACTIVITY,
    }
