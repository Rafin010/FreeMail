"""Security utilities: password hashing, JWT tokens, etc."""

import secrets
import string
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt

from app.config import settings

ph = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash a password using Argon2."""
    return ph.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    try:
        return ph.verify(hashed, password)
    except VerifyMismatchError:
        return False


def create_access_token(user_id: str | uuid.UUID, workspace_id: str | uuid.UUID | None = None) -> str:
    """Create a short-lived JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode: dict[str, Any] = {
        "sub": str(user_id),
        "exp": expire,
        "type": "access",
    }
    if workspace_id:
        to_encode["ws"] = str(workspace_id)
        
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token() -> str:
    """Create a secure random string for refresh token."""
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(64))


def generate_api_key() -> tuple[str, str, str]:
    """Generate a new API key. Returns (raw_key, prefix, hashed_key)."""
    raw_key = f"fm_{secrets.token_urlsafe(32)}"
    prefix = raw_key[:8]
    hashed_key = hash_password(raw_key)
    return raw_key, prefix, hashed_key
