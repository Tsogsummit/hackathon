from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_student
from app.database import get_db
from app.models import (
    ClassTimetable,
    Lesson,
    LessonMaterial,
    Notification,
    SchoolClass,
    StudentEventReport,
    Subject,
    User,
    class_enrollment,
    parent_student_link,
)

router = APIRouter(prefix="/student", tags=["student"])


class StudentEventReportCreate(BaseModel):
    class_id: int
    lesson_id: int | None = None
    category: Literal["bully", "smoke", "vape", "violence", "other"]
    description: str = Field(min_length=5, max_length=3000)


class StudentEventReportOut(BaseModel):
    id: int
    reporter_student_id: int
    class_id: int
    lesson_id: int | None
    category: str
    description: str
    status: str


class StudentEventStatusPatch(BaseModel):
    status: Literal["open", "investigating", "resolved"]


class StudentTimetableItemOut(BaseModel):
    class_id: int
    class_name: str
    lesson_id: int | None = None
    lesson_title: str | None = None
    teacher_name: str | None = None
    weekday: int
    period_index: int
    start_time: str
    end_time: str
    subject_name: str | None
    is_lunch: bool


class LessonMaterialForStudentOut(BaseModel):
    lesson_id: int
    material_id: int
    summary: str | None
    key_points: list | None
    homework: dict | None
    exercises: list | None
    exam_questions: list | None
    next_lesson_plan: dict | None


