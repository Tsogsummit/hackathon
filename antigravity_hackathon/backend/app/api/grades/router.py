from collections import defaultdict
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_parent, require_student, require_teacher
from app.database import get_db
from app.models import (
    Lesson,
    Notification,
    SchoolClass,
    StudentAttentionRecord,
    StudentAttendanceRecord,
    StudentGradePrediction,
    StudentGradeRecord,
    User,
    class_enrollment,
    parent_student_link,
)

router = APIRouter(prefix="/grades", tags=["grades"])


class GradeRecordCreate(BaseModel):
    student_id: int
    class_id: int
    term: str = Field(default="2026-Q2", min_length=2, max_length=50)
    homework_avg: float = Field(ge=0, le=100)
    quiz_avg: float = Field(ge=0, le=100)
    project_score: float = Field(ge=0, le=100)
    attendance_rate: float = Field(ge=0, le=100)
    midterm_exam: float = Field(ge=0, le=100)
    final_exam: float = Field(ge=0, le=100)
    behavior_score: float = Field(default=100, ge=0, le=100)


class GradeRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    class_id: int
    teacher_id: int
    term: str
    homework_avg: float
    quiz_avg: float
    project_score: float
    attendance_rate: float
    midterm_exam: float
    final_exam: float
    behavior_score: float


class ClassStudentOut(BaseModel):
    id: int
    full_name: str | None
    email: str


def _ensure_teacher_for_class(db: Session, teacher_id: int, class_id: int) -> None:
    exists = db.query(Lesson.id).filter(Lesson.teacher_id == teacher_id, Lesson.class_id == class_id).first()
    if not exists:
        raise HTTPException(status_code=403, detail="Та энэ ангид хичээл заадаггүй")


def _ensure_access_to_class(db: Session, user: User, class_id: int) -> None:
    if user.role == "teacher":
        _ensure_teacher_for_class(db, user.id, class_id)
        return
    if user.role in {"admin", "principal"}:
        return
    raise HTTPException(status_code=403, detail="Эрх хүрэхгүй")


def _to_grade(score: float) -> str:
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "F"


def _predict_score(rec: StudentGradeRecord) -> float:
    score = (
        rec.homework_avg * 0.20
        + rec.quiz_avg * 0.10
        + rec.project_score * 0.10
        + rec.attendance_rate * 0.15
        + rec.midterm_exam * 0.20
        + rec.final_exam * 0.20
        + rec.behavior_score * 0.05
    )
    return round(max(0.0, min(100.0, score)), 2)


def _fail_probability(score: float, attendance_rate: float, final_exam: float, homework_avg: float) -> float:
    # Heuristic risk score mapped to 0..100 for simple explainable prediction.
    base = max(0.0, 75.0 - score) * 1.6
    if attendance_rate < 80:
        base += (80 - attendance_rate) * 1.2
    if final_exam < 60:
        base += (60 - final_exam) * 1.0
    if homework_avg < 60:
        base += (60 - homework_avg) * 0.8
    return round(max(0.0, min(100.0, base)), 1)


def _risk_label(prob: float) -> str:
    if prob >= 70:
        return "high"
    if prob >= 40:
        return "medium"
    return "low"


def _serialize_prediction(
    p: StudentGradePrediction,
    rec: StudentGradeRecord,
    student_name: str | None = None,
) -> dict[str, Any]:
    fail_prob = _fail_probability(p.predicted_score, rec.attendance_rate, rec.final_exam, rec.homework_avg)
    return {
        "id": p.id,
        "record_id": p.record_id,
        "student_id": p.student_id,
        "student_name": student_name,
        "class_id": p.class_id,
        "teacher_id": p.teacher_id,
        "term": rec.term,
        "predicted_score": p.predicted_score,
        "predicted_grade": p.predicted_grade,
        "fail_probability": fail_prob,
        "risk_level": _risk_label(fail_prob),
        "summary": p.summary,
    }


