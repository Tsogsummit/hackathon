from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Lesson, User

bearer_scheme = HTTPBearer(auto_error=False)


def decode_token_payload(token: str) -> dict[str, Any]:
    settings = get_settings()
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


def get_current_user(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Нэвтрэх шаардлагатай")
    try:
        payload = decode_token_payload(creds.credentials)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Буруу токен")
    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Буруу токен")
    user_id = int(sub) if str(sub).isdigit() else None
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Буруу токен")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Хэрэглэгч олдсонгүй")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Энэ бүртгэл идэвхгүй")
    return user


def require_teacher(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Зөвхөн багш нэвтрэх эрхтэй")
    return user


def require_admin(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Зөвхөн админ")
    return user


def require_student(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    if user.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Зөвхөн сурагч")
    return user


def require_parent(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    if user.role != "parent":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Зөвхөн эцэг эх")
    return user


def get_lesson_for_teacher(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
) -> Lesson:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Хичээл олдсонгүй")
    if lesson.teacher_id != teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Та энэ хичээлд хамаарахгүй",
        )
    return lesson
