from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.auth.schemas import LoginRequest, MeResponse, TokenResponse
from app.core.security import get_current_user
from app.database import get_db
from app.models import User
from app.services.passwords import verify_password
from app.services.tokens import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="И-мэйл эсвэл нууц үг буруу")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Бүртгэл идэвхгүй")
    token = create_access_token(user.id, user.email, user.role)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=MeResponse)
def me(user: Annotated[User, Depends(get_current_user)]) -> User:
    return user
