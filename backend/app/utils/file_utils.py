"""
app/utils/file_utils.py
────────────────────────
Extracts text from uploaded files (PDF or image).
Used by POST /study/generate to turn uploaded content into a Groq prompt.
"""

import io
import logging

logger = logging.getLogger(__name__)

MAX_CHARS = 4000  # Keep context short to avoid token overflow


def extract_pdf_text(data: bytes) -> str:
    """
    Extract plain text from a PDF file.
    Returns up to MAX_CHARS of text, or an error message on failure.
    """
    try:
        from pypdf import PdfReader

        reader = PdfReader(io.BytesIO(data))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
            if len(text) >= MAX_CHARS:
                break

        text = text[:MAX_CHARS].strip()
        logger.info("PDF extracted: %d chars from %d pages", len(text), len(reader.pages))
        return text

    except Exception as exc:
        logger.error("PDF extraction failed: %s", exc)
        return ""


def extract_image_text(data: bytes) -> str:
    """
    OCR for images — not enabled in this deployment.
    Returns an empty string and logs the reason.
    """
    logger.warning("Image OCR requested but not enabled")
    return ""
