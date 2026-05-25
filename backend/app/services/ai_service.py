"""
app/services/ai_service.py
──────────────────────────
Calls Groq with a hard 10-second timeout.
Falls back to mock data on timeout, bad key, network error, or bad JSON.

Three entry points:
  generate()               — study session (notes + flashcards + quiz together)
  generate_flashcard_deck() — flashcard deck only
  generate_quiz_content()  — quiz questions only
"""

import asyncio
import json
import logging

from groq import Groq

from app.config.settings import GROQ_API_KEY
from app.data.mock import STUDY_CARDS_TEMPLATE, STUDY_NOTES_TEMPLATE, STUDY_QUIZ_TEMPLATE

logger = logging.getLogger(__name__)

GROQ_MODEL   = "llama-3.3-70b-versatile"
HARD_TIMEOUT = 10  # seconds


# ── Helpers ────────────────────────────────────────────────────────────────

def _strip_fences(raw: str) -> str:
    """Strip markdown code fences if Groq wraps the JSON in them."""
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    return raw


def _call_groq(prompt: str, max_tokens: int = 2048) -> dict:
    """Shared blocking Groq call — runs inside asyncio.to_thread."""
    client = Groq(api_key=GROQ_API_KEY, timeout=8.0)
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": "Return valid JSON only. No markdown, no prose."},
            {"role": "user",   "content": prompt},
        ],
        temperature=0.7,
        max_tokens=max_tokens,
    )
    raw = response.choices[0].message.content.strip()
    return json.loads(_strip_fences(raw))


async def _groq(prompt: str, fallback_fn, max_tokens: int = 2048) -> dict:
    """Shared async wrapper: timeout + fallback on any failure."""
    if not GROQ_API_KEY:
        return fallback_fn("GROQ_API_KEY not set")
    try:
        result = await asyncio.wait_for(
            asyncio.to_thread(_call_groq, prompt, max_tokens),
            timeout=HARD_TIMEOUT,
        )
        return result
    except asyncio.TimeoutError:
        return fallback_fn(f"timed out after {HARD_TIMEOUT}s")
    except Exception as exc:
        logger.error("Groq error: %s — fallback", exc)
        return fallback_fn(str(exc))


# ── Study session (notes + flashcards + quiz) ──────────────────────────────

def _study_prompt(topic, subject, context, flashcard_count, quiz_count) -> str:
    parts = []
    if topic:
        parts.append(f'Topic: "{topic}"')
    if subject:
        parts.append(f"Subject: {subject}")
    if context:
        parts.append(f"\nSource material:\n{context}\n")
    intro = "\n".join(parts) if parts else "Generate general study content."
    return f"""You are an expert tutor. {intro}

Return ONLY valid JSON — no markdown, no code fences, no extra text:

{{
  "summary": "2-3 sentence overview",
  "sections": [
    {{"heading": "Core Concept",     "body": "Main idea"}},
    {{"heading": "How It Works",     "body": "Step-by-step"}},
    {{"heading": "Key Applications", "body": "Real-world uses"}}
  ],
  "key_takeaways": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "flashcards": [{{"question": "Q?", "answer": "A"}}],
  "quiz": [{{
    "question": "Q?",
    "options": ["Correct", "Wrong B", "Wrong C", "Wrong D"],
    "correct_answer": "Correct",
    "explanation": "Why correct"
  }}]
}}

RULES:
- flashcards array must have EXACTLY {flashcard_count} items
- quiz array must have EXACTLY {quiz_count} items
- All content must relate to the topic/source above"""


def _study_fallback(reason: str = "Groq unavailable") -> dict:
    logger.warning("Study mock fallback — %s", reason)
    return {
        "summary": f"Sample content ({reason}).",
        "sections":      STUDY_NOTES_TEMPLATE["sections"],
        "key_takeaways": STUDY_NOTES_TEMPLATE["key_takeaways"],
        "flashcards": [{"question": c["front"], "answer": c["back"]} for c in STUDY_CARDS_TEMPLATE],
        "quiz": [
            {"question": q["question"], "options": q["options"],
             "correct_answer": q["options"][q["answer"]], "explanation": q["explanation"]}
            for q in STUDY_QUIZ_TEMPLATE
        ],
    }


async def generate(topic, subject, context, flashcard_count, quiz_count) -> dict:
    logger.info("Groq study → topic=%r  fc=%d  qc=%d", topic, flashcard_count, quiz_count)
    return await _groq(
        _study_prompt(topic, subject, context, flashcard_count, quiz_count),
        _study_fallback,
    )


# ── Flashcard deck generation ──────────────────────────────────────────────

def _flashcard_prompt(deck_name: str, subject: str | None, topic: str, count: int) -> str:
    subject_line = f"Subject: {subject}\n" if subject else ""
    return f"""You are an expert tutor creating flashcards.

Deck: "{deck_name}"
{subject_line}Topic: {topic}

Return ONLY valid JSON:

{{
  "flashcards": [
    {{"front": "Question or concept?", "back": "Clear, concise answer"}}
  ]
}}

RULES:
- flashcards array must have EXACTLY {count} items
- front: clear question or concept prompt
- back: concise, complete answer (use newlines for multi-step answers)
- All cards must relate to: {topic}"""


def _flashcard_fallback(reason: str = "Groq unavailable") -> dict:
    logger.warning("Flashcard mock fallback — %s", reason)
    cards = (STUDY_CARDS_TEMPLATE * 4)[:20]
    return {"flashcards": [{"front": c["front"], "back": c["back"]} for c in cards]}


async def generate_flashcard_deck(
    deck_name: str, subject: str | None, topic: str, flashcard_count: int
) -> dict:
    logger.info("Groq flashcards → deck=%r  topic=%r  count=%d", deck_name, topic, flashcard_count)
    return await _groq(
        _flashcard_prompt(deck_name, subject, topic, flashcard_count),
        _flashcard_fallback,
    )


# ── Quiz generation ────────────────────────────────────────────────────────

def _quiz_prompt(topic: str, subject: str | None, question_count: int, difficulty: str) -> str:
    subject_line = f"Subject: {subject}\n" if subject else ""
    return f"""You are an expert quiz creator.

Topic: "{topic}"
{subject_line}Difficulty: {difficulty}
Questions: {question_count}

Return ONLY valid JSON:

{{
  "questions": [
    {{
      "question": "Question text?",
      "options": ["Correct answer", "Wrong B", "Wrong C", "Wrong D"],
      "correct_answer": "Correct answer",
      "explanation": "Why this is correct"
    }}
  ]
}}

RULES:
- questions array must have EXACTLY {question_count} items
- correct_answer must exactly match one of the options strings
- Shuffle the correct answer position across questions
- All questions must be about: {topic}
- Difficulty {difficulty}: {'basic recall' if difficulty == 'easy' else 'understanding & application' if difficulty == 'medium' else 'analysis & synthesis'}"""


def _quiz_fallback(reason: str = "Groq unavailable") -> dict:
    logger.warning("Quiz mock fallback — %s", reason)
    return {
        "questions": [
            {"question": q["question"], "options": q["options"],
             "correct_answer": q["options"][q["answer"]], "explanation": q["explanation"]}
            for q in STUDY_QUIZ_TEMPLATE
        ]
    }


async def generate_quiz_content(
    topic: str, subject: str | None, question_count: int, difficulty: str
) -> dict:
    logger.info("Groq quiz → topic=%r  count=%d  diff=%s", topic, question_count, difficulty)
    return await _groq(
        _quiz_prompt(topic, subject, question_count, difficulty),
        _quiz_fallback,
    )
