"""
app/routes/auth.py
──────────────────
Authentication routes:
  POST /auth/login   — log in with email + password
  POST /auth/signup  — create a new account
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, SignupRequest, AuthResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
def login(body: LoginRequest):
    """
    Authenticate an existing user.
    Returns a token + user profile on success.
    Raises 401 if credentials are wrong.
    """
    user = auth_service.authenticate_user(body.email, body.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return auth_service.build_auth_response(user)


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest):
    """
    Register a new user.
    Returns a token + user profile on success.
    Raises 409 if the email is already taken.
    """
    try:
        user = auth_service.register_user(body.name, body.email, body.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )
    return auth_service.build_auth_response(user)
