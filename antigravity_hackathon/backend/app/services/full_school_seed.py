from __future__ import annotations

import random
from datetime import time

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import (
    ClassTimetable,
    Lesson,
    SchoolClass,
    StudentAttendanceRecord,
    StudentGradePrediction,
    StudentGradeRecord,
    Subject,
    User,
    class_enrollment,
    parent_student_link,
)
from app.services.passwords import hash_password


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


def _risk(score: float) -> tuple[float, str]:
    fail_prob = max(0.0, min(100.0, round((70 - score) * 1.8, 1)))
    if fail_prob >= 70:
        return fail_prob, "high"
    if fail_prob >= 40:
        return fail_prob, "medium"
    return fail_prob, "low"


def seed_full_school(db: Session) -> dict[str, int]:
    rng = random.Random(2026)
    pwd_hash = hash_password("123456")

    created = {
        "teachers": 0,
        "subjects": 0,
        "classes": 0,
        "students": 0,
        "parents": 0,
        "enrollments": 0,
        "parent_links": 0,
        "lessons": 0,
        "timetable_rows": 0,
        "grade_records": 0,
        "grade_predictions": 0,
        "attendance_rows": 0,
    }

    subject_defs = [
        ("MATH", "Математик", "math@school.mn", "Математикийн багш"),
        ("MONG", "Монгол хэл", "mongolian@school.mn", "Монгол хэлний багш"),
        ("ENG", "Англи хэл", "english@school.mn", "Англи хэлний багш"),
        ("PHYS", "Физик", "physics@school.mn", "Физикийн багш"),
        ("CHEM", "Хими", "chemistry@school.mn", "Химийн багш"),
        ("BIO", "Биологи", "biology@school.mn", "Биологийн багш"),
        ("HIST", "Түүх", "history@school.mn", "Түүхийн багш"),
        ("GEO", "Газарзүй", "geography@school.mn", "Газарзүйн багш"),
        ("ICT", "Мэдээллийн технологи", "ict@school.mn", "МТ багш"),
        ("PE", "Биеийн тамир", "pe@school.mn", "Биеийн тамирын багш"),
    ]

    subject_ids: list[int] = []
    teacher_by_subject: dict[str, int] = {}
    for code, name, email, teacher_name in subject_defs:
        t = db.query(User).filter(User.email == email).first()
        if not t:
            t = User(email=email, password_hash=pwd_hash, full_name=teacher_name, role="teacher", is_active=True)
            db.add(t)
            db.flush()
            created["teachers"] += 1
        teacher_by_subject[code] = t.id

        s = db.query(Subject).filter(Subject.code == code).first()
        if not s:
            s = Subject(code=code, name=name, teacher_id=t.id)
            db.add(s)
            db.flush()
            created["subjects"] += 1
        else:
            s.teacher_id = t.id
        subject_ids.append(s.id)

    classes: list[SchoolClass] = []
    for grade in range(1, 13):
        for sec in ("A", "B", "C"):
            cname = f"{grade}{sec}"
            c = db.query(SchoolClass).filter(SchoolClass.name == cname).first()
            if not c:
                c = SchoolClass(name=cname)
                db.add(c)
                db.flush()
                created["classes"] += 1
            classes.append(c)

    class_students: dict[int, list[User]] = {}
    for c in classes:
        grade = int("".join(ch for ch in c.name if ch.isdigit()) or "0")
        sec = c.name[-1]
        students: list[User] = []
        for n in range(1, 26):
            st_email = f"st{grade:02d}{sec.lower()}{n:02d}@school.mn"
            st_name = f"{grade}-{sec} сурагч {n:02d}"
            st = db.query(User).filter(User.email == st_email).first()
            if not st:
                st = User(email=st_email, password_hash=pwd_hash, full_name=st_name, role="student", is_active=True)
                db.add(st)
                db.flush()
                created["students"] += 1
            students.append(st)

            p_email = f"parent_{grade:02d}{sec.lower()}{n:02d}@school.mn"
            p_name = f"{grade}-{sec} эцэг эх {n:02d}"
            p = db.query(User).filter(User.email == p_email).first()
            if not p:
                p = User(email=p_email, password_hash=pwd_hash, full_name=p_name, role="parent", is_active=True)
                db.add(p)
                db.flush()
                created["parents"] += 1

            enr = db.execute(
                select(class_enrollment.c.class_id).where(
                    class_enrollment.c.class_id == c.id,
                    class_enrollment.c.student_id == st.id,
                )
            ).first()
            if not enr:
                db.execute(class_enrollment.insert().values(class_id=c.id, student_id=st.id))
                created["enrollments"] += 1

            plink = db.execute(
                select(parent_student_link.c.parent_id).where(
                    parent_student_link.c.parent_id == p.id,
                    parent_student_link.c.student_id == st.id,
                )
            ).first()
            if not plink:
                db.execute(parent_student_link.insert().values(parent_id=p.id, student_id=st.id))
                created["parent_links"] += 1
        class_students[c.id] = students

    # One subject -> one teacher for all classes.
    lessons_by_class_subject: dict[tuple[int, int], Lesson] = {}
    for c in classes:
        for code, name, _, _ in subject_defs:
            tid = teacher_by_subject[code]
            title = f"{name} — {c.name}"
            les = db.query(Lesson).filter(Lesson.class_id == c.id, Lesson.teacher_id == tid, Lesson.title == title).first()
            if not les:
                les = Lesson(class_id=c.id, teacher_id=tid, title=title)
                db.add(les)
                db.flush()
                created["lessons"] += 1
            sub = db.query(Subject).filter(Subject.code == code).first()
            if sub:
                lessons_by_class_subject[(c.id, sub.id)] = les

    period_times = {
        1: (time(8, 0), time(8, 40)),
        2: (time(8, 45), time(9, 25)),
        3: (time(9, 30), time(10, 10)),
        4: (time(10, 15), time(10, 55)),
        5: (time(11, 0), time(11, 40)),
        6: (time(11, 45), time(12, 25)),
        7: (time(12, 30), time(13, 10)),
        8: (time(13, 15), time(13, 55)),
        9: (time(14, 0), time(14, 40)),
    }
    lunch_low_mid = (time(11, 5), time(11, 45))
    lunch_high = (time(12, 30), time(13, 10))

    for c in classes:
        grade = int("".join(ch for ch in c.name if ch.isdigit()) or "0")
        lunch_period = 5 if grade <= 9 else 7
        for weekday in range(1, 6):
            for period in range(1, 10):
                row = (
                    db.query(ClassTimetable)
                    .filter(
                        ClassTimetable.class_id == c.id,
                        ClassTimetable.weekday == weekday,
                        ClassTimetable.period_index == period,
                    )
                    .first()
                )
                is_lunch = period == lunch_period
                start_t, end_t = period_times[period]
                sub_id = None
                if is_lunch:
                    start_t, end_t = lunch_low_mid if grade <= 9 else lunch_high
                else:
                    sub_id = subject_ids[(weekday + period + grade) % len(subject_ids)]
                if row is None:
                    row = ClassTimetable(
                        class_id=c.id,
                        weekday=weekday,
                        period_index=period,
                        start_time=start_t,
                        end_time=end_t,
                        subject_id=sub_id,
                        is_lunch=is_lunch,
                    )
                    db.add(row)
                    created["timetable_rows"] += 1
                else:
                    row.start_time = start_t
                    row.end_time = end_t
                    row.subject_id = sub_id
                    row.is_lunch = is_lunch

    term = "2026-Q1"
    math_subject = db.query(Subject).filter(Subject.code == "MATH").first()
    math_teacher_id = math_subject.teacher_id if math_subject and math_subject.teacher_id else teacher_by_subject["MATH"]

    for c in classes:
        # math lesson for attendance seed
        math_lesson = lessons_by_class_subject.get((c.id, math_subject.id)) if math_subject else None
        for st in class_students[c.id]:
            rec = (
                db.query(StudentGradeRecord)
                .filter(
                    StudentGradeRecord.student_id == st.id,
                    StudentGradeRecord.class_id == c.id,
                    StudentGradeRecord.term == term,
                )
                .first()
            )
            hw = round(rng.uniform(45, 98), 2)
            quiz = round(rng.uniform(45, 98), 2)
            project = round(rng.uniform(45, 98), 2)
            attendance = round(rng.uniform(60, 100), 2)
            mid = round(rng.uniform(40, 98), 2)
            final = round(rng.uniform(35, 98), 2)
            behavior = round(rng.uniform(60, 100), 2)
            if rec is None:
                rec = StudentGradeRecord(
                    student_id=st.id,
                    class_id=c.id,
                    teacher_id=math_teacher_id,
                    term=term,
                    homework_avg=hw,
                    quiz_avg=quiz,
                    project_score=project,
                    attendance_rate=attendance,
                    midterm_exam=mid,
                    final_exam=final,
                    behavior_score=behavior,
                )
                db.add(rec)
                db.flush()
                created["grade_records"] += 1
            else:
                rec.teacher_id = math_teacher_id
                rec.homework_avg = hw
                rec.quiz_avg = quiz
                rec.project_score = project
                rec.attendance_rate = attendance
                rec.midterm_exam = mid
                rec.final_exam = final
                rec.behavior_score = behavior

            score = round(
                rec.homework_avg * 0.20
                + rec.quiz_avg * 0.10
                + rec.project_score * 0.10
                + rec.attendance_rate * 0.15
                + rec.midterm_exam * 0.20
                + rec.final_exam * 0.20
                + rec.behavior_score * 0.05,
                2,
            )
            grade = _to_grade(score)
            fail_prob, risk = _risk(score)
            summary = f"{term} улирал: таамаг {score}% ({grade}), унах магадлал {fail_prob}% ({risk})."
            pred = (
                db.query(StudentGradePrediction)
                .filter(StudentGradePrediction.record_id == rec.id)
                .order_by(StudentGradePrediction.id.desc())
                .first()
            )
            if pred is None:
                pred = StudentGradePrediction(
                    record_id=rec.id,
                    student_id=st.id,
                    class_id=c.id,
                    teacher_id=math_teacher_id,
                    predicted_score=score,
                    predicted_grade=grade,
                    risk_level=risk,
                    summary=summary,
                )
                db.add(pred)
                created["grade_predictions"] += 1
            else:
                pred.teacher_id = math_teacher_id
                pred.predicted_score = score
                pred.predicted_grade = grade
                pred.risk_level = risk
                pred.summary = summary

            if math_lesson is not None:
                att = (
                    db.query(StudentAttendanceRecord)
                    .filter(
                        StudentAttendanceRecord.lesson_id == math_lesson.id,
                        StudentAttendanceRecord.student_id == st.id,
                    )
                    .first()
                )
                status = "present"
                rr = rng.random()
                if rr < 0.08:
                    status = "absent"
                elif rr < 0.14:
                    status = "late"
                elif rr < 0.17:
                    status = "excused"
                if att is None:
                    db.add(
                        StudentAttendanceRecord(
                            lesson_id=math_lesson.id,
                            class_id=c.id,
                            teacher_id=math_teacher_id,
                            student_id=st.id,
                            status=status,
                            note="test seed",
                        )
                    )
                    created["attendance_rows"] += 1
                else:
                    att.status = status
                    att.note = "test seed"

    db.commit()
    return created
