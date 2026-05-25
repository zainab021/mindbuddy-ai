"""
app/routes/flashcards.py
─────────────────────────
Flashcard routes:
  GET  /flashcards              — list all decks
  GET  /flashcards/{deck_id}    — deck with cards
  POST /flashcards              — create empty deck
  POST /flashcards/generate     — AI-generate deck + cards via Groq
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.flashcards import (
    FlashcardDeck, FlashcardDeckWithCards, FlashcardDeckCreate,
    FlashcardGenerateRequest, FlashcardGenerateResponse,
)
from app.services import ai_service
from app.data.mock import MOCK_DECKS, MOCK_CARDS
from app.utils.helpers import make_id, now_iso

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

_decks: list[dict] = list(MOCK_DECKS)
_generated_cards: dict[str, list[dict]] = {}

_SUBJECT_COLORS: dict[str, str] = {
    "Mathematics":      "#7c3aed",
    "Physics":          "#2563eb",
    "Computer Science": "#4f46e5",
    "Chemistry":        "#0891b2",
    "Biology":          "#059669",
    "History":          "#d97706",
    "Literature":       "#db2777",
}


@router.get("", response_model=list[FlashcardDeck])
def list_decks():
    return _decks


@router.get("/{deck_id}", response_model=FlashcardDeckWithCards)
def get_deck(deck_id: str):
    deck = next((d for d in _decks if d["id"] == deck_id), None)
    if deck is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Deck '{deck_id}' not found")
    # AI-generated cards take priority; fall back to mock cards
    cards = _generated_cards.get(deck_id, MOCK_CARDS.get(deck_id, []))
    return {**deck, "cards": cards}


@router.post("", response_model=FlashcardDeck, status_code=status.HTTP_201_CREATED)
def create_deck(body: FlashcardDeckCreate):
    new_deck = {
        "id": make_id("deck"),
        "title": body.title,
        "subject": body.subject,
        "card_count": 0,
        "mastery_pct": 0,
        "last_studied_at": None,
        "color_hex": body.color_hex,
        "created_at": now_iso(),
    }
    _decks.append(new_deck)
    return new_deck


@router.post("/generate", response_model=FlashcardGenerateResponse,
             status_code=status.HTTP_200_OK)
async def generate_deck(body: FlashcardGenerateRequest):
    """Generate a flashcard deck using Groq AI. Falls back to mock on failure."""
    data = await ai_service.generate_flashcard_deck(
        deck_name=body.deck_name,
        subject=body.subject,
        topic=body.topic,
        flashcard_count=body.flashcard_count,
    )

    color_hex = _SUBJECT_COLORS.get(body.subject or "", "#7c3aed")
    deck_id   = make_id("deck")

    cards = [
        {
            "id":          make_id("card"),
            "deck_id":     deck_id,
            "front":       c.get("front", ""),
            "back":        c.get("back", ""),
            "mastery_pct": 0,
            "difficulty":  "medium",
        }
        for c in data.get("flashcards", [])
    ]

    new_deck = {
        "id":             deck_id,
        "title":          body.deck_name,
        "subject":        body.subject or "General",
        "card_count":     len(cards),
        "mastery_pct":    0,
        "last_studied_at": None,
        "color_hex":      color_hex,
    }

    _decks.insert(0, new_deck)
    _generated_cards[deck_id] = cards

    return {"deck": new_deck, "cards": cards}
