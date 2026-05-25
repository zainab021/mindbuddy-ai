"""
app/routes/planner.py
──────────────────────
Planner routes:
  GET    /planner            — list all tasks
  POST   /planner            — create a new task
  PATCH  /planner/{task_id} — partially update a task
  DELETE /planner/{task_id} — delete a task
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.planner import PlannerTask, PlannerTaskCreate, PlannerTaskUpdate
from app.services import planner_service

router = APIRouter(prefix="/planner", tags=["Planner"])


@router.get("", response_model=list[PlannerTask])
def list_tasks(db: Session = Depends(get_db)):
    """Return all planner tasks from the database."""
    return planner_service.list_tasks(db)


@router.post("", response_model=PlannerTask, status_code=status.HTTP_201_CREATED)
def create_task(body: PlannerTaskCreate, db: Session = Depends(get_db)):
    """Create a new planner task and persist it."""
    return planner_service.create_task(db, body.model_dump())


@router.patch("/{task_id}", response_model=PlannerTask)
def update_task(task_id: str, body: PlannerTaskUpdate, db: Session = Depends(get_db)):
    """
    Partially update a task (PATCH — only send the fields you want to change).
    Raises 404 if the task doesn't exist.
    """
    task = planner_service.update_task(db, task_id, body.model_dump())
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found",
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    """Delete a task. Returns 204 on success, 404 if not found."""
    deleted = planner_service.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found",
        )
