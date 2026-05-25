"""
app/schemas/quiz.py
───────────────────
Pydantic schemas for the /quiz routes.
"""

from typing import Optional
from pydantic import BaseModel, Field


class QuizQuestion(BaseModel):
    id: str
    question: str
    options: list[str]
    answer: int
    explanation: str


class QuizQuestionPublic(BaseModel):
    id: str
    question: str
    options: list[str]


class QuizItem(BaseModel):
    id: str
    title: str
    subject: str
    question_count: int
    duration_minutes: int
    difficulty: str
    completed_at: Optional[str] = None
    score: Optional[int] = None
    tags: list[str]


class QuizWithQuestions(QuizItem):
    questions: list[QuizQuestionPublic] = []


class QuizSubmitRequest(BaseModel):
    answers: dict[str, int]
    time_used_seconds: Optional[int] = Field(default=None)


class QuizResult(BaseModel):
    quiz_id: str
    score_pct: int
    correct_count: int
    total_count: int
    xp_earned: int
    time_used_seconds: Optional[int] = None
    grade: str
    per_question: list[dict]


# ── AI generation ──────────────────────────────────────────────────────────

class QuizGenerateRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=300)
    subject: Optional[str] = None
    question_count: int = Field(default=5, ge=2, le=15)
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")


class GeneratedQuizQuestion(BaseModel):
    question: str
    options: list[str]
    answer: int
    explanation: str


class GeneratedQuizItem(BaseModel):
    id: str
    title: str
    subject: str
    difficulty: str
    duration_minutes: int
    question_count: int
    tags: list[str]
    questions: list[GeneratedQuizQuestion]


class QuizGenerateResponse(BaseModel):
    quiz: GeneratedQuizItem
