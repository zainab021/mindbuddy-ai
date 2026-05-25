"""
app/schemas/study.py
────────────────────
Pydantic response schemas for POST /study/generate.
The route now accepts multipart/form-data (Form + File params).
"""

from typing import Optional
from pydantic import BaseModel


class NoteSection(BaseModel):
    heading: str
    body: str


class StudyNotes(BaseModel):
    title: str
    sections: list[NoteSection]
    key_takeaways: list[str]
    xp_reward: int


class PracticeQuestion(BaseModel):
    question: str
    options: list[str]
    answer: int
    explanation: str


class StudyCard(BaseModel):
    front: str
    back: str


class StudyResponse(BaseModel):
    """Always returns all three: notes, questions, and cards."""
    session_type: str
    topic: str
    subject: Optional[str]
    xp_reward: int
    estimated_minutes: int
    notes: Optional[StudyNotes] = None
    questions: Optional[list[PracticeQuestion]] = None
    cards: Optional[list[StudyCard]] = None
