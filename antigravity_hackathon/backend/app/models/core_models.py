from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Table, Text, func, Date
from sqlalchemy.orm import relationship

from app.database import Base

class_enrollment = Table(
    "class_enrollments",
    Base.metadata,
    Column("class_id", Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), primary_key=True),
    Column("student_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)

parent_student_link = Table(
    "parent_student_links",
    Base.metadata,
    Column("parent_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("student_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)
    role = Column(String(32), nullable=False)  # student | teacher | parent | admin
    is_active = Column(Boolean, nullable=False, default=True)


class SchoolClass(Base):
    __tablename__ = "school_classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=True)

    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])


class StudentAttentionRecord(Base):
    __tablename__ = "student_attention_records"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    attention_score = Column(Float, nullable=False)  # 0..100
    notes = Column(Text, nullable=True)
    reported_to_teacher = Column(Boolean, nullable=False, default=False)
    reported_to_school = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson")
    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])
    student = relationship("User", foreign_keys=[student_id])


class StudentFaceProfile(Base):
    __tablename__ = "student_face_profiles"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    image_path = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("User", foreign_keys=[student_id])


class StudentEventReport(Base):
    __tablename__ = "student_event_reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    category = Column(String(50), nullable=False)  # bully | smoke | vape | violence | other
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="open")  # open | investigating | resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reporter_student = relationship("User", foreign_keys=[reporter_student_id])
    school_class = relationship("SchoolClass")
    lesson = relationship("Lesson")


class StudentAttendanceRecord(Base):
    __tablename__ = "student_attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True, server_default=func.current_date())
    status = Column(String(20), nullable=False, default="present")  # present | absent | late | excused
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    lesson = relationship("Lesson")
    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])
    student = relationship("User", foreign_keys=[student_id])


class UnknownFaceLog(Base):
    __tablename__ = "unknown_face_logs"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_path = Column(String(500), nullable=False)
    status = Column(String(30), nullable=False, default="open")  # open | reviewed | ignored
    note = Column(Text, nullable=True)
    detected_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson")
    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])
