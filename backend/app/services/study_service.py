"""
app/services/study_service.py
──────────────────────────────
Calls ai_service and maps the result to StudyResponse.
Always returns notes + flashcards + quiz together.
"""

from app.services import ai_service


async def generate_study_content(
    topic: str | None,
    subject: str | None,
    context: str,
    flashcard_count: int,
    quiz_count: int,
) -> dict:
    data = await ai_service.generate(topic, subject, context, flashcard_count, quiz_count)

    # Map quiz: convert correct_answer string → answer index
    questions = []
    for q in data.get("quiz", []):
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

    # Map flashcards: question→front, answer→back
    cards = [
        {"front": c.get("question", ""), "back": c.get("answer", "")}
        for c in data.get("flashcards", [])
    ]

    display_topic = topic or "(from uploaded file)"

    return {
        "session_type": "full",
        "topic":        display_topic,
        "subject":      subject,
        "xp_reward":    100,
        "estimated_minutes": 20,
        "notes": {
            "title":         display_topic,
            "sections":      data.get("sections", []),
            "key_takeaways": data.get("key_takeaways", []),
            "xp_reward":     100,
        },
        "questions": questions,
        "cards":     cards,
    }