class GradePredictionOut(BaseModel):
    id: int
    record_id: int
    student_id: int
    student_name: str | None = None
    class_id: int
    teacher_id: int
    term: str
    predicted_score: float
    predicted_grade: str
    fail_probability: float
    risk_level: str
    summary: str


class StudentLessonInsightOut(BaseModel):
    student_id: int
    student_name: str
    class_id: int
    class_name: str
    teacher_id: int
    teacher_name: str
    lesson_id: int | None
    lesson_title: str
    term: str
    homework_avg: float
    quiz_avg: float
    project_score: float
    attendance_rate: float
    midterm_exam: float
    final_exam: float
    behavior_score: float
    predicted_grade: str | None
    predicted_score: float | None
    fail_probability: float | None
    risk_level: str | None
    low_attention_dates: list[str]
    absent_dates: list[str]
    late_dates: list[str]


class TeacherClassStudentDetailOut(BaseModel):
    student_id: int
    student_name: str
    student_email: str
    class_id: int
    class_name: str
    teacher_name: str
    term: str | None
    homework_avg: float | None
    quiz_avg: float | None
    project_score: float | None
    attendance_rate: float | None
    midterm_exam: float | None
    final_exam: float | None
    behavior_score: float | None
    predicted_grade: str | None
    predicted_score: float | None
    fail_probability: float | None
    risk_level: str | None
    low_attention_count: int
    low_attention_dates: list[str]
    absent_count: int
    late_count: int


class GradeRecordPatch(BaseModel):
    homework_avg: float | None = Field(default=None, ge=0, le=100)
    quiz_avg: float | None = Field(default=None, ge=0, le=100)
    project_score: float | None = Field(default=None, ge=0, le=100)
    attendance_rate: float | None = Field(default=None, ge=0, le=100)
    midterm_exam: float | None = Field(default=None, ge=0, le=100)
    final_exam: float | None = Field(default=None, ge=0, le=100)
    behavior_score: float | None = Field(default=None, ge=0, le=100)
    term: str | None = Field(default=None, min_length=2, max_length=50)


def _save_prediction_and_alert(db: Session, rec: StudentGradeRecord, teacher: User) -> GradePredictionOut:
    score = _predict_score(rec)
    grade = _to_grade(score)
    fail_prob = _fail_probability(score, rec.attendance_rate, rec.final_exam, rec.homework_avg)
    risk = _risk_label(fail_prob)
    summary = (
        f"{rec.term} улирлын эцсийн дүнгийн таамаг: {score}% ({grade}). "
        f"Унах магадлал: {fail_prob}%. Эрсдэл: {risk}."
    )
    pred = (
        db.query(StudentGradePrediction)
        .filter(StudentGradePrediction.record_id == rec.id)
        .order_by(StudentGradePrediction.id.desc())
        .first()
    )
    was_high = False
    if pred is None:
        pred = StudentGradePrediction(
            record_id=rec.id,
            student_id=rec.student_id,
            class_id=rec.class_id,
            teacher_id=teacher.id,
            predicted_score=score,
            predicted_grade=grade,
            risk_level=risk,
            summary=summary,
        )
        db.add(pred)
    else:
        was_high = pred.risk_level == "high" or pred.predicted_grade == "F"
        pred.teacher_id = teacher.id
        pred.predicted_score = score
        pred.predicted_grade = grade
        pred.risk_level = risk
        pred.summary = summary

    if (fail_prob >= 70 or grade == "F") and not was_high:
        # notify assigned teacher (input teacher) and parents only
        title = f"⚠️ Сурагч унах эрсдэлтэй: {grade} ({score}%)"
        body = summary
        db.add(Notification(user_id=teacher.id, title=title, body=body, read=False))
        parent_rows = db.execute(
            select(parent_student_link.c.parent_id).where(parent_student_link.c.student_id == rec.student_id)
        ).all()
        for row in parent_rows:
            db.add(Notification(user_id=row[0], title=title, body=body, read=False))

    db.commit()
    db.refresh(pred)
    return GradePredictionOut(**_serialize_prediction(pred, rec))


