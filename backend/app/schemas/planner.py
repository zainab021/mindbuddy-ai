"""
app/schemas/planner.py
──────────────────────
Pydantic schemas for the /planner routes.
"""

from typing import Literal, Optional
from pydantic import BaseModel, Field


class PlannerTask(BaseModel):
    """A single planner task (as stored and returned)."""
    id: str
    title: str
    subject: str
    type: str        # "quiz", "flashcard", "study", "revision"
    priority: str    # "low", "medium", "high"
    due_at: str      # ISO timestamp
    estimated_minutes: int
    completed: bool


class PlannerTaskCreate(BaseModel):
    """Body for POST /planner — create a new task."""
    title: str = Field(min_length=3, max_length=200)
    subject: str
    type: Literal["quiz", "flashcard", "study", "revision"]
    priority: Literal["low", "medium", "high"] = "medium"
    due_at: str = Field(description="ISO timestamp, e.g. '2025-06-01T10:00:00Z'")
    estimated_minutes: int = Field(ge=1, le=480)  # 1 minute to 8 hours


class PlannerTaskUpdate(BaseModel):
    """Body for PATCH /planner/{task_id} — update an existing task.

    All fields are optional — only send the fields you want to change.
    This is the 'partial update' pattern (PATCH vs PUT).
    """
    title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    priority: Optional[Literal["low", "medium", "high"]] = None
    due_at: Optional[str] = None
    estimated_minutes: Optional[int] = Field(default=None, ge=1, le=480)
    completed: Optional[bool] = None   # Toggle task completion
