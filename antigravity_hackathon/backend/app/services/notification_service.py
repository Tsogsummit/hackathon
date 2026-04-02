from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Lesson, Notification
from app.models.core_models import class_enrollment, parent_student_link


def notify_students_and_parents(
    db: Session,
    lesson: Lesson,
    title: str,
    body: str,
    notify_parents: bool,
) -> int:
    """Creates notification rows; returns count created."""
    rows = db.execute(
        select(class_enrollment.c.student_id).where(class_enrollment.c.class_id == lesson.class_id)
    ).all()
    student_ids = [r[0] for r in rows]
    created = 0
    for sid in student_ids:
        db.add(Notification(user_id=sid, title=title, body=body, read=False))
        created += 1
        if notify_parents:
            prow = db.execute(
                select(parent_student_link.c.parent_id).where(parent_student_link.c.student_id == sid)
            ).all()
            parent_ids = [p[0] for p in prow]
            for pid in parent_ids:
                db.add(Notification(user_id=pid, title=title, body=body, read=False))
                created += 1
    db.commit()
    return created
