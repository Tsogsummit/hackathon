from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class LessonTranscript(Base):
    __tablename__ = "lesson_transcripts"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    audio_filename = Column(String(255), nullable=True)
    audio_duration = Column(Integer, nullable=True)  # seconds
    raw_text = Column(Text, nullable=True)
    word_count = Column(Integer, nullable=True)
    chimege_status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson")
    teacher = relationship("User", foreign_keys=[teacher_id])


class LessonMaterial(Base):
    __tablename__ = "lesson_materials"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    transcript_id = Column(Integer, ForeignKey("lesson_transcripts.id", ondelete="SET NULL"), nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject_detected = Column(String(100), nullable=True)
    grade_detected = Column(String(50), nullable=True)
    summary = Column(Text, nullable=True)
    key_points = Column(JSONB, nullable=True)
    homework = Column(JSONB, nullable=True)
    exercises = Column(JSONB, nullable=True)
    exam_questions = Column(JSONB, nullable=True)
    next_lesson_plan = Column(JSONB, nullable=True)
    quality_warning = Column(Boolean, nullable=False, default=False)
    teacher_approved = Column(Boolean, nullable=False, default=False)
    sent_to_students = Column(Boolean, nullable=False, default=False)
    distributed_at = Column(DateTime(timezone=True), nullable=True)
    gemini_status = Column(String(50), nullable=False, default="pending")
    original_gemini_output = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    lesson = relationship("Lesson")
    transcript = relationship("LessonTranscript")
    teacher = relationship("User", foreign_keys=[teacher_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
