from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models import ChatMessage, User

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessageCreate(BaseModel):
    body: str = Field(min_length=1, max_length=2000)


class ChatMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    sender_name: str
    sender_role: str
    body: str
    created_at: str


@router.get("/messages", response_model=list[ChatMessageOut])
def list_messages(
    _: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    after_id: int | None = Query(default=None, ge=1),
) -> list[ChatMessageOut]:
    q = db.query(ChatMessage).order_by(ChatMessage.id.asc())
    if after_id is not None:
        q = q.filter(ChatMessage.id > after_id)
    rows = q.limit(limit).all()
    return [
        ChatMessageOut(
            id=m.id,
            sender_id=m.sender_id,
            sender_name=(m.sender.full_name or m.sender.email) if m.sender else f"User #{m.sender_id}",
            sender_role=m.sender.role if m.sender else "unknown",
            body=m.body,
            created_at=m.created_at.isoformat() if m.created_at else "",
        )
        for m in rows
    ]


@router.post("/messages", response_model=ChatMessageOut)
def post_message(
    body: ChatMessageCreate,
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> ChatMessageOut:
    msg = ChatMessage(sender_id=user.id, body=body.body.strip())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return ChatMessageOut(
        id=msg.id,
        sender_id=msg.sender_id,
        sender_name=user.full_name or user.email,
        sender_role=user.role,
        body=msg.body,
        created_at=msg.created_at.isoformat() if msg.created_at else "",
    )
