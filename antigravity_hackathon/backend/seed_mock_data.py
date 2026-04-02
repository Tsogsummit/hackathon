import os
import sys
import random
from datetime import datetime, timedelta

# Add app directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from passlib.context import CryptContext
from app.database import SessionLocal, engine
from app.models.core_models import (
    User, SchoolClass, Lesson, class_enrollment, parent_student_link,
    StudentAttentionRecord, StudentAttendanceRecord
)
from app.models.school_models import Subject
from app.models.grade_models import StudentGradeRecord, StudentGradePrediction, StudentDailyGrade

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def main():
    print("Seeding testing data strictly for '2026-Q2' semester...")
    db = SessionLocal()

    try:
        # 1. Сургуулийн ангиуд (Classes)
        classes_data = ["12A", "12B", "11A", "10A"]
        class_objs = []
        for cname in classes_data:
            c = db.query(SchoolClass).filter(SchoolClass.name == cname).first()
            if not c:
                c = SchoolClass(name=cname)
                db.add(c)
                db.commit()
                db.refresh(c)
            class_objs.append(c)

        # 2. Хичээлүүд (Subjects) & Багш нар (Teachers)
        subject_data = [("MATH", "Математик"), ("PHYS", "Физик"), ("MONG", "Монгол хэл")]
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            admin = User(email="admin@test.mn", full_name="Admin Admin", password_hash=hash_password("123456"), role="admin")
            db.add(admin)
            db.commit()
            db.refresh(admin)

        teacher_objs = []
        for i, (code, sname) in enumerate(subject_data):
            t_email = f"teacher{i+1}@test.mn"
            t = db.query(User).filter(User.email == t_email).first()
            if not t:
                t = User(email=t_email, full_name=f"{sname} Багш", password_hash=hash_password("123456"), role="teacher")
                db.add(t)
                db.commit()
                db.refresh(t)
            teacher_objs.append(t)

            sub = db.query(Subject).filter(Subject.code == code).first()
            if not sub:
                sub = Subject(code=code, name=sname, teacher_id=t.id)
                db.add(sub)
            else:
                sub.teacher_id = t.id
            db.commit()

        # 3. Багш нарыг ангитай холбох (Lessons)
        lesson_objs = []
        for t, class_obj, (code, name) in zip(teacher_objs, class_objs, subject_data):
            l = db.query(Lesson).filter(Lesson.teacher_id == t.id, Lesson.class_id == class_obj.id).first()
            if not l:
                l = Lesson(teacher_id=t.id, class_id=class_obj.id, title=f"{name} хичээл ({class_obj.name})")
                db.add(l)
                db.commit()
                db.refresh(l)
            lesson_objs.append(l)

        # 4. Сурагчид (Students) & Эцэг эх (Parents)
        students = []
        parents = []
        for i in range(1, 51):
            s_email = f"student{i}@test.mn"
            st = db.query(User).filter(User.email == s_email).first()
            if not st:
                st = User(email=s_email, full_name=f"Сурагч {i} Т.", password_hash=hash_password("123456"), role="student")
                db.add(st)
                db.commit()
                db.refresh(st)
            students.append(st)

            # Эцэг эх бүрд 2 хүүхэд хуваарилж үзье (5 эцэг эх)
            p_idx = (i - 1) // 2 + 1
            p_email = f"parent{p_idx}@test.mn"
            pt = db.query(User).filter(User.email == p_email).first()
            if not pt:
                pt = User(email=p_email, full_name=f"Эцэг эх {p_idx}", password_hash=hash_password("123456"), role="parent")
                db.add(pt)
                db.commit()
                db.refresh(pt)
            parents.append(pt)

            # Assign to class_enrollment
            c_target = class_objs[(i - 1) % len(class_objs)]
            try:
                stmt = class_enrollment.insert().values(class_id=c_target.id, student_id=st.id)
                db.execute(stmt)
                db.commit()
            except Exception:
                db.rollback() # Already enrolled

            # Assign to parent_student_link
            try:
                stmt_p = parent_student_link.insert().values(parent_id=pt.id, student_id=st.id)
                db.execute(stmt_p)
                db.commit()
            except Exception:
                db.rollback()

        # 5. Ирц, Дүн, Анхаарал (2026-Q2: Jan~April 2026)
        print("Creating attendances, grades, attention for 2026-Q2...")
        
        start_date = datetime(2026, 1, 10)
        end_date = datetime(2026, 4, 15)
        
        # Helper to generate random date in this semester
        def rand_date():
            days_diff = (end_date - start_date).days
            return start_date + timedelta(days=random.randint(0, days_diff))

        for l in lesson_objs:
            # Find students in this class
            enrolled = db.execute(class_enrollment.select().where(class_enrollment.c.class_id == l.class_id)).fetchall()
            student_ids = [row.student_id for row in enrolled]
            
            for sid in student_ids:
                # Grade prediction mock
                existing_g = db.query(StudentGradeRecord).filter(
                    StudentGradeRecord.student_id == sid, 
                    StudentGradeRecord.lesson_id == l.id if hasattr(StudentGradeRecord, 'lesson_id') else StudentGradeRecord.class_id == l.class_id,
                    StudentGradeRecord.term == "2026-Q2"
                ).first()

                if not existing_g:
                    g = StudentGradeRecord(
                        student_id=sid,
                        class_id=l.class_id,
                        teacher_id=l.teacher_id,
                        term="2026-Q2",
                        homework_avg=random.uniform(70, 100),
                        quiz_avg=random.uniform(60, 95),
                        project_score=random.uniform(80, 100),
                        attendance_rate=random.uniform(75, 100),
                        midterm_exam=random.uniform(60, 100),
                        final_exam=random.uniform(65, 100),
                        behavior_score=100.0
                    )
                    db.add(g)
                    db.commit()
                    db.refresh(g)

                    pred_score = (g.homework_avg + g.quiz_avg + g.midterm_exam + g.final_exam) / 4.0
                    if getattr(g, 'lesson_id', None) is None:
                        # Some versions of model have no lesson_id for Grade Prediction. It uses record_id
                        pass
                        
                    pred = StudentGradePrediction(
                        record_id=g.id,
                        student_id=sid,
                        class_id=l.class_id,
                        teacher_id=l.teacher_id,
                        predicted_score=pred_score,
                        predicted_grade="A" if pred_score > 90 else "B" if pred_score > 80 else "C" if pred_score > 70 else "D",
                        risk_level="low" if pred_score > 75 else "medium" if pred_score > 60 else "high",
                        summary="Эрчимтэй сайн сурч байна." if pred_score > 80 else "Анхаарах хэрэгтэй."
                    )
                    db.add(pred)
                    db.commit()

                # Attendance mock - generate ~5 records per student per lesson
                for _ in range(5):
                    stat = random.choices(["present", "absent", "late"], weights=[80, 10, 10])[0]
                    d = rand_date()
                    att = StudentAttendanceRecord(
                        lesson_id=l.id,
                        class_id=l.class_id,
                        teacher_id=l.teacher_id,
                        student_id=sid,
                        date=d.date(),
                        status=stat,
                        created_at=d
                    )
                    db.add(att)
                    
                    # Also create a DailyGrade for this date
                    dg = StudentDailyGrade(
                        lesson_id=l.id,
                        class_id=l.class_id,
                        teacher_id=l.teacher_id,
                        student_id=sid,
                        date=d.date(),
                        homework_score=random.uniform(70, 100) if random.random() > 0.2 else None,
                        quiz_score=random.uniform(50, 100) if random.random() > 0.5 else None,
                        project_score=random.uniform(80, 100) if random.random() > 0.8 else None,
                    )
                    db.add(dg)

                # Attention mock - generate ~3 records
                for _ in range(3):
                    attn = StudentAttentionRecord(
                        lesson_id=l.id,
                        class_id=l.class_id,
                        teacher_id=l.teacher_id,
                        student_id=sid,
                        attention_score=random.uniform(60, 99),
                        created_at=rand_date()
                    )
                    db.add(attn)

            db.commit()
        
        print("Testing data added successfully! Login with teacher1@test.mn or student1@test.mn / parent1@test.mn (Password: 123456)")

    except Exception as e:
        print("Error seeding data:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
