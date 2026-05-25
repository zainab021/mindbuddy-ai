"""
app/services/auth_service.py
────────────────────────────
Handles user authentication logic.
Uses in-memory storage (no database yet).
"""

import secrets
from app.data.mock import MOCK_USERS
from app.utils.helpers import make_id, now_iso

# In-memory user store — starts with mock users, grows as new users sign up
_users: list[dict] = list(MOCK_USERS)

# Active tokens → user_id mapping (simulates session store)
_tokens: dict[str, str] = {}


def find_user_by_email(email: str) -> dict | None:
    """Return the user dict matching the email, or None."""
    for user in _users:
        if user["email"].lower() == email.lower():
            return user
    return None


def authenticate_user(email: str, password: str) -> dict | None:
    """
    Check email + password.
    Returns the user dict on success, None on failure.
    NOTE: Passwords are stored as plain text here for demo purposes.
          In production, use bcrypt or argon2.
    """
    user = find_user_by_email(email)
    if user and user["password"] == password:
        return user
    return None


def register_user(name: str, email: str, password: str) -> dict:
    """
    Create and store a new user.
    Raises ValueError if the email is already taken.
    """
    if find_user_by_email(email):
        raise ValueError("Email already registered")

    new_user = {
        "id": make_id("u"),
        "name": name,
        "email": email,
        "password": password,   # plain text — demo only
        "avatar_url": None,
        "xp": 0,
        "streak": 0,
        "created_at": now_iso(),
    }
    _users.append(new_user)
    return new_user


def create_token(user_id: str) -> str:
    """Generate a random token and link it to the user_id."""
    token = secrets.token_hex(32)
    _tokens[token] = user_id
    return token


def build_auth_response(user: dict) -> dict:
    """
    Build the standard auth response dict.
    Called after login or signup.
    """
    token = create_token(user["id"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "avatar_url": user.get("avatar_url"),
            "xp": user.get("xp", 0),
            "streak": user.get("streak", 0),
        },
    }
