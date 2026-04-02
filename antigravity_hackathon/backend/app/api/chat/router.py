from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import or_, and_, func, case
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models import ChatMessage, DirectMessage, User

router = APIRouter(prefix="/chat", tags=["chat"])


# ── Schemas ──────────────────────────────────────────────────────────

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


class DMCreate(BaseModel):
    body: str = Field(min_length=1, max_length=5000)


class DMOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    sender_name: str
    body: str
    created_at: str
    is_mine: bool


class ConversationOut(BaseModel):
    user_id: int
    full_name: str
    role: str
    last_message: str
    last_at: str
    unread: int


class UserListItemOut(BaseModel):
    id: int
    full_name: str
    role: str


# ── Group chat (existing) ───────────────────────────────────────────

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


# ── Direct messages ─────────────────────────────────────────────────

@router.get("/users", response_model=list[UserListItemOut])
def list_chateable_users(
    me: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
    q: str = Query(default="", max_length=100),
) -> list[UserListItemOut]:
    query = db.query(User).filter(User.id != me.id, User.is_active.is_(True))
    if q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(User.full_name.ilike(term), User.email.ilike(term))
        )
    rows = query.order_by(User.full_name.asc()).limit(50).all()
    return [
        UserListItemOut(id=u.id, full_name=u.full_name or u.email, role=u.role)
        for u in rows
    ]


@router.get("/dm/conversations", response_model=list[ConversationOut])
def list_conversations(
    me: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> list[ConversationOut]:
    other_id = case(
        (DirectMessage.sender_id == me.id, DirectMessage.receiver_id),
        else_=DirectMessage.sender_id,
    )
    sub = (
        db.query(
            other_id.label("other_id"),
            func.max(DirectMessage.id).label("last_id"),
        )
        .filter(or_(DirectMessage.sender_id == me.id, DirectMessage.receiver_id == me.id))
        .group_by(other_id)
        .subquery()
    )
    rows = (
        db.query(DirectMessage, User)
        .join(sub, DirectMessage.id == sub.c.last_id)
        .join(User, User.id == sub.c.other_id)
        .order_by(DirectMessage.id.desc())
        .all()
    )
    return [
        ConversationOut(
            user_id=u.id,
            full_name=u.full_name or u.email,
            role=u.role,
            last_message=(dm.body or "")[:80],
            last_at=dm.created_at.isoformat() if dm.created_at else "",
            unread=0,
        )
        for dm, u in rows
    ]


@router.get("/dm/{user_id}", response_model=list[DMOut])
def get_dm_thread(
    user_id: int,
    me: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    before_id: int | None = Query(default=None, ge=1),
) -> list[DMOut]:
    peer = db.query(User).filter(User.id == user_id).first()
    if not peer:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")

    q = db.query(DirectMessage).filter(
        or_(
            and_(DirectMessage.sender_id == me.id, DirectMessage.receiver_id == user_id),
            and_(DirectMessage.sender_id == user_id, DirectMessage.receiver_id == me.id),
        )
    )
    if before_id is not None:
        q = q.filter(DirectMessage.id < before_id)
    rows = q.order_by(DirectMessage.id.desc()).limit(limit).all()
    rows.reverse()

    return [
        DMOut(
            id=m.id,
            sender_id=m.sender_id,
            receiver_id=m.receiver_id,
            sender_name=(m.sender.full_name or m.sender.email) if m.sender else "",
            body=m.body,
            created_at=m.created_at.isoformat() if m.created_at else "",
            is_mine=m.sender_id == me.id,
        )
        for m in rows
    ]


@router.post("/dm/{user_id}", response_model=DMOut)
def send_dm(
    user_id: int,
    body: DMCreate,
    me: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> DMOut:
    peer = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not peer:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
    if peer.id == me.id:
        raise HTTPException(status_code=400, detail="Өөртөө зурвас илгээх боломжгүй")

    msg = DirectMessage(sender_id=me.id, receiver_id=peer.id, body=body.body.strip())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return DMOut(
        id=msg.id,
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        sender_name=me.full_name or me.email,
        body=msg.body,
        created_at=msg.created_at.isoformat() if msg.created_at else "",
        is_mine=True,
    )
