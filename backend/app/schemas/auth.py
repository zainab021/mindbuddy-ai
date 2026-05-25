"""
app/schemas/auth.py
───────────────────
Pydantic models for /auth routes.
"""

from pydantic import BaseModel, EmailStr, Field


# ── Request schemas ────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6)


# ── Response schemas ───────────────────────────────────────────────────────

class UserPublic(BaseModel):
    """User fields safe to send to the client."""
    id: str
    name: str
    email: str
    xp: int
    streak: int


class AuthResponse(BaseModel):
    token: str
    user: UserPublic
