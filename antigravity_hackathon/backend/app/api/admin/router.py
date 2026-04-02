from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from jose import JWTError

from app.api.admin.schemas import AdminUserCreate, AdminUserOut, AdminUserUpdate
from app.core.security import decode_token_payload, get_current_user, require_admin
from app.database import get_db
from app.models import (
    Lesson,
    Notification,
    SchoolClass,
    StudentAttendanceRecord,
    StudentFaceProfile,
    UnknownFaceLog,
    User,
    class_enrollment,
    parent_student_link,
)
from app.services.passwords import hash_password
from app.services.full_school_seed import seed_full_school

router = APIRouter(prefix="/admin", tags=["admin"])


class ClassCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class ClassOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class LessonCreate(BaseModel):
    class_id: int
    teacher_id: int
    title: str | None = None


class StudentFaceProfileUpsert(BaseModel):
    student_id: int
    image_path: str = Field(min_length=1, max_length=500)


class SeedDataResponse(BaseModel):
    users_created: int
    classes_created: int
    enrollments_created: int
    parent_links_created: int
    lessons_created: int


class FullSchoolSeedResponse(BaseModel):
    teachers: int
    subjects: int
    classes: int
    students: int
    parents: int
    enrollments: int
    parent_links: int
    lessons: int
    timetable_rows: int
    grade_records: int
    grade_predictions: int
    attendance_rows: int


class UnknownFaceLogOut(BaseModel):
    id: int
    lesson_id: int
    class_id: int
    class_name: str
    teacher_id: int
    teacher_name: str
    status: str
    note: str | None
    detected_at: str | None
    created_at: str | None
    image_url: str


class UnknownFaceLogPatchIn(BaseModel):
    status: str | None = None
    note: str | None = None


class StudentFaceProfileAdminOut(BaseModel):
    student_id: int
    student_name: str
    class_ids: list[int]
    image_url: str


class ApplyUnknownFaceIn(BaseModel):
    student_id: int


