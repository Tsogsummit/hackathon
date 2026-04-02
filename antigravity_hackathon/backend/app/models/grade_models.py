from sqlalchemy import Date, Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class StudentGradeRecord(Base):
    __tablename__ = "student_grade_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    term = Column(String(50), nullable=False, default="2026-Q2")

    homework_avg = Column(Float, nullable=False)
    quiz_avg = Column(Float, nullable=False)
    project_score = Column(Float, nullable=False)
    attendance_rate = Column(Float, nullable=False)
    midterm_exam = Column(Float, nullable=False)
    final_exam = Column(Float, nullable=False)
    behavior_score = Column(Float, nullable=False, default=100.0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("User", foreign_keys=[student_id])
    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])


class StudentGradePrediction(Base):
    __tablename__ = "student_grade_predictions"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("student_grade_records.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    predicted_score = Column(Float, nullable=False)
    predicted_grade = Column(String(5), nullable=False)  # A/B/C/D/F
    risk_level = Column(String(20), nullable=False)  # low/medium/high
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    record = relationship("StudentGradeRecord")
    student = relationship("User", foreign_keys=[student_id])
    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])

class StudentDailyGrade(Base):
    __tablename__ = "student_daily_grades"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)

    homework_score = Column(Float, nullable=True)
    quiz_score = Column(Float, nullable=True)
    project_score = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    lesson = relationship("Lesson")
    student = relationship("User", foreign_keys=[student_id])
    school_class = relationship("SchoolClass")
    teacher = relationship("User", foreign_keys=[teacher_id])

