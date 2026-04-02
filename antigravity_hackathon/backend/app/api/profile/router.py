from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_parent, require_student
from app.database import get_db
from app.models import Lesson, LessonMaterial, Notification, SchoolClass, StudentAttendanceRecord, StudentGradePrediction, StudentGradeRecord, User
from app.models.core_models import class_enrollment, parent_student_link

router = APIRouter(prefix="/profile", tags=["profile"])


class NotificationOut(BaseModel):
    id: int
    title: str
    body: str
    read: bool


class ParentChildPredictionOut(BaseModel):
    prediction_id: int
    student_id: int
    student_name: str
    predicted_score: float
    predicted_grade: str
    risk_level: str
    summary: str


class BreakdownItemOut(BaseModel):
    date: str | None
    class_name: str | None
    lesson_title: str | None
    value: str


class StudentAcademicBreakdownOut(BaseModel):
    student_id: int
    student_name: str
    assignments: list[BreakdownItemOut]
    self_study: list[BreakdownItemOut]
    midterm: list[BreakdownItemOut]
    final: list[BreakdownItemOut]
    attendance: list[BreakdownItemOut]
    bonus: list[BreakdownItemOut]


@router.get("/notifications", response_model=list[NotificationOut])
def my_notifications(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.id.desc())
        .limit(50)
        .all()
    )


@router.get("/parent/children-predictions", response_model=list[ParentChildPredictionOut])
def parent_children_predictions(
    parent: Annotated[User, Depends(require_parent)],
    db: Annotated[Session, Depends(get_db)],
) -> list[ParentChildPredictionOut]:
    links = db.execute(
        select(parent_student_link.c.student_id).where(parent_student_link.c.parent_id == parent.id)
    ).all()
    student_ids = [r[0] for r in links]
    if not student_ids:
        return []
    rows = (
        db.query(StudentGradePrediction, User)
        .join(User, User.id == StudentGradePrediction.student_id)
        .filter(StudentGradePrediction.student_id.in_(student_ids))
        .order_by(StudentGradePrediction.id.desc())
        .limit(100)
        .all()
    )
    out: list[ParentChildPredictionOut] = []
    for p, s in rows:
        out.append(
            ParentChildPredictionOut(
                prediction_id=p.id,
                student_id=p.student_id,
                student_name=s.full_name or s.email,
                predicted_score=p.predicted_score,
                predicted_grade=p.predicted_grade,
                risk_level=p.risk_level,
                summary=p.summary,
            )
        )
    return out


def _iso(dt) -> str | None:
    return dt.isoformat() if dt else None


def _build_student_breakdown(student: User, db: Session) -> StudentAcademicBreakdownOut:
    class_rows = db.execute(select(class_enrollment.c.class_id).where(class_enrollment.c.student_id == student.id)).all()
    class_ids = [r[0] for r in class_rows]
    class_map = {c.id: c.name for c in db.query(SchoolClass).filter(SchoolClass.id.in_(class_ids)).all()} if class_ids else {}

    lessons = db.query(Lesson).filter(Lesson.class_id.in_(class_ids)).all() if class_ids else []
    lesson_by_id = {l.id: l for l in lessons}

    mats = (
        db.query(LessonMaterial)
        .filter(
            LessonMaterial.lesson_id.in_(list(lesson_by_id.keys())) if lesson_by_id else False,
            LessonMaterial.teacher_approved.is_(True),
            LessonMaterial.sent_to_students.is_(True),
        )
        .order_by(LessonMaterial.created_at.desc())
        .all()
        if lesson_by_id
        else []
    )

    assignments: list[BreakdownItemOut] = []
    self_study: list[BreakdownItemOut] = []
    for m in mats:
        les = lesson_by_id.get(m.lesson_id)
        cls_name = class_map.get(les.class_id) if les else None
        if m.homework:
            assignments.append(
                BreakdownItemOut(
                    date=_iso(m.created_at),
                    class_name=cls_name,
                    lesson_title=les.title if les else None,
                    value=str(m.homework),
                )
            )
        if m.exercises:
            self_study.append(
                BreakdownItemOut(
                    date=_iso(m.created_at),
                    class_name=cls_name,
                    lesson_title=les.title if les else None,
                    value=str(m.exercises),
                )
            )

    recs = (
        db.query(StudentGradeRecord)
        .filter(StudentGradeRecord.student_id == student.id)
        .order_by(StudentGradeRecord.updated_at.desc())
        .all()
    )
    midterm = [
        BreakdownItemOut(
            date=_iso(r.updated_at),
            class_name=class_map.get(r.class_id),
            lesson_title=None,
            value=f"{r.term}: {r.midterm_exam}",
        )
        for r in recs
    ]
    final = [
        BreakdownItemOut(
            date=_iso(r.updated_at),
            class_name=class_map.get(r.class_id),
            lesson_title=None,
            value=f"{r.term}: {r.final_exam}",
        )
        for r in recs
    ]
    bonus = [
        BreakdownItemOut(
            date=_iso(r.updated_at),
            class_name=class_map.get(r.class_id),
            lesson_title=None,
            value=f"{r.term}: {r.behavior_score}",
        )
        for r in recs
    ]

    att_rows = (
        db.query(StudentAttendanceRecord)
        .filter(StudentAttendanceRecord.student_id == student.id)
        .order_by(StudentAttendanceRecord.updated_at.desc(), StudentAttendanceRecord.created_at.desc())
        .all()
    )
    attendance = []
    for a in att_rows:
        les = lesson_by_id.get(a.lesson_id)
        attendance.append(
            BreakdownItemOut(
                date=_iso(a.updated_at or a.created_at),
                class_name=class_map.get(a.class_id),
                lesson_title=les.title if les else f"Lesson #{a.lesson_id}",
                value=f"{a.status}{(' | ' + a.note) if a.note else ''}",
            )
        )

    return StudentAcademicBreakdownOut(
        student_id=student.id,
        student_name=student.full_name or student.email,
        assignments=assignments,
        self_study=self_study,
        midterm=midterm,
        final=final,
        attendance=attendance,
        bonus=bonus,
    )


@router.get("/student/academic-breakdown", response_model=StudentAcademicBreakdownOut)
def student_academic_breakdown(
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentAcademicBreakdownOut:
    return _build_student_breakdown(student, db)


@router.get("/parent/children/academic-breakdown", response_model=list[StudentAcademicBreakdownOut])
def parent_children_academic_breakdown(
    parent: Annotated[User, Depends(require_parent)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentAcademicBreakdownOut]:
    links = db.execute(select(parent_student_link.c.student_id).where(parent_student_link.c.parent_id == parent.id)).all()
    student_ids = [r[0] for r in links]
    if not student_ids:
        return []
    students = db.query(User).filter(User.id.in_(student_ids), User.role == "student").all()
    if not students:
        raise HTTPException(status_code=404, detail="Холбогдсон сурагч олдсонгүй")
    return [_build_student_breakdown(s, db) for s in students]
