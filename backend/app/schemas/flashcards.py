"""
app/schemas/flashcards.py
─────────────────────────
Pydantic schemas for the /flashcards routes.
"""

from typing import Optional
from pydantic import BaseModel, Field


class FlashcardCard(BaseModel):
    id: str
    deck_id: str
    front: str
    back: str
    mastery_pct: int
    difficulty: str


class FlashcardDeck(BaseModel):
    id: str
    title: str
    subject: str
    card_count: int
    mastery_pct: int
    last_studied_at: Optional[str] = None
    color_hex: str


class FlashcardDeckWithCards(FlashcardDeck):
    cards: list[FlashcardCard] = []


class FlashcardDeckCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    subject: str
    color_hex: str = "#7c3aed"


# ── AI generation ──────────────────────────────────────────────────────────

class FlashcardGenerateRequest(BaseModel):
    deck_name: str = Field(min_length=2, max_length=100)
    subject: Optional[str] = None
    topic: str = Field(min_length=3, max_length=300)
    flashcard_count: int = Field(default=8, ge=3, le=20)


class FlashcardGenerateResponse(BaseModel):
    deck: FlashcardDeck
    cards: list[FlashcardCard]