def _ensure_missing_predictions(db: Session, records: list[StudentGradeRecord]) -> None:
    if not records:
        return
    rec_ids = [r.id for r in records]
    existing = (
        db.query(StudentGradePrediction.record_id)
        .filter(StudentGradePrediction.record_id.in_(rec_ids))
        .all()
    )
    existing_ids = {r[0] for r in existing}
    missing = [r for r in records if r.id not in existing_ids]
    if not missing:
        return
    teachers = db.query(User).filter(User.id.in_([r.teacher_id for r in missing])).all()
    tmap = {t.id: t for t in teachers}
    for rec in missing:
        t = tmap.get(rec.teacher_id)
        if t is None:
            continue
        _save_prediction_and_alert(db, rec, t)


def _date_str(dt: Any) -> str:
    if dt is None:
        return ""
    d = getattr(dt, "date", None)
    if callable(d):
        return d().isoformat()
    return str(dt)


@router.post("/predict", response_model=GradePredictionOut)
def upsert_record_and_predict(
    body: GradeRecordCreate,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
) -> GradePredictionOut:
    _ensure_teacher_for_class(db, teacher.id, body.class_id)
    enrolled = db.execute(
        select(class_enrollment.c.student_id).where(
            class_enrollment.c.class_id == body.class_id,
            class_enrollment.c.student_id == body.student_id,
        )
    ).first()
    if not enrolled:
        raise HTTPException(status_code=400, detail="Сурагч энэ ангид бүртгэлгүй")

    rec = (
        db.query(StudentGradeRecord)
        .filter(
            StudentGradeRecord.student_id == body.student_id,
            StudentGradeRecord.class_id == body.class_id,
            StudentGradeRecord.term == body.term,
        )
        .first()
    )
    if rec is None:
        rec = StudentGradeRecord(teacher_id=teacher.id, **body.model_dump())
        db.add(rec)
        db.flush()
    else:
        data = body.model_dump()
        for k, v in data.items():
            setattr(rec, k, v)
        rec.teacher_id = teacher.id
        db.flush()
    return _save_prediction_and_alert(db, rec, teacher)