@router.get("/users", response_model=list[AdminUserOut])
def list_users(
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> list[User]:
    return db.query(User).order_by(User.id).all()


@router.post("/users", response_model=AdminUserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    body: AdminUserCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> User:
    email = body.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Энэ и-мэйл бүртгэлтэй")
    u = User(
        email=email,
        password_hash=hash_password(body.password),
        full_name=body.full_name,
        role=body.role,
        is_active=True,
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


@router.get("/classes", response_model=list[ClassOut])
def admin_list_classes(
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> list[SchoolClass]:
    return db.query(SchoolClass).order_by(SchoolClass.id).all()


@router.post("/classes", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
def admin_create_class(
    body: ClassCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> SchoolClass:
    c = SchoolClass(name=body.name.strip())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.post("/lessons", status_code=status.HTTP_201_CREATED)
def admin_create_lesson(
    body: LessonCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> dict:
    if not db.query(SchoolClass).filter(SchoolClass.id == body.class_id).first():
        raise HTTPException(status_code=400, detail="Анги олдсонгүй")
    t = db.query(User).filter(User.id == body.teacher_id, User.role == "teacher").first()
    if not t:
        raise HTTPException(status_code=400, detail="Багш олдсонгүй")
    les = Lesson(class_id=body.class_id, teacher_id=body.teacher_id, title=body.title)
    db.add(les)
    db.commit()
    db.refresh(les)
    return {"id": les.id, "class_id": les.class_id, "teacher_id": les.teacher_id, "title": les.title}


@router.patch("/users/{user_id}", response_model=AdminUserOut)
def update_user(
    user_id: int,
    body: AdminUserUpdate,
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> User:
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
    if body.full_name is not None:
        u.full_name = body.full_name
    if body.role is not None:
        u.role = body.role
    if body.is_active is not None:
        u.is_active = body.is_active
    if body.password is not None:
        u.password_hash = hash_password(body.password)
    db.commit()
    db.refresh(u)
    return u


@router.post("/students/face-profile")
def upsert_student_face_profile(
    body: StudentFaceProfileUpsert,
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> dict:
    st = db.query(User).filter(User.id == body.student_id, User.role == "student").first()
    if not st:
        raise HTTPException(status_code=404, detail="Сурагч олдсонгүй")
    rec = db.query(StudentFaceProfile).filter(StudentFaceProfile.student_id == body.student_id).first()
    if rec:
        rec.image_path = body.image_path.strip()
    else:
        rec = StudentFaceProfile(student_id=body.student_id, image_path=body.image_path.strip())
        db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"id": rec.id, "student_id": rec.student_id, "image_path": rec.image_path}


@router.post("/seed-demo", response_model=SeedDataResponse)
def seed_demo_data(
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> SeedDataResponse:
    def get_or_create_user(email: str, role: str, full_name: str, password: str = "123456") -> tuple[User, bool]:
        e = email.strip().lower()
        u = db.query(User).filter(User.email == e).first()
        if u:
            return u, False
        u = User(email=e, password_hash=hash_password(password), full_name=full_name, role=role, is_active=True)
        db.add(u)
        db.flush()
        return u, True

    users_created = classes_created = enrollments_created = parent_links_created = lessons_created = 0

    principal, c = get_or_create_user("principal@school.mn", "principal", "Сургуулийн захирал")
    users_created += int(c)

    teacher_specs = [
        ("teacher1@school.mn", "Батбаяр багш"),
        ("teacher2@school.mn", "Саруул багш"),
    ]
    teachers: list[User] = []
    for email, name in teacher_specs:
        t, c = get_or_create_user(email, "teacher", name)
        users_created += int(c)
        teachers.append(t)

    class_names = ["10A", "10B"]
    classes: list[SchoolClass] = []
    for cn in class_names:
        cls = db.query(SchoolClass).filter(SchoolClass.name == cn).first()
        if not cls:
            cls = SchoolClass(name=cn)
            db.add(cls)
            db.flush()
            classes_created += 1
        classes.append(cls)

    students: list[User] = []
    for i in range(1, 25):
        email = f"student{i:02d}@school.mn"
        name = f"Сурагч {i:02d}"
        s, c = get_or_create_user(email, "student", name)
        users_created += int(c)
        students.append(s)

    parents: list[User] = []
    for i in range(1, 25):
        email = f"parent{i:02d}@school.mn"
        name = f"Эцэг эх {i:02d}"
        p, c = get_or_create_user(email, "parent", name)
        users_created += int(c)
        parents.append(p)

    for idx, s in enumerate(students):
        cls = classes[0] if idx < 12 else classes[1]
        exists = db.execute(
            select(class_enrollment.c.class_id).where(
                class_enrollment.c.class_id == cls.id,
                class_enrollment.c.student_id == s.id,
            )
        ).first()
        if not exists:
            db.execute(class_enrollment.insert().values(class_id=cls.id, student_id=s.id))
            enrollments_created += 1

    for s, p in zip(students, parents):
        exists = db.execute(
            select(parent_student_link.c.parent_id).where(
                parent_student_link.c.parent_id == p.id,
                parent_student_link.c.student_id == s.id,
            )
        ).first()
        if not exists:
            db.execute(parent_student_link.insert().values(parent_id=p.id, student_id=s.id))
            parent_links_created += 1

    lesson_specs = [
        (classes[0].id, teachers[0].id, "Алгебр - Шугаман тэгшитгэл"),
        (classes[1].id, teachers[1].id, "Физик - Хурд ба зам"),
    ]
    for class_id, teacher_id, title in lesson_specs:
        l = db.query(Lesson).filter(Lesson.class_id == class_id, Lesson.teacher_id == teacher_id, Lesson.title == title).first()
        if not l:
            db.add(Lesson(class_id=class_id, teacher_id=teacher_id, title=title))
            lessons_created += 1

    _ = principal
    db.commit()
    return SeedDataResponse(
        users_created=users_created,
        classes_created=classes_created,
        enrollments_created=enrollments_created,
        parent_links_created=parent_links_created,
        lessons_created=lessons_created,
    )


@router.post("/seed-full-school", response_model=FullSchoolSeedResponse)
def seed_full_school_data(
    _: Annotated[User, Depends(require_admin)],
    db: Session = Depends(get_db),
) -> FullSchoolSeedResponse:
    out = seed_full_school(db)
    return FullSchoolSeedResponse(**out)


@router.get("/unknown-face-logs", response_model=list[UnknownFaceLogOut])
def list_unknown_face_logs(
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> list[UnknownFaceLogOut]:
    if user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")
    rows = (
        db.query(UnknownFaceLog, SchoolClass.name, User.full_name, User.email)
        .join(SchoolClass, SchoolClass.id == UnknownFaceLog.class_id)
        .join(User, User.id == UnknownFaceLog.teacher_id)
        .order_by(UnknownFaceLog.id.desc())
        .limit(500)
        .all()
    )
    out: list[UnknownFaceLogOut] = []
    for r, class_name, teacher_full_name, teacher_email in rows:
        out.append(
            UnknownFaceLogOut(
                id=r.id,
                lesson_id=r.lesson_id,
                class_id=r.class_id,
                class_name=class_name,
                teacher_id=r.teacher_id,
                teacher_name=teacher_full_name or teacher_email,
                status=r.status,
                note=r.note,
                detected_at=r.detected_at.isoformat() if r.detected_at else None,
                created_at=r.created_at.isoformat() if r.created_at else None,
                image_url=f"/api/admin/unknown-face-logs/{r.id}/image",
            )
        )
    return out


@router.patch("/unknown-face-logs/{log_id}", response_model=UnknownFaceLogOut)
def patch_unknown_face_log(
    log_id: int,
    body: UnknownFaceLogPatchIn,
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> UnknownFaceLogOut:
    if user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")
    row = db.query(UnknownFaceLog).filter(UnknownFaceLog.id == log_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Log олдсонгүй")
    if body.status is not None:
        if body.status not in {"open", "reviewed", "ignored"}:
            raise HTTPException(status_code=400, detail="status буруу")
        row.status = body.status
    if body.note is not None:
        row.note = body.note.strip()[:1000] or None
    db.commit()
    db.refresh(row)
    class_obj = db.query(SchoolClass).filter(SchoolClass.id == row.class_id).first()
    t = db.query(User).filter(User.id == row.teacher_id).first()
    return UnknownFaceLogOut(
        id=row.id,
        lesson_id=row.lesson_id,
        class_id=row.class_id,
        class_name=class_obj.name if class_obj else f"#{row.class_id}",
        teacher_id=row.teacher_id,
        teacher_name=(t.full_name or t.email) if t else f"#{row.teacher_id}",
        status=row.status,
        note=row.note,
        detected_at=row.detected_at.isoformat() if row.detected_at else None,
        created_at=row.created_at.isoformat() if row.created_at else None,
        image_url=f"/api/admin/unknown-face-logs/{row.id}/image",
    )


@router.get("/unknown-face-logs/{log_id}/image")
def get_unknown_face_log_image(
    log_id: int,
    access_token: str = Query(..., min_length=10),
    db: Session = Depends(get_db),
):
    from pathlib import Path

    from fastapi.responses import FileResponse

    try:
        payload = decode_token_payload(access_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Буруу token") from None
    sub = payload.get("sub")
    user_id = int(sub) if str(sub).isdigit() else None
    if user_id is None:
        raise HTTPException(status_code=401, detail="Буруу token")
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not user or user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")
    row = db.query(UnknownFaceLog).filter(UnknownFaceLog.id == log_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Log олдсонгүй")
    p = Path(row.image_path)
    if not p.is_absolute():
        p = Path.cwd() / p
    if not p.exists() or not p.is_file():
        raise HTTPException(status_code=404, detail="Зураг олдсонгүй")
    return FileResponse(str(p))


@router.get("/student-face-profiles", response_model=list[StudentFaceProfileAdminOut])
def list_student_face_profiles_for_admin(
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> list[StudentFaceProfileAdminOut]:
    if user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")
    rows = (
        db.query(StudentFaceProfile, User)
        .join(User, User.id == StudentFaceProfile.student_id)
        .filter(User.role == "student")
        .order_by(StudentFaceProfile.student_id.asc())
        .all()
    )
    if not rows:
        return []
    out: list[StudentFaceProfileAdminOut] = []
    for p, u in rows:
        cls_rows = db.execute(
            select(class_enrollment.c.class_id).where(class_enrollment.c.student_id == p.student_id)
        ).all()
        out.append(
            StudentFaceProfileAdminOut(
                student_id=p.student_id,
                student_name=u.full_name or u.email,
                class_ids=[r[0] for r in cls_rows],
                image_url=f"/api/admin/students/{p.student_id}/face-image",
            )
        )
    return out


@router.get("/students/{student_id}/face-image")
def get_student_face_image_for_admin(
    student_id: int,
    access_token: str = Query(..., min_length=10),
    db: Session = Depends(get_db),
):
    from pathlib import Path

    from fastapi.responses import FileResponse

    try:
        payload = decode_token_payload(access_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Буруу token") from None
    sub = payload.get("sub")
    user_id = int(sub) if str(sub).isdigit() else None
    if user_id is None:
        raise HTTPException(status_code=401, detail="Буруу token")
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not user or user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")

    profile = db.query(StudentFaceProfile).filter(StudentFaceProfile.student_id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Face profile олдсонгүй")
    p = Path(profile.image_path)
    if not p.is_absolute():
        p = Path.cwd() / p
    if not p.exists() or not p.is_file():
        raise HTTPException(status_code=404, detail="Зургийн файл олдсонгүй")
    return FileResponse(str(p))


@router.post("/unknown-face-logs/{log_id}/apply-to-attendance")
def apply_unknown_face_to_attendance(
    log_id: int,
    body: ApplyUnknownFaceIn,
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> dict:
    if user.role not in {"admin", "principal"}:
        raise HTTPException(status_code=403, detail="Зөвхөн админ эсвэл захирал")

    row = db.query(UnknownFaceLog).filter(UnknownFaceLog.id == log_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Log олдсонгүй")
    lesson = db.query(Lesson).filter(Lesson.id == row.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Хичээл олдсонгүй")

    enrolled = db.execute(
        select(class_enrollment.c.student_id).where(
            class_enrollment.c.class_id == row.class_id,
            class_enrollment.c.student_id == body.student_id,
        )
    ).first()
    if not enrolled:
        raise HTTPException(status_code=400, detail="Сонгосон сурагч энэ ангид бүртгэлгүй")

    att = (
        db.query(StudentAttendanceRecord)
        .filter(
            StudentAttendanceRecord.lesson_id == row.lesson_id,
            StudentAttendanceRecord.student_id == body.student_id,
        )
        .first()
    )
    auto_note = f"unknown-face-log#{row.id} -> student#{body.student_id} (admin-reviewed)"
    if att:
        att.status = "present"
        att.note = auto_note
        att.teacher_id = lesson.teacher_id
    else:
        att = StudentAttendanceRecord(
            lesson_id=row.lesson_id,
            class_id=row.class_id,
            teacher_id=lesson.teacher_id,
            student_id=body.student_id,
            status="present",
            note=auto_note,
        )
        db.add(att)

    student = db.query(User).filter(User.id == body.student_id).first()
    student_name = (student.full_name or student.email) if student else f"#{body.student_id}"

    # Notify lesson teacher
    teacher_title = "Unknown face review -> ирц шинэчлэгдлээ"
    teacher_body = (
        f"Сурагч: {student_name}, Хичээл #{row.lesson_id}, Анги #{row.class_id}. "
        f"Unknown log #{row.id}-оос present болгож хадгаллаа. "
        f"link: /teacher/attendance?lesson_id={row.lesson_id}"
    )
    db.add(Notification(user_id=lesson.teacher_id, title=teacher_title, body=teacher_body, read=False))

    # Notify linked parents
    parent_rows = db.execute(
        select(parent_student_link.c.parent_id).where(parent_student_link.c.student_id == body.student_id)
    ).all()
    parent_title = f"Ирц автоматаар бүртгэгдлээ: {student_name}"
    parent_body = (
        f"Хичээл #{row.lesson_id}, Анги #{row.class_id}. "
        f"Камерын танилтын review-оор present төлөвт хадгаллаа. "
        "link: /parent"
    )
    for p in parent_rows:
        db.add(Notification(user_id=p[0], title=parent_title, body=parent_body, read=False))

    row.status = "reviewed"
    row.note = auto_note
    db.commit()
    db.refresh(row)

    class_obj = db.query(SchoolClass).filter(SchoolClass.id == row.class_id).first()
    t = db.query(User).filter(User.id == row.teacher_id).first()
    updated_log = UnknownFaceLogOut(
        id=row.id,
        lesson_id=row.lesson_id,
        class_id=row.class_id,
        class_name=class_obj.name if class_obj else f"#{row.class_id}",
        teacher_id=row.teacher_id,
        teacher_name=(t.full_name or t.email) if t else f"#{row.teacher_id}",
        status=row.status,
        note=row.note,
        detected_at=row.detected_at.isoformat() if row.detected_at else None,
        created_at=row.created_at.isoformat() if row.created_at else None,
        image_url=f"/api/admin/unknown-face-logs/{row.id}/image",
    )
    return {"updated_log": updated_log.model_dump(), "attendance_saved": True}
