"""
app/routes/study.py
───────────────────
POST /study/generate — accepts multipart/form-data.

Fields:
  topic           (optional str)  — what the student wants to study
  subject         (optional str)  — e.g. "Mathematics"
  flashcard_count (int, 1-20)     — how many flashcards to generate
  quiz_count      (int, 1-10)     — how many quiz questions to generate
  file            (optional file) — PDF or image to extract text from

Returns notes + flashcards + quiz in one response.
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.schemas.study import StudyResponse
from app.services import study_service
from app.utils.file_utils import extract_image_text, extract_pdf_text

router = APIRouter(prefix="/study", tags=["Study"])


@router.post("/generate", response_model=StudyResponse, status_code=status.HTTP_200_OK)
async def generate_study(
    topic:           str | None = Form(default=None),
    subject:         str | None = Form(default=None),
    flashcard_count: int        = Form(default=5, ge=1, le=20),
    quiz_count:      int        = Form(default=3, ge=1, le=10),
    file:            UploadFile | None = File(default=None),
):
    """
    Generate study notes, flashcards, and quiz questions from a topic and/or uploaded file.
    At least one of `topic` or `file` must be provided.
    """
    # Validate: need at least topic or file
    if not (topic and topic.strip()) and file is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide at least a topic or upload a file.",
        )

    # Extract text from uploaded file
    context = ""
    if file is not None:
        content_type = (file.content_type or "").lower()
        file_data = await file.read()

        if "pdf" in content_type:
            context = extract_pdf_text(file_data)
            if not context:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Could not extract text from the uploaded PDF. Make sure it contains selectable text.",
                )
        elif content_type.startswith("image/"):
            extract_image_text(file_data)  # logs the warning
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Image text extraction is not enabled yet. Please upload a PDF or type your topic.",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unsupported file type '{content_type}'. Upload a PDF or image.",
            )

    result = await study_service.generate_study_content(
        topic=topic.strip() if topic else None,
        subject=subject,
        context=context,
        flashcard_count=flashcard_count,
        quiz_count=quiz_count,
    )
    return result
