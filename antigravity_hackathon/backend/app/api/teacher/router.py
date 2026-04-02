import base64
import uuid
from datetime import datetime
from pathlib import Path
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import require_teacher
from app.database import get_db
from app.models import (
    ClassTimetable,
    Lesson,
    LessonMaterial,
    Notification,
    SchoolClass,
    StudentAttentionRecord,
    StudentAttendanceRecord,
    StudentFaceProfile,
    Subject,
    UnknownFaceLog,
    User,
    class_enrollment,
    parent_student_link,
    StudentDailyGrade,
)

router = APIRouter(prefix="/teacher", tags=["teacher"])


class TeacherLessonOut(BaseModel):
    id: int
    title: str | None
    class_id: int
    class_name: str
    student_count: int = 0


class StudentAttentionIn(BaseModel):
    student_id: int
    attention_score: float = Field(ge=0, le=100)
    notes: str | None = None


class AttentionReportIn(BaseModel):
    records: list[StudentAttentionIn]


class AttentionReportOut(BaseModel):
    saved_count: int
    low_attention_count: int
    notified_school_count: int
    notified_teacher_count: int


class StudentAttendanceIn(BaseModel):
    student_id: int
    status: Literal["present", "absent", "late", "excused"]
    note: str | None = None


class AttendanceSaveIn(BaseModel):
    records: list[StudentAttendanceIn]
    date_filter: str | None = None


class AttendanceSaveOut(BaseModel):
    saved_count: int
    parent_notified_count: int


class AttendanceItemOut(BaseModel):
    student_id: int
    student_name: str
    status: str
    note: str | None


class LessonStudentOut(BaseModel):
    id: int
    full_name: str | None
    email: str


class TimetableItemOut(BaseModel):
    class_id: int
    class_name: str
    lesson_id: int | None = None
    lesson_title: str | None = None
    teacher_name: str
    weekday: int
    period_index: int
    start_time: str
    end_time: str
    subject_name: str | None
    is_lunch: bool


class LessonMaterialBriefOut(BaseModel):
    lesson_id: int
    material_id: int
    summary: str | None
    key_points: list | None
    homework: dict | None
    exercises: list | None
    exam_questions: list | None
    next_lesson_plan: dict | None
    teacher_approved: bool
    sent_to_students: bool


class FaceRosterItemOut(BaseModel):
    student_id: int
    student_name: str
    has_face_profile: bool
    image_url: str | None


class AutoFaceAttendanceIn(BaseModel):
    detected_student_ids: list[int] = Field(default_factory=list)
    mark_absent_others: bool = False
    note: str | None = None


class AutoFaceAttendanceOut(BaseModel):
    recognized_count: int
    present_saved: int
    absent_saved: int


class UnknownFaceLogCreateIn(BaseModel):
    image_data_url: str = Field(min_length=20)
    detected_at: str | None = None
    note: str | None = None


class UnknownFaceLogOut(BaseModel):
    id: int
    lesson_id: int
    class_id: int
    teacher_id: int
    status: str
    note: str | None
    detected_at: str | None
    created_at: str | None
    image_url: str


class DailyGradeIn(BaseModel):
    student_id: int
    homework_score: float | None = None
    quiz_score: float | None = None
    project_score: float | None = None

class DailyGradesSaveIn(BaseModel):
    date_filter: str | None = None
    records: list[DailyGradeIn]

class DailyGradeOut(BaseModel):
    student_id: int
    student_name: str
    homework_score: float | None
    quiz_score: float | None
    project_score: float | None

class GradeDistributionItem(BaseModel):
    range: str
    count: int
    fill: str

class LowAttentionStudentOut(BaseModel):
    name: str
    class_name: str
    times: int

class DashboardStatsOut(BaseModel):
    attendanceTotal: int
    attendancePresent: int
    attendanceAbsent: int
    attendanceLate: int
    avgGrade: float
    avgAttention: float
    missingExams: int
    lowAttentionStudents: list[LowAttentionStudentOut]
    materialHasLatest: bool
    materialHomework: bool
    materialDocs: int
    gradeDistribution: list[GradeDistributionItem]


