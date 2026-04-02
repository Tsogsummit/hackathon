import logging

from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import User
from app.services.passwords import hash_password

_log = logging.getLogger("uvicorn.error")


def ensure_bootstrap_admin(db: Session) -> None:
    settings = get_settings()
    if not settings.bootstrap_admin_email or not settings.bootstrap_admin_password:
        return
    n = db.query(User).count()
    if n > 0:
        return
    email = settings.bootstrap_admin_email.strip().lower()
    u = User(
        email=email,
        password_hash=hash_password(settings.bootstrap_admin_password),
        full_name=settings.bootstrap_admin_name,
        role="admin",
        is_active=True,
    )
    db.add(u)
    db.commit()
    _log.warning("Анхны админ үүслээ: %s (BOOTSTRAP_ADMIN_* .env-аас устгана уу)", email)
