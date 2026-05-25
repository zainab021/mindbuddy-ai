"""
app/services/planner_service.py
────────────────────────────────
CRUD for planner tasks — backed by PostgreSQL via SQLAlchemy.
Each function receives a db Session from the route (injected by FastAPI).
"""

from sqlalchemy.orm import Session

from app.db.models import PlannerTask
from app.utils.helpers import make_id, now_iso


def _to_dict(task: PlannerTask) -> dict:
    """Convert an ORM model instance to a plain dict (matches PlannerTask schema)."""
    return {
        "id":                task.id,
        "title":             task.title,
        "subject":           task.subject,
        "type":              task.type,
        "priority":          task.priority,
        "due_at":            task.due_at,
        "estimated_minutes": task.estimated_minutes,
        "completed":         task.completed,
    }


def list_tasks(db: Session) -> list[dict]:
    """Return all planner tasks."""
    return [_to_dict(t) for t in db.query(PlannerTask).all()]


def get_task(db: Session, task_id: str) -> dict | None:
    """Return a single task by ID, or None if not found."""
    task = db.query(PlannerTask).filter(PlannerTask.id == task_id).first()
    return _to_dict(task) if task else None


def create_task(db: Session, data: dict) -> dict:
    """Insert a new task and return it."""
    task = PlannerTask(
        id=make_id("t"),
        title=data["title"],
        subject=data["subject"],
        type=data["type"],
        priority=data.get("priority", "medium"),
        due_at=data["due_at"],
        estimated_minutes=data["estimated_minutes"],
        completed=False,
        created_at=now_iso(),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return _to_dict(task)


def update_task(db: Session, task_id: str, updates: dict) -> dict | None:
    """Apply partial updates (PATCH semantics). Returns None if task not found."""
    task = db.query(PlannerTask).filter(PlannerTask.id == task_id).first()
    if task is None:
        return None

    for field, value in updates.items():
        if value is not None and hasattr(task, field):
            setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return _to_dict(task)


def delete_task(db: Session, task_id: str) -> bool:
    """Delete a task by ID. Returns True if deleted, False if not found."""
    task = db.query(PlannerTask).filter(PlannerTask.id == task_id).first()
    if task is None:
        return False
    db.delete(task)
    db.commit()
    return True
