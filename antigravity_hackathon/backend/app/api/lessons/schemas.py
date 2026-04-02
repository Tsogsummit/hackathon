from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class RecordingUrlBody(BaseModel):
    recording_url: str


class TranscribeResponse(BaseModel):
    transcript_id: int
    text: str
    word_count: int
    warnings: list[str] = Field(default_factory=list)
    stt_source: str | None = None  # chimege | whisper


class LessonMetadata(BaseModel):
    subject: str | None = None
    grade: str | None = None
    topic: str | None = None


class GenerateMaterialsBody(BaseModel):
    transcript_id: int
    metadata: LessonMetadata = Field(default_factory=LessonMetadata)


class GenerateMaterialsResponse(BaseModel):
    job_id: str


class JobStatusResponse(BaseModel):
    status: str
    step: int | None = None
    message: str | None = None
    material_id: int | None = None
    result: dict[str, Any] | None = None
    error: str | None = None
    transcript_id: int | None = None


class MaterialListItem(BaseModel):
    id: int
    lesson_id: int
    transcript_id: int | None
    created_at: datetime | None
    teacher_approved: bool
    sent_to_students: bool
    quality_warning: bool
    subject_detected: str | None
    grade_detected: str | None
    summary: str | None
    key_points: list[Any] | None = None
    homework: dict[str, Any] | None = None
    exercises: list[Any] | None = None
    exam_questions: list[Any] | None = None
    next_lesson_plan: dict[str, Any] | None = None

    model_config = ConfigDict(from_attributes=True)


class DistributeBody(BaseModel):
    class_id: int | None = None
    notify_parents: bool = True


class DistributeResponse(BaseModel):
    notified_count: int
    distributed_at: datetime