@router.get("/lessons", response_model=list[TeacherLessonOut])
def my_lessons(
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> list[TeacherLessonOut]:
    rows = (
        db.query(Lesson, SchoolClass.name)
        .join(SchoolClass, Lesson.class_id == SchoolClass.id)
        .filter(Lesson.teacher_id == teacher.id)
        .order_by(Lesson.id.desc())
        .all()
    )
    out: list[TeacherLessonOut] = []
    for lesson, class_name in rows:
        cnt = db.execute(
            select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)
        ).all()
        out.append(
            TeacherLessonOut(
                id=lesson.id,
                title=lesson.title,
                class_id=lesson.class_id,
                class_name=class_name,
                student_count=len(cnt),
            )
        )
    return out


@router.get("/lessons/{lesson_id}/students", response_model=list[LessonStudentOut])
def lesson_students(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> list[User]:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    return (
        db.query(User)
        .join(class_enrollment, class_enrollment.c.student_id == User.id)
        .filter(class_enrollment.c.class_id == lesson.class_id, User.role == "student")
        .order_by(User.full_name.asc().nulls_last(), User.id.asc())
        .all()
    )


@router.get("/lessons/{lesson_id}/latest-material", response_model=LessonMaterialBriefOut | None)
def teacher_latest_material(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> LessonMaterialBriefOut | None:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    mat = (
        db.query(LessonMaterial)
        .filter(LessonMaterial.lesson_id == lesson.id, LessonMaterial.teacher_id == teacher.id)
        .order_by(LessonMaterial.created_at.desc(), LessonMaterial.id.desc())
        .first()
    )
    if not mat:
        return None
    return LessonMaterialBriefOut(
        lesson_id=lesson.id,
        material_id=mat.id,
        summary=mat.summary,
        key_points=mat.key_points,
        homework=mat.homework,
        exercises=mat.exercises,
        exam_questions=mat.exam_questions,
        next_lesson_plan=mat.next_lesson_plan,
        teacher_approved=mat.teacher_approved,
        sent_to_students=mat.sent_to_students,
    )


@router.get("/lessons/{lesson_id}/face-roster", response_model=list[FaceRosterItemOut])
def lesson_face_roster(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> list[FaceRosterItemOut]:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")

    students = (
        db.query(User)
        .join(class_enrollment, class_enrollment.c.student_id == User.id)
        .filter(class_enrollment.c.class_id == lesson.class_id, User.role == "student")
        .order_by(User.full_name.asc().nulls_last(), User.id.asc())
        .all()
    )
    if not students:
        return []
    student_ids = [s.id for s in students]
    profiles = db.query(StudentFaceProfile).filter(StudentFaceProfile.student_id.in_(student_ids)).all()
    profile_by_student = {p.student_id: p for p in profiles}

    out: list[FaceRosterItemOut] = []
    for s in students:
        p = profile_by_student.get(s.id)
        image_url = f"/api/teacher/students/{s.id}/face-image" if p else None
        out.append(
            FaceRosterItemOut(
                student_id=s.id,
                student_name=s.full_name or s.email,
                has_face_profile=bool(p),
                image_url=image_url,
            )
        )
    return out


@router.post("/lessons/{lesson_id}/attendance/auto-face", response_model=AutoFaceAttendanceOut)
def auto_face_attendance(
    lesson_id: int,
    body: AutoFaceAttendanceIn,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> AutoFaceAttendanceOut:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    class_students = db.execute(
        select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)
    ).all()
    class_student_ids = {r[0] for r in class_students}
    if not class_student_ids:
        raise HTTPException(status_code=400, detail="Ангид сурагч алга")

    recognized_ids = sorted({sid for sid in body.detected_student_ids if sid in class_student_ids})
    present_saved = 0
    absent_saved = 0

    for sid in recognized_ids:
        row = (
            db.query(StudentAttendanceRecord)
            .filter(StudentAttendanceRecord.lesson_id == lesson.id, StudentAttendanceRecord.student_id == sid)
            .first()
        )
        note = (body.note or "auto-face-recognition").strip()[:500] or None
        if row:
            row.status = "present"
            row.note = note
            row.teacher_id = teacher.id
        else:
            db.add(
                StudentAttendanceRecord(
                    lesson_id=lesson.id,
                    class_id=lesson.class_id,
                    teacher_id=teacher.id,
                    student_id=sid,
                    status="present",
                    note=note,
                )
            )
        present_saved += 1

    if body.mark_absent_others:
        absent_ids = sorted(class_student_ids - set(recognized_ids))
        for sid in absent_ids:
            row = (
                db.query(StudentAttendanceRecord)
                .filter(StudentAttendanceRecord.lesson_id == lesson.id, StudentAttendanceRecord.student_id == sid)
                .first()
            )
            note = "auto-face-not-detected"
            if row:
                row.status = "absent"
                row.note = note
                row.teacher_id = teacher.id
            else:
                db.add(
                    StudentAttendanceRecord(
                        lesson_id=lesson.id,
                        class_id=lesson.class_id,
                        teacher_id=teacher.id,
                        student_id=sid,
                        status="absent",
                        note=note,
                    )
                )
            absent_saved += 1

    db.commit()
    return AutoFaceAttendanceOut(
        recognized_count=len(recognized_ids),
        present_saved=present_saved,
        absent_saved=absent_saved,
    )


@router.get("/students/{student_id}/face-image")
def get_student_face_image(
    student_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
):
    from pathlib import Path

    from fastapi.responses import FileResponse

    profile = db.query(StudentFaceProfile).filter(StudentFaceProfile.student_id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Face profile олдсонгүй")
    student_in_my_class = (
        db.query(Lesson.id)
        .join(class_enrollment, class_enrollment.c.class_id == Lesson.class_id)
        .filter(Lesson.teacher_id == teacher.id, class_enrollment.c.student_id == student_id)
        .first()
    )
    if not student_in_my_class:
        raise HTTPException(status_code=403, detail="Энэ сурагчийн зурагт эрхгүй")
    p = Path(profile.image_path)
    if not p.is_absolute():
        p = Path.cwd() / p
    if not p.exists() or not p.is_file():
        raise HTTPException(status_code=404, detail="Зургийн файл олдсонгүй")
    return FileResponse(str(p))


@router.post("/lessons/{lesson_id}/unknown-face-logs", response_model=UnknownFaceLogOut, status_code=201)
def create_unknown_face_log(
    lesson_id: int,
    body: UnknownFaceLogCreateIn,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> UnknownFaceLogOut:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    data_url = body.image_data_url.strip()
    prefix = "data:image/"
    if not data_url.startswith(prefix) or ";base64," not in data_url:
        raise HTTPException(status_code=400, detail="image_data_url буруу форматтай")
    meta, b64 = data_url.split(";base64,", 1)
    ext = meta.replace("data:image/", "").lower()
    if ext not in {"jpg", "jpeg", "png", "webp"}:
        raise HTTPException(status_code=400, detail="Зөвшөөрөгдөх зураг: jpg/jpeg/png/webp")
    try:
        raw = base64.b64decode(b64, validate=True)
    except Exception:
        raise HTTPException(status_code=400, detail="base64 зураг уншиж чадсангүй") from None
    if len(raw) > 2_500_000:
        raise HTTPException(status_code=400, detail="Зураг хэт том байна")

    base_dir = Path.cwd() / "data" / "unknown_faces"
    base_dir.mkdir(parents=True, exist_ok=True)
    filename = f"unknown_{lesson.id}_{uuid.uuid4().hex[:10]}.{ext if ext != 'jpeg' else 'jpg'}"
    path = base_dir / filename
    path.write_bytes(raw)

    detected_at = None
    if body.detected_at:
        try:
            detected_at = datetime.fromisoformat(body.detected_at.replace("Z", "+00:00"))
        except Exception:
            detected_at = None

    row = UnknownFaceLog(
        lesson_id=lesson.id,
        class_id=lesson.class_id,
        teacher_id=teacher.id,
        image_path=str(path),
        status="open",
        note=(body.note or "").strip()[:1000] or None,
        detected_at=detected_at,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return UnknownFaceLogOut(
        id=row.id,
        lesson_id=row.lesson_id,
        class_id=row.class_id,
        teacher_id=row.teacher_id,
        status=row.status,
        note=row.note,
        detected_at=row.detected_at.isoformat() if row.detected_at else None,
        created_at=row.created_at.isoformat() if row.created_at else None,
        image_url=f"/api/admin/unknown-face-logs/{row.id}/image",
    )


@router.get("/timetable", response_model=list[TimetableItemOut])
def teacher_timetable(
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
    class_id: int | None = Query(default=None, ge=1),
) -> list[TimetableItemOut]:
    class_ids = (
        db.query(Lesson.class_id).filter(Lesson.teacher_id == teacher.id).distinct().all()
    )
    class_ids = [c[0] for c in class_ids]
    if class_id is not None:
        if class_id not in class_ids:
            raise HTTPException(status_code=403, detail="Энэ ангид таны хичээл алга")
        class_ids = [class_id]
    if not class_ids:
        return []

    rows = (
        db.query(ClassTimetable, SchoolClass.name, Subject.name)
        .join(SchoolClass, SchoolClass.id == ClassTimetable.class_id)
        .outerjoin(Subject, Subject.id == ClassTimetable.subject_id)
        .filter(ClassTimetable.class_id.in_(class_ids))
        .order_by(ClassTimetable.class_id.asc(), ClassTimetable.weekday.asc(), ClassTimetable.period_index.asc())
        .all()
    )
    lesson_rows = db.query(Lesson).filter(Lesson.teacher_id == teacher.id, Lesson.class_id.in_(class_ids)).all()
    lesson_by_class = {l.class_id: l for l in lesson_rows}
    out: list[TimetableItemOut] = []
    for r, class_name, subject_name in rows:
        les = lesson_by_class.get(r.class_id)
        out.append(
            TimetableItemOut(
                class_id=r.class_id,
                class_name=class_name,
                lesson_id=les.id if les else None,
                lesson_title=les.title if les else None,
                teacher_name=teacher.full_name or teacher.email,
                weekday=r.weekday,
                period_index=r.period_index,
                start_time=r.start_time.strftime("%H:%M"),
                end_time=r.end_time.strftime("%H:%M"),
                subject_name=subject_name,
                is_lunch=r.is_lunch,
            )
        )
    return out


@router.post("/lessons/{lesson_id}/attention-report", response_model=AttentionReportOut)
def report_attention(
    lesson_id: int,
    body: AttentionReportIn,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> AttentionReportOut:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    if not body.records:
        raise HTTPException(status_code=400, detail="records хоосон байна")

    class_student_rows = db.execute(
        select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)
    ).all()
    class_student_ids = {row[0] for row in class_student_rows}
    if not class_student_ids:
        raise HTTPException(status_code=400, detail="Энэ ангид сурагч бүртгэгдээгүй байна")

    seen: set[int] = set()
    low_rows: list[StudentAttentionIn] = []
    saved = 0
    for rec in body.records:
        if rec.student_id in seen:
            raise HTTPException(status_code=400, detail=f"Давхардсан student_id: {rec.student_id}")
        seen.add(rec.student_id)
        if rec.student_id not in class_student_ids:
            raise HTTPException(status_code=400, detail=f"Сурагч {rec.student_id} нь энэ ангид хамаарахгүй")
        row = StudentAttentionRecord(
            lesson_id=lesson.id,
            class_id=lesson.class_id,
            teacher_id=teacher.id,
            student_id=rec.student_id,
            attention_score=rec.attention_score,
            notes=rec.notes,
            reported_to_teacher=rec.attention_score < 60,
            reported_to_school=rec.attention_score < 60,
        )
        db.add(row)
        saved += 1
        if rec.attention_score < 60:
            low_rows.append(rec)

    notified_teacher_count = 0
    notified_school_count = 0
    if low_rows:
        students = db.query(User).filter(User.id.in_([r.student_id for r in low_rows])).all()
        student_map = {s.id: (s.full_name or s.email) for s in students}
        details = ", ".join(
            f"{student_map.get(r.student_id, str(r.student_id))}: {r.attention_score:.1f}%"
            for r in sorted(low_rows, key=lambda x: x.attention_score)
        )

        teacher_title = f"Анхаарал 60%-иас доош ({len(low_rows)})"
        teacher_body = f"Хичээл: {lesson.title or lesson.id}. Сурагчид: {details}"
        db.add(Notification(user_id=teacher.id, title=teacher_title, body=teacher_body, read=False))
        notified_teacher_count = 1

        school_recipients = (
            db.query(User)
            .filter(User.is_active.is_(True), User.role.in_(["admin", "principal"]))
            .order_by(User.id)
            .all()
        )
        school_title = f"Сургуулийн анхааруулга: {len(low_rows)} сурагч < 60%"
        school_body = (
            f"Багш: {teacher.full_name or teacher.email}; "
            f"анги: {lesson.class_id}; хичээл: {lesson.title or lesson.id}; "
            f"дэлгэрэнгүй: {details}"
        )
        for rcpt in school_recipients:
            db.add(Notification(user_id=rcpt.id, title=school_title, body=school_body, read=False))
            notified_school_count += 1

    db.commit()
    return AttentionReportOut(
        saved_count=saved,
        low_attention_count=len(low_rows),
        notified_school_count=notified_school_count,
        notified_teacher_count=notified_teacher_count,
    )


@router.get("/lessons/{lesson_id}/attendance", response_model=list[AttendanceItemOut])
def get_lesson_attendance(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
    date_filter: str | None = Query(None),
) -> list[AttendanceItemOut]:
    from datetime import datetime
    target_date = datetime.strptime(date_filter, "%Y-%m-%d").date() if date_filter else datetime.today().date()
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    enrolled_rows = (
        db.query(User)
        .join(class_enrollment, class_enrollment.c.student_id == User.id)
        .filter(class_enrollment.c.class_id == lesson.class_id, User.role == "student")
        .order_by(User.full_name.asc().nulls_last(), User.id.asc())
        .all()
    )
    existing = (
        db.query(StudentAttendanceRecord)
        .filter(StudentAttendanceRecord.lesson_id == lesson.id, StudentAttendanceRecord.date == target_date)
        .all()
    )
    by_student = {r.student_id: r for r in existing}
    out: list[AttendanceItemOut] = []
    for st in enrolled_rows:
        rec = by_student.get(st.id)
        out.append(
            AttendanceItemOut(
                student_id=st.id,
                student_name=st.full_name or st.email,
                status=rec.status if rec else "present",
                note=rec.note if rec else None,
            )
        )
    return out


@router.post("/lessons/{lesson_id}/attendance", response_model=AttendanceSaveOut)
def save_lesson_attendance(
    lesson_id: int,
    body: AttendanceSaveIn,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
) -> AttendanceSaveOut:
    from datetime import datetime
    target_date = datetime.strptime(body.date_filter, "%Y-%m-%d").date() if body.date_filter else datetime.today().date()
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    if not body.records:
        raise HTTPException(status_code=400, detail="records хоосон")

    class_student_rows = db.execute(
        select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)
    ).all()
    class_student_ids = {r[0] for r in class_student_rows}
    if not class_student_ids:
        raise HTTPException(status_code=400, detail="Ангид сурагч алга")

    saved = 0
    parent_notified = 0
    for rec in body.records:
        if rec.student_id not in class_student_ids:
            raise HTTPException(status_code=400, detail=f"Сурагч {rec.student_id} энэ ангид хамаарахгүй")
        row = (
            db.query(StudentAttendanceRecord)
            .filter(
                StudentAttendanceRecord.lesson_id == lesson.id, 
                StudentAttendanceRecord.student_id == rec.student_id,
                StudentAttendanceRecord.date == target_date,
            )
            .first()
        )
        if row:
            row.status = rec.status
            row.note = rec.note
            row.teacher_id = teacher.id
        else:
            row = StudentAttendanceRecord(
                lesson_id=lesson.id,
                class_id=lesson.class_id,
                teacher_id=teacher.id,
                student_id=rec.student_id,
                date=target_date,
                status=rec.status,
                note=rec.note,
            )
            db.add(row)
        saved += 1

        student = db.query(User).filter(User.id == rec.student_id).first()
        student_name = (student.full_name or student.email) if student else f"#{rec.student_id}"
        parents = db.execute(
            select(parent_student_link.c.parent_id).where(parent_student_link.c.student_id == rec.student_id)
        ).all()
        if parents:
            title = f"Ирц шинэчлэгдлээ: {student_name}"
            body_text = (
                f"Хичээл: {lesson.title or lesson.id}, Анги #{lesson.class_id}. "
                f"Төлөв: {rec.status}. {('Тайлбар: ' + rec.note) if rec.note else ''}"
            ).strip()
            for p in parents:
                db.add(Notification(user_id=p[0], title=title, body=body_text, read=False))
                parent_notified += 1

    db.commit()
    return AttendanceSaveOut(saved_count=saved, parent_notified_count=parent_notified)

@router.get("/lessons/{lesson_id}/daily-grades", response_model=list[DailyGradeOut])
def get_daily_grades(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
    date_filter: str | None = Query(None),
) -> list[DailyGradeOut]:
    from datetime import datetime
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    target_date = datetime.strptime(date_filter, "%Y-%m-%d").date() if date_filter else datetime.today().date()
    
    enrolled_rows = (
        db.query(User)
        .join(class_enrollment, class_enrollment.c.student_id == User.id)
        .filter(class_enrollment.c.class_id == lesson.class_id, User.role == "student")
        .order_by(User.full_name.asc().nulls_last(), User.id.asc())
        .all()
    )
    existing = db.query(StudentDailyGrade).filter(StudentDailyGrade.lesson_id == lesson.id, StudentDailyGrade.date == target_date).all()
    by_student = {r.student_id: r for r in existing}
    out = []
    for st in enrolled_rows:
        rec = by_student.get(st.id)
        out.append(
            DailyGradeOut(
                student_id=st.id,
                student_name=st.full_name or st.email,
                homework_score=rec.homework_score if rec else None,
                quiz_score=rec.quiz_score if rec else None,
                project_score=rec.project_score if rec else None,
            )
        )
    return out

@router.post("/lessons/{lesson_id}/daily-grades")
def save_daily_grades(
    lesson_id: int,
    body: DailyGradesSaveIn,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
):
    from datetime import datetime
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
    target_date = datetime.strptime(body.date_filter, "%Y-%m-%d").date() if body.date_filter else datetime.today().date()
    
    class_students = db.execute(select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)).all()
    c_ids = {r[0] for r in class_students}
    
    saved = 0
    for rec in body.records:
        if rec.student_id not in c_ids: continue
        row = db.query(StudentDailyGrade).filter(StudentDailyGrade.lesson_id == lesson.id, StudentDailyGrade.student_id == rec.student_id, StudentDailyGrade.date == target_date).first()
        if row:
            row.homework_score = rec.homework_score
            row.quiz_score = rec.quiz_score
            row.project_score = rec.project_score
        else:
            db.add(StudentDailyGrade(
                lesson_id=lesson.id,
                student_id=rec.student_id,
                class_id=lesson.class_id,
                teacher_id=teacher.id,
                date=target_date,
                homework_score=rec.homework_score,
                quiz_score=rec.quiz_score,
                project_score=rec.project_score
            ))
        saved += 1
    db.commit()
    return {"saved": saved}


@router.get("/lessons/{lesson_id}/dashboard-stats", response_model=DashboardStatsOut)
def teacher_dashboard_stats(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Session = Depends(get_db),
):
    from sqlalchemy import func
    from app.models.grade_models import StudentGradePrediction
    
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.teacher_id == teacher.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")
        
    class_obj = db.query(SchoolClass).filter(SchoolClass.id == lesson.class_id).first()
    class_name = class_obj.name if class_obj else f"Анги {lesson.class_id}"
        
    class_students = db.execute(
        select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)
    ).all()
    c_ids = [r[0] for r in class_students]
    total_students = len(c_ids)
    
    last_attendance_date = db.query(func.max(StudentAttendanceRecord.date)).filter(
        StudentAttendanceRecord.lesson_id == lesson.id
    ).scalar()
    
    a_present, a_absent, a_late = 0, 0, 0
    if last_attendance_date:
        att_rows = db.query(StudentAttendanceRecord).filter(
            StudentAttendanceRecord.lesson_id == lesson.id,
            StudentAttendanceRecord.date == last_attendance_date
        ).all()
        for r in att_rows:
            if r.status == "present": a_present += 1
            elif r.status == "absent": a_absent += 1
            elif r.status == "late": a_late += 1
            
    predictions = db.query(StudentGradePrediction).filter(
        StudentGradePrediction.class_id == lesson.class_id
    ).all()
    
    avg_grade = 0.0
    missing_exams = 0
    dist = {"90-100": 0, "75-89": 0, "60-74": 0, "<60": 0}
    if predictions:
        total_p = sum(p.predicted_score for p in predictions)
        avg_grade = total_p / len(predictions)
        for p in predictions:
            if p.predicted_score >= 90: dist["90-100"] += 1
            elif p.predicted_score >= 75: dist["75-89"] += 1
            elif p.predicted_score >= 60: dist["60-74"] += 1
            else: dist["<60"] += 1
    else:
        missing_exams = total_students
    
    attentions = db.query(StudentAttentionRecord).filter(
        StudentAttentionRecord.lesson_id == lesson.id
    ).all()
    avg_attention = 0.0
    low_attention_map = {}
    if attentions:
        avg_attention = sum(a.attention_score for a in attentions) / len(attentions)
        for a in attentions:
            if a.attention_score < 60.0:
                low_attention_map[a.student_id] = low_attention_map.get(a.student_id, 0) + 1
                
    low_attn_list = []
    if low_attention_map:
        sorted_low = sorted(low_attention_map.items(), key=lambda x: x[1], reverse=True)[:2]
        low_ids = [s[0] for s in sorted_low]
        low_users = db.query(User).filter(User.id.in_(low_ids)).all()
        user_map = {u.id: u for u in low_users}
        for sid, times in sorted_low:
            u = user_map.get(sid)
            name = u.full_name or u.email if u else f"#{sid}"
            low_attn_list.append(LowAttentionStudentOut(
                name=name,
                class_name=class_name,
                times=times
            ))
            
    materials = db.query(LessonMaterial).filter(LessonMaterial.lesson_id == lesson.id).order_by(LessonMaterial.created_at.desc()).all()
    material_has_latest = len(materials) > 0
    material_homework = any(m.homework for m in materials)
    material_docs = len(materials)
    
    return DashboardStatsOut(
        attendanceTotal=total_students,
        attendancePresent=a_present,
        attendanceAbsent=a_absent,
        attendanceLate=a_late,
        avgGrade=round(avg_grade, 1),
        avgAttention=round(avg_attention, 1),
        missingExams=missing_exams,
        lowAttentionStudents=low_attn_list,
        materialHasLatest=material_has_latest,
        materialHomework=material_homework,
        materialDocs=material_docs,
        gradeDistribution=[
            GradeDistributionItem(range="90-100", count=dist["90-100"], fill="var(--es-success)"),
            GradeDistributionItem(range="75-89", count=dist["75-89"], fill="var(--es-primary)"),
            GradeDistributionItem(range="60-74", count=dist["60-74"], fill="var(--es-warning)"),
            GradeDistributionItem(range="<60", count=dist["<60"], fill="var(--es-danger)"),
        ]
    )
