"""
app/services/quiz_service.py
─────────────────────────────
Quiz grading and question retrieval logic.
"""

from app.data.mock import MOCK_QUESTIONS


def get_questions_for_quiz(quiz_id: str) -> list[dict]:
    """Return the full question list for a quiz (with answers — server-side only)."""
    return MOCK_QUESTIONS.get(quiz_id, [])


def grade_quiz(quiz_id: str, answers: dict[str, int], time_used_seconds: int | None) -> dict:
    """
    Grade a submitted quiz.

    answers: {question_id: chosen_option_index}
    Returns a QuizResult-compatible dict.
    """
    questions = get_questions_for_quiz(quiz_id)

    correct_count = 0
    per_question = []

    for q in questions:
        q_id = q["id"]
        correct_answer = q["answer"]
        your_answer = answers.get(q_id)          # None if the student skipped it
        is_correct = your_answer == correct_answer

        if is_correct:
            correct_count += 1

        per_question.append({
            "question_id": q_id,
            "question": q["question"],
            "correct": is_correct,
            "your_answer": your_answer,
            "correct_answer": correct_answer,
            "explanation": q["explanation"],
        })

    total = len(questions)
    score_pct = round((correct_count / total) * 100) if total > 0 else 0

    # Grade thresholds: A ≥ 90, B ≥ 75, C ≥ 60, D ≥ 50, F < 50
    if score_pct >= 90:
        grade = "A"
    elif score_pct >= 75:
        grade = "B"
    elif score_pct >= 60:
        grade = "C"
    elif score_pct >= 50:
        grade = "D"
    else:
        grade = "F"

    # XP scales with score — minimum 10 XP for attempting
    xp_earned = max(10, round(score_pct * 0.5))

    return {
        "quiz_id": quiz_id,
        "score_pct": score_pct,
        "correct_count": correct_count,
        "total_count": total,
        "xp_earned": xp_earned,
        "time_used_seconds": time_used_seconds,
        "grade": grade,
        "per_question": per_question,
    }