@router.post("/event-reports", response_model=StudentEventReportOut, status_code=status.HTTP_201_CREATED)
def create_event_report(
    body: StudentEventReportCreate,
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentEventReport:
    enrolled = db.execute(
        select(class_enrollment.c.student_id).where(
            class_enrollment.c.class_id == body.class_id,
            class_enrollment.c.student_id == student.id,
        )
    ).first()
    if not enrolled:
        raise HTTPException(status_code=400, detail="Та энэ ангид бүртгэлгүй байна")

    lesson: Lesson | None = None
    if body.lesson_id is not None:
        lesson = db.query(Lesson).filter(Lesson.id == body.lesson_id).first()
        if not lesson or lesson.class_id != body.class_id:
            raise HTTPException(status_code=400, detail="lesson_id буруу эсвэл энэ ангид хамаарахгүй")

    report = StudentEventReport(
        reporter_student_id=student.id,
        class_id=body.class_id,
        lesson_id=body.lesson_id,
        category=body.category,
        description=body.description.strip(),
        status="open",
    )
    db.add(report)
    db.flush()

    # Notify teachers who teach this class
    teacher_rows = db.query(User).join(Lesson, Lesson.teacher_id == User.id).filter(
        Lesson.class_id == body.class_id,
        User.role == "teacher",
        User.is_active.is_(True),
    ).distinct(User.id).all()
    student_name = student.full_name or student.email
    lesson_txt = f", Хичээл #{body.lesson_id}" if body.lesson_id is not None else ""
    title = f"Сурагчийн үйл явдлын мэдэгдэл: {body.category}"
    msg = f"Сурагч: {student_name}, Анги #{body.class_id}{lesson_txt}. Тайлбар: {body.description.strip()}"
    for t in teacher_rows:
        db.add(Notification(user_id=t.id, title=title, body=msg, read=False))

    # Notify principals
    principals = db.query(User).filter(User.role == "principal", User.is_active.is_(True)).all()
    for p in principals:
        db.add(Notification(user_id=p.id, title=title, body=msg, read=False))

    db.commit()
    db.refresh(report)
    return report


@router.get("/event-reports/me", response_model=list[StudentEventReportOut])
def my_event_reports(
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentEventReport]:
    return (
        db.query(StudentEventReport)
        .filter(StudentEventReport.reporter_student_id == student.id)
        .order_by(StudentEventReport.id.desc())
        .all()
    )


@router.get("/event-reports", response_model=list[StudentEventReportOut])
def list_event_reports_for_school(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentEventReport]:
    if user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")
    return db.query(StudentEventReport).order_by(StudentEventReport.id.desc()).all()


@router.patch("/event-reports/{report_id}", response_model=StudentEventReportOut)
def patch_event_report_status(
    report_id: int,
    body: StudentEventStatusPatch,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentEventReport:
    if user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")
    report = db.query(StudentEventReport).filter(StudentEventReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Мэдэгдэл олдсонгүй")
    report.status = body.status
    db.commit()
    db.refresh(report)
    return report


@router.get("/timetable", response_model=list[StudentTimetableItemOut])
def my_timetable(
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
    class_id: int | None = Query(default=None, ge=1),
) -> list[StudentTimetableItemOut]:
    enrolled = db.execute(
        select(class_enrollment.c.class_id).where(class_enrollment.c.student_id == student.id)
    ).all()
    class_ids = [r[0] for r in enrolled]
    if not class_ids:
        return []
    if class_id is not None:
        if class_id not in class_ids:
            raise HTTPException(status_code=403, detail="Та энэ ангид бүртгэлгүй")
        class_ids = [class_id]

    rows = (
        db.query(ClassTimetable, SchoolClass.name, Subject.name, Subject.teacher_id)
        .join(SchoolClass, SchoolClass.id == ClassTimetable.class_id)
        .outerjoin(Subject, Subject.id == ClassTimetable.subject_id)
        .filter(ClassTimetable.class_id.in_(class_ids))
        .order_by(ClassTimetable.class_id.asc(), ClassTimetable.weekday.asc(), ClassTimetable.period_index.asc())
        .all()
    )
    teacher_ids = sorted({tid for _, _, _, tid in rows if tid is not None})
    teacher_map = {
        t.id: (t.full_name or t.email)
        for t in db.query(User).filter(User.id.in_(teacher_ids)).all()
    } if teacher_ids else {}

    lessons = db.query(Lesson).filter(Lesson.class_id.in_(class_ids)).all()
    lesson_by_class_teacher: dict[tuple[int, int], Lesson] = {}
    for les in lessons:
        lesson_by_class_teacher.setdefault((les.class_id, les.teacher_id), les)

    out: list[StudentTimetableItemOut] = []
    for r, class_name, subject_name, teacher_id in rows:
        les = lesson_by_class_teacher.get((r.class_id, teacher_id)) if teacher_id is not None else None
        out.append(
            StudentTimetableItemOut(
                class_id=r.class_id,
                class_name=class_name,
                lesson_id=les.id if les else None,
                lesson_title=les.title if les else None,
                teacher_name=teacher_map.get(teacher_id),
                weekday=r.weekday,
                period_index=r.period_index,
                start_time=r.start_time.strftime("%H:%M"),
                end_time=r.end_time.strftime("%H:%M"),
                subject_name=subject_name,
                is_lunch=r.is_lunch,
            )
        )
    return out


@router.get("/lessons/{lesson_id}/latest-material", response_model=LessonMaterialForStudentOut | None)
def latest_lesson_material_for_student_or_parent(
    lesson_id: int,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> LessonMaterialForStudentOut | None:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")

    if user.role == "student":
        enrolled = db.execute(
            select(class_enrollment.c.student_id).where(
                class_enrollment.c.class_id == lesson.class_id,
                class_enrollment.c.student_id == user.id,
            )
        ).first()
        if not enrolled:
            raise HTTPException(status_code=403, detail="Энэ хичээлийг харах эрхгүй")
    elif user.role == "parent":
        children = db.execute(
            select(parent_student_link.c.student_id).where(parent_student_link.c.parent_id == user.id)
        ).all()
        child_ids = [r[0] for r in children]
        if not child_ids:
            raise HTTPException(status_code=403, detail="Холбогдсон хүүхэд алга")
        enrolled_child = db.execute(
            select(class_enrollment.c.student_id).where(
                class_enrollment.c.class_id == lesson.class_id,
                class_enrollment.c.student_id.in_(child_ids),
            )
        ).first()
        if not enrolled_child:
            raise HTTPException(status_code=403, detail="Энэ хичээлийг харах эрхгүй")
    else:
        raise HTTPException(status_code=403, detail="Зөвхөн сурагч эсвэл эцэг эх")

    mat = (
        db.query(LessonMaterial)
        .filter(
            LessonMaterial.lesson_id == lesson.id,
            LessonMaterial.teacher_approved.is_(True),
            LessonMaterial.sent_to_students.is_(True),
        )
        .order_by(LessonMaterial.created_at.desc(), LessonMaterial.id.desc())
        .first()
    )
    if not mat:
        return None
    return LessonMaterialForStudentOut(
        lesson_id=lesson.id,
        material_id=mat.id,
        summary=mat.summary,
        key_points=mat.key_points,
        homework=mat.homework,
        exercises=mat.exercises,
        exam_questions=mat.exam_questions,
        next_lesson_plan=mat.next_lesson_plan,
    )
