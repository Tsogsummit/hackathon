from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str | None = None
    role: Literal["student", "teacher", "parent", "admin", "principal"]


class AdminUserUpdate(BaseModel):
    full_name: str | None = None
    role: Literal["student", "teacher", "parent", "admin", "principal"] | None = None
    password: str | None = Field(default=None, min_length=6)
    is_active: bool | None = None


class AdminUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str | None
    role: str
    is_active: bool