@router.get("/class/{class_id}/students", response_model=list[ClassStudentOut])
def list_class_students(
    class_id: int,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[User]:
    _ensure_access_to_class(db, user, class_id)
    return (
        db.query(User)
        .join(class_enrollment, class_enrollment.c.student_id == User.id)
        .filter(class_enrollment.c.class_id == class_id, User.role == "student", User.is_active.is_(True))
        .order_by(User.full_name.asc().nulls_last(), User.id.asc())
        .all()
    )


@router.get("/class/{class_id}/records", response_model=list[GradeRecordOut])
def list_class_records(
    class_id: int,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentGradeRecord]:
    _ensure_access_to_class(db, user, class_id)
    return (
        db.query(StudentGradeRecord)
        .filter(StudentGradeRecord.class_id == class_id)
        .order_by(StudentGradeRecord.updated_at.desc())
        .all()
    )


@router.patch("/records/{record_id}", response_model=GradeRecordOut)
def patch_grade_record(
    record_id: int,
    body: GradeRecordPatch,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentGradeRecord:
    rec = db.query(StudentGradeRecord).filter(StudentGradeRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Grade record олдсонгүй")
    _ensure_teacher_for_class(db, teacher.id, rec.class_id)
    data = body.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="Өөрчлөх утга алга")
    for k, v in data.items():
        setattr(rec, k, v)
    rec.teacher_id = teacher.id
    _save_prediction_and_alert(db, rec, teacher)
    db.refresh(rec)
    return rec


@router.get("/class/{class_id}/predictions", response_model=list[GradePredictionOut])
def list_class_predictions(
    class_id: int,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[GradePredictionOut]:
    _ensure_access_to_class(db, user, class_id)
    recs = db.query(StudentGradeRecord).filter(StudentGradeRecord.class_id == class_id).all()
    _ensure_missing_predictions(db, recs)
    rows = (
        db.query(StudentGradePrediction, StudentGradeRecord, User)
        .join(StudentGradeRecord, StudentGradeRecord.id == StudentGradePrediction.record_id)
        .join(User, User.id == StudentGradePrediction.student_id)
        .filter(StudentGradePrediction.class_id == class_id)
        .order_by(StudentGradePrediction.id.desc())
        .all()
    )
    return [GradePredictionOut(**_serialize_prediction(p, r, u.full_name or u.email)) for p, r, u in rows]


@router.get("/me/records", response_model=list[GradeRecordOut])
def list_my_records(
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentGradeRecord]:
    return (
        db.query(StudentGradeRecord)
        .filter(StudentGradeRecord.student_id == student.id)
        .order_by(StudentGradeRecord.updated_at.desc())
        .all()
    )


@router.get("/me/predictions", response_model=list[GradePredictionOut])
def list_my_predictions(
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[GradePredictionOut]:
    recs = db.query(StudentGradeRecord).filter(StudentGradeRecord.student_id == student.id).all()
    _ensure_missing_predictions(db, recs)
    rows = (
        db.query(StudentGradePrediction, StudentGradeRecord)
        .join(StudentGradeRecord, StudentGradeRecord.id == StudentGradePrediction.record_id)
        .filter(StudentGradePrediction.student_id == student.id)
        .order_by(StudentGradePrediction.id.desc())
        .all()
    )
    return [GradePredictionOut(**_serialize_prediction(p, r, student.full_name or student.email)) for p, r in rows]


@router.get("/parent/children/records", response_model=list[GradeRecordOut])
def list_parent_children_records(
    parent: Annotated[User, Depends(require_parent)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentGradeRecord]:
    links = db.execute(
        select(parent_student_link.c.student_id).where(parent_student_link.c.parent_id == parent.id)
    ).all()
    student_ids = [row[0] for row in links]
    if not student_ids:
        return []
    return (
        db.query(StudentGradeRecord)
        .filter(StudentGradeRecord.student_id.in_(student_ids))
        .order_by(StudentGradeRecord.updated_at.desc())
        .all()
    )


@router.get("/parent/children/predictions", response_model=list[GradePredictionOut])
def list_parent_children_predictions(
    parent: Annotated[User, Depends(require_parent)],
    db: Annotated[Session, Depends(get_db)],
) -> list[GradePredictionOut]:
    links = db.execute(
        select(parent_student_link.c.student_id).where(parent_student_link.c.parent_id == parent.id)
    ).all()
    student_ids = [row[0] for row in links]
    if not student_ids:
        return []
    recs = db.query(StudentGradeRecord).filter(StudentGradeRecord.student_id.in_(student_ids)).all()
    _ensure_missing_predictions(db, recs)
    rows = (
        db.query(StudentGradePrediction, StudentGradeRecord, User)
        .join(StudentGradeRecord, StudentGradeRecord.id == StudentGradePrediction.record_id)
        .join(User, User.id == StudentGradePrediction.student_id)
        .filter(StudentGradePrediction.student_id.in_(student_ids))
        .order_by(StudentGradePrediction.id.desc())
        .all()
    )
    return [GradePredictionOut(**_serialize_prediction(p, r, u.full_name or u.email)) for p, r, u in rows]


@router.get("/me/lesson-insights", response_model=list[StudentLessonInsightOut])
def list_my_lesson_insights(
    student: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentLessonInsightOut]:
    rows = (
        db.query(StudentGradeRecord, User, SchoolClass)
        .join(User, User.id == StudentGradeRecord.teacher_id)
        .join(SchoolClass, SchoolClass.id == StudentGradeRecord.class_id)
        .filter(StudentGradeRecord.student_id == student.id)
        .order_by(StudentGradeRecord.updated_at.desc())
        .all()
    )
    if not rows:
        return []

    rec_ids = [rec.id for rec, _, _ in rows]
    preds = (
        db.query(StudentGradePrediction, StudentGradeRecord)
        .join(StudentGradeRecord, StudentGradeRecord.id == StudentGradePrediction.record_id)
        .filter(StudentGradePrediction.record_id.in_(rec_ids))
        .order_by(StudentGradePrediction.id.desc())
        .all()
    )
    pred_by_record: dict[int, GradePredictionOut] = {}
    for p, r in preds:
        pred_by_record.setdefault(r.id, GradePredictionOut(**_serialize_prediction(p, r)))

    class_teacher_pairs = {(rec.class_id, rec.teacher_id) for rec, _, _ in rows}
    lesson_rows = (
        db.query(Lesson)
        .filter(Lesson.class_id.in_([c for c, _ in class_teacher_pairs]))
        .order_by(Lesson.id.asc())
        .all()
    )
    lesson_by_pair: dict[tuple[int, int], Lesson] = {}
    for l in lesson_rows:
        key = (l.class_id, l.teacher_id)
        if key in class_teacher_pairs and key not in lesson_by_pair:
            lesson_by_pair[key] = l

    attention_rows = (
        db.query(StudentAttentionRecord)
        .filter(StudentAttentionRecord.student_id == student.id, StudentAttentionRecord.attention_score < 60)
        .all()
    )
    low_attention_dates: dict[tuple[int, int], list[str]] = defaultdict(list)
    for a in attention_rows:
        low_attention_dates[(a.class_id, a.teacher_id)].append(_date_str(a.created_at))

    att_rows = db.query(StudentAttendanceRecord).filter(StudentAttendanceRecord.student_id == student.id).all()
    absent_dates: dict[tuple[int, int], list[str]] = defaultdict(list)
    late_dates: dict[tuple[int, int], list[str]] = defaultdict(list)
    for a in att_rows:
        key = (a.class_id, a.teacher_id)
        if a.status == "absent":
            absent_dates[key].append(_date_str(a.updated_at or a.created_at))
        elif a.status == "late":
            late_dates[key].append(_date_str(a.updated_at or a.created_at))

    out: list[StudentLessonInsightOut] = []
    for rec, teacher_user, school_class in rows:
        key = (rec.class_id, rec.teacher_id)
        pred = pred_by_record.get(rec.id)
        lesson = lesson_by_pair.get(key)
        out.append(
            StudentLessonInsightOut(
                student_id=student.id,
                student_name=student.full_name or student.email,
                class_id=rec.class_id,
                class_name=school_class.name,
                teacher_id=teacher_user.id,
                teacher_name=teacher_user.full_name or teacher_user.email,
                lesson_id=lesson.id if lesson else None,
                lesson_title=(lesson.title if lesson and lesson.title else f"Class #{rec.class_id} lesson"),
                term=rec.term,
                homework_avg=rec.homework_avg,
                quiz_avg=rec.quiz_avg,
                project_score=rec.project_score,
                attendance_rate=rec.attendance_rate,
                midterm_exam=rec.midterm_exam,
                final_exam=rec.final_exam,
                behavior_score=rec.behavior_score,
                predicted_grade=pred.predicted_grade if pred else None,
                predicted_score=pred.predicted_score if pred else None,
                fail_probability=pred.fail_probability if pred else None,
                risk_level=pred.risk_level if pred else None,
                low_attention_dates=sorted(set(low_attention_dates.get(key, []))),
                absent_dates=sorted(set(absent_dates.get(key, []))),
                late_dates=sorted(set(late_dates.get(key, []))),
            )
        )
    return out


@router.get("/parent/children/lesson-insights", response_model=list[StudentLessonInsightOut])
def list_parent_children_lesson_insights(
    parent: Annotated[User, Depends(require_parent)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentLessonInsightOut]:
    links = db.execute(
        select(parent_student_link.c.student_id).where(parent_student_link.c.parent_id == parent.id)
    ).all()
    student_ids = [row[0] for row in links]
    if not student_ids:
        return []

    users = db.query(User).filter(User.id.in_(student_ids)).all()
    student_map = {u.id: (u.full_name or u.email) for u in users}
    rows = (
        db.query(StudentGradeRecord, User, SchoolClass)
        .join(User, User.id == StudentGradeRecord.teacher_id)
        .join(SchoolClass, SchoolClass.id == StudentGradeRecord.class_id)
        .filter(StudentGradeRecord.student_id.in_(student_ids))
        .order_by(StudentGradeRecord.updated_at.desc())
        .all()
    )
    if not rows:
        return []

    rec_ids = [rec.id for rec, _, _ in rows]
    preds = (
        db.query(StudentGradePrediction, StudentGradeRecord)
        .join(StudentGradeRecord, StudentGradeRecord.id == StudentGradePrediction.record_id)
        .filter(StudentGradePrediction.record_id.in_(rec_ids))
        .order_by(StudentGradePrediction.id.desc())
        .all()
    )
    pred_by_record: dict[int, GradePredictionOut] = {}
    for p, r in preds:
        pred_by_record.setdefault(r.id, GradePredictionOut(**_serialize_prediction(p, r)))

    pair_set = {(rec.class_id, rec.teacher_id) for rec, _, _ in rows}
    lesson_rows = db.query(Lesson).filter(Lesson.class_id.in_([c for c, _ in pair_set])).order_by(Lesson.id.asc()).all()
    lesson_by_pair: dict[tuple[int, int], Lesson] = {}
    for l in lesson_rows:
        key = (l.class_id, l.teacher_id)
        if key in pair_set and key not in lesson_by_pair:
            lesson_by_pair[key] = l

    attention_rows = (
        db.query(StudentAttentionRecord)
        .filter(StudentAttentionRecord.student_id.in_(student_ids), StudentAttentionRecord.attention_score < 60)
        .all()
    )
    low_attention_dates: dict[tuple[int, int, int], list[str]] = defaultdict(list)
    for a in attention_rows:
        low_attention_dates[(a.student_id, a.class_id, a.teacher_id)].append(_date_str(a.created_at))

    att_rows = db.query(StudentAttendanceRecord).filter(StudentAttendanceRecord.student_id.in_(student_ids)).all()
    absent_dates: dict[tuple[int, int, int], list[str]] = defaultdict(list)
    late_dates: dict[tuple[int, int, int], list[str]] = defaultdict(list)
    for a in att_rows:
        key = (a.student_id, a.class_id, a.teacher_id)
        if a.status == "absent":
            absent_dates[key].append(_date_str(a.updated_at or a.created_at))
        elif a.status == "late":
            late_dates[key].append(_date_str(a.updated_at or a.created_at))

    out: list[StudentLessonInsightOut] = []
    for rec, teacher_user, school_class in rows:
        key_pair = (rec.class_id, rec.teacher_id)
        key_full = (rec.student_id, rec.class_id, rec.teacher_id)
        pred = pred_by_record.get(rec.id)
        lesson = lesson_by_pair.get(key_pair)
        out.append(
            StudentLessonInsightOut(
                student_id=rec.student_id,
                student_name=student_map.get(rec.student_id, f"Student #{rec.student_id}"),
                class_id=rec.class_id,
                class_name=school_class.name,
                teacher_id=teacher_user.id,
                teacher_name=teacher_user.full_name or teacher_user.email,
                lesson_id=lesson.id if lesson else None,
                lesson_title=(lesson.title if lesson and lesson.title else f"Class #{rec.class_id} lesson"),
                term=rec.term,
                homework_avg=rec.homework_avg,
                quiz_avg=rec.quiz_avg,
                project_score=rec.project_score,
                attendance_rate=rec.attendance_rate,
                midterm_exam=rec.midterm_exam,
                final_exam=rec.final_exam,
                behavior_score=rec.behavior_score,
                predicted_grade=pred.predicted_grade if pred else None,
                predicted_score=pred.predicted_score if pred else None,
                fail_probability=pred.fail_probability if pred else None,
                risk_level=pred.risk_level if pred else None,
                low_attention_dates=sorted(set(low_attention_dates.get(key_full, []))),
                absent_dates=sorted(set(absent_dates.get(key_full, []))),
                late_dates=sorted(set(late_dates.get(key_full, []))),
            )
        )
    return out


@router.get("/class/{class_id}/student-details", response_model=list[TeacherClassStudentDetailOut])
def list_teacher_class_student_details(
    class_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
) -> list[TeacherClassStudentDetailOut]:
    _ensure_teacher_for_class(db, teacher.id, class_id)

    class_obj = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    class_name = class_obj.name if class_obj else f"#{class_id}"

    students = (
        db.query(User)
        .join(class_enrollment, class_enrollment.c.student_id == User.id)
        .filter(class_enrollment.c.class_id == class_id, User.role == "student")
        .order_by(User.full_name.asc().nulls_last(), User.id.asc())
        .all()
    )
    if not students:
        return []
    student_ids = [s.id for s in students]

    grade_rows = (
        db.query(StudentGradeRecord)
        .filter(StudentGradeRecord.class_id == class_id, StudentGradeRecord.student_id.in_(student_ids))
        .order_by(StudentGradeRecord.student_id.asc(), StudentGradeRecord.updated_at.desc())
        .all()
    )
    latest_grade_by_student: dict[int, StudentGradeRecord] = {}
    for r in grade_rows:
        latest_grade_by_student.setdefault(r.student_id, r)

    pred_rows = (
        db.query(StudentGradePrediction, StudentGradeRecord)
        .join(StudentGradeRecord, StudentGradeRecord.id == StudentGradePrediction.record_id)
        .filter(StudentGradeRecord.class_id == class_id, StudentGradeRecord.student_id.in_(student_ids))
        .order_by(StudentGradePrediction.id.desc())
        .all()
    )
    pred_by_student: dict[int, GradePredictionOut] = {}
    for p, r in pred_rows:
        pred_by_student.setdefault(r.student_id, GradePredictionOut(**_serialize_prediction(p, r)))

    attention_rows = (
        db.query(StudentAttentionRecord)
        .filter(
            StudentAttentionRecord.class_id == class_id,
            StudentAttentionRecord.student_id.in_(student_ids),
            StudentAttentionRecord.attention_score < 60,
        )
        .all()
    )
    low_attention_dates: dict[int, list[str]] = defaultdict(list)
    for a in attention_rows:
        low_attention_dates[a.student_id].append(_date_str(a.created_at))

    attendance_rows = (
        db.query(StudentAttendanceRecord)
        .filter(
            StudentAttendanceRecord.class_id == class_id,
            StudentAttendanceRecord.student_id.in_(student_ids),
        )
        .all()
    )
    absent_count: dict[int, int] = defaultdict(int)
    late_count: dict[int, int] = defaultdict(int)
    for a in attendance_rows:
        if a.status == "absent":
            absent_count[a.student_id] += 1
        elif a.status == "late":
            late_count[a.student_id] += 1

    out: list[TeacherClassStudentDetailOut] = []
    teacher_name = teacher.full_name or teacher.email
    for s in students:
        rec = latest_grade_by_student.get(s.id)
        pred = pred_by_student.get(s.id)
        dates = sorted(set(low_attention_dates.get(s.id, [])))
        out.append(
            TeacherClassStudentDetailOut(
                student_id=s.id,
                student_name=s.full_name or s.email,
                student_email=s.email,
                class_id=class_id,
                class_name=class_name,
                teacher_name=teacher_name,
                term=rec.term if rec else None,
                homework_avg=rec.homework_avg if rec else None,
                quiz_avg=rec.quiz_avg if rec else None,
                project_score=rec.project_score if rec else None,
                attendance_rate=rec.attendance_rate if rec else None,
                midterm_exam=rec.midterm_exam if rec else None,
                final_exam=rec.final_exam if rec else None,
                behavior_score=rec.behavior_score if rec else None,
                predicted_grade=pred.predicted_grade if pred else None,
                predicted_score=pred.predicted_score if pred else None,
                fail_probability=pred.fail_probability if pred else None,
                risk_level=pred.risk_level if pred else None,
                low_attention_count=len(dates),
                low_attention_dates=dates,
                absent_count=absent_count.get(s.id, 0),
                late_count=late_count.get(s.id, 0),
            )
        )
    return out
