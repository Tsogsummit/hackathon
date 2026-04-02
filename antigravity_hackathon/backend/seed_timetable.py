import os
import sys
from datetime import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.core_models import SchoolClass
from app.models.school_models import Subject, ClassTimetable

def main():
    print("Seeding timetables for testing classes...")
    db = SessionLocal()

    try:
        classes = db.query(SchoolClass).all()
        subjects = db.query(Subject).all()
        
        if not subjects:
            print("No subjects found! Please run seed_mock_data.py first.")
            return

        for c in classes:
            # Check if timetable already exists
            existing = db.query(ClassTimetable).filter(ClassTimetable.class_id == c.id).first()
            if existing:
                continue
            
            # Create a simple 5-day week timetable
            for day in range(1, 6): # Mon-Fri
                # Period 1
                db.add(ClassTimetable(
                    class_id=c.id, weekday=day, period_index=1,
                    start_time=time(8, 0), end_time=time(8, 40),
                    subject_id=subjects[day % len(subjects)].id, is_lunch=False
                ))
                # Period 2
                db.add(ClassTimetable(
                    class_id=c.id, weekday=day, period_index=2,
                    start_time=time(8, 50), end_time=time(9, 30),
                    subject_id=subjects[(day + 1) % len(subjects)].id, is_lunch=False
                ))
                # Lunch Period (Period 3)
                db.add(ClassTimetable(
                    class_id=c.id, weekday=day, period_index=3,
                    start_time=time(9, 40), end_time=time(10, 20),
                    subject_id=None, is_lunch=True
                ))
                # Period 4
                db.add(ClassTimetable(
                    class_id=c.id, weekday=day, period_index=4,
                    start_time=time(10, 30), end_time=time(11, 10),
                    subject_id=subjects[(day + 2) % len(subjects)].id, is_lunch=False
                ))

        db.commit()
        print("Timetable populated successfully!")

    except Exception as e:
        print(f"Error seeding timetable: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
