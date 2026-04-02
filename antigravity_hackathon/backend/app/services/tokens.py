from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from app.config import get_settings


def create_access_token(user_id: int, email: str, role: str, expires_hours: int = 24) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + timedelta(hours=expires_hours),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
