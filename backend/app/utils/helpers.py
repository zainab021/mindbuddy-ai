"""
app/utils/helpers.py
────────────────────
Small utility functions used throughout the app.

These are generic helpers — not specific to any one feature.
"""

import secrets
from datetime import datetime, timedelta, timezone


def now_iso() -> str:
    """Return the current UTC time as an ISO 8601 string.

    Example output: '2025-05-24T14:32:00.123456+00:00'
    """
    return datetime.now(timezone.utc).isoformat()


def make_id(prefix: str = "") -> str:
    """Generate a random ID with an optional prefix.

    Example: make_id("u_")  →  "u_a3f9b2c1"
    """
    return f"{prefix}{secrets.token_hex(4)}"


def generate_token() -> str:
    """Generate a secure random token (64 hex characters).

    NOTE: This is NOT a real JWT. It's a simple random token for demo purposes.
    In production, use python-jose or PyJWT to create signed JWT tokens.

    Example output: 'a3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5...'
    """
    return secrets.token_hex(32)


def minutes_ago(minutes: int) -> str:
    """Return an ISO timestamp for `minutes` minutes in the past.

    Used to create realistic-looking timestamps for mock data.
    Example: minutes_ago(30)  →  '2025-05-24T14:02:00+00:00'
    """
    return (datetime.now(timezone.utc) - timedelta(minutes=minutes)).isoformat()


def days_from_now(days: int) -> str:
    """Return an ISO timestamp `days` days in the future.

    Used to create due dates for planner tasks.
    Example: days_from_now(3)  →  '2025-05-27T14:32:00+00:00'
    """
    return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()


def safe_get(lst: list, index: int, default=None):
    """Safely get an item from a list by index without raising IndexError.

    Example: safe_get([1, 2, 3], 10, 0)  →  0
    """
    try:
        return lst[index]
    except IndexError:
        return default
