"""
app/routes/quiz.py
──────────────────
Quiz routes:
  GET  /quiz                      — list all quizzes
  GET  /quiz/{quiz_id}            — quiz with questions (answers hidden)
  POST /quiz/{quiz_id}/submit     — submit answers, get result
  POST /quiz/generate             — AI-generate a quiz via Groq
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.quiz import (
    QuizItem, QuizWithQuestions, QuizSubmitRequest, QuizResult,
    QuizGenerateRequest, QuizGenerateResponse,
)
from app.services import ai_service, quiz_service
from app.data.mock import MOCK_QUIZZES
from app.utils.helpers import make_id

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.get("", response_model=list[QuizItem])
def list_quizzes():
    return MOCK_QUIZZES


@router.post("/generate", response_model=QuizGenerateResponse,
             status_code=status.HTTP_200_OK)
async def generate_quiz(body: QuizGenerateRequest):
    """Generate quiz questions using Groq AI. Falls back to mock on failure."""
    data = await ai_service.generate_quiz_content(
        topic=body.topic,
        subject=body.subject,
        question_count=body.question_count,
        difficulty=body.difficulty,
    )

    questions = []
    for q in data.get("questions", []):
        options = q.get("options", [])
        correct = q.get("correct_answer", "")
        try:
            answer_idx = options.index(correct)
        except ValueError:
            answer_idx = 0
        questions.append({
            "question":    q.get("question", ""),
            "options":     options,
            "answer":      answer_idx,
            "explanation": q.get("explanation", ""),
        })

    duration = max(5, len(questions))  # ~1 min per question

    quiz = {
        "id":               make_id("quiz"),
        "title":            body.topic,
        "subject":          body.subject or "General",
        "difficulty":       body.difficulty,
        "duration_minutes": duration,
        "question_count":   len(questions),
        "tags":             [body.topic.lower()[:30]],
        "questions":        questions,
    }
    return {"quiz": quiz}


@router.get("/{quiz_id}", response_model=QuizWithQuestions)
def get_quiz(quiz_id: str):
    quiz = next((q for q in MOCK_QUIZZES if q["id"] == quiz_id), None)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Quiz '{quiz_id}' not found")
    raw_questions = quiz_service.get_questions_for_quiz(quiz_id)
    public_questions = [
        {"id": q["id"], "question": q["question"], "options": q["options"]}
        for q in raw_questions
    ]
    return {**quiz, "questions": public_questions}


@router.post("/{quiz_id}/submit", response_model=QuizResult,
             status_code=status.HTTP_200_OK)
def submit_quiz(quiz_id: str, body: QuizSubmitRequest):
    quiz = next((q for q in MOCK_QUIZZES if q["id"] == quiz_id), None)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Quiz '{quiz_id}' not found")
    return quiz_service.grade_quiz(
        quiz_id=quiz_id,
        answers=body.answers,
        time_used_seconds=body.time_used_seconds,
    )
