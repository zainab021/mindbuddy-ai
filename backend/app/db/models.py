"""
app/db/models.py
─────────────────
SQLAlchemy ORM models — each class maps to one database table.
Tables are created automatically on startup if they don't exist.
"""

from sqlalchemy import Boolean, Column, Integer, String

from app.db.database import Base


class PlannerTask(Base):
    """Maps to the 'planner_tasks' table in PostgreSQL."""

    __tablename__ = "planner_tasks"

    id                 = Column(String,  primary_key=True)
    title              = Column(String,  nullable=False)
    subject            = Column(String,  nullable=False)
    type               = Column(String,  nullable=False)   # quiz | flashcard | study | revision
    priority           = Column(String,  nullable=False, default="medium")
    due_at             = Column(String,  nullable=False)   # ISO timestamp string
    estimated_minutes  = Column(Integer, nullable=False)
    completed          = Column(Boolean, nullable=False, default=False)
    created_at         = Column(String,  nullable=False)
