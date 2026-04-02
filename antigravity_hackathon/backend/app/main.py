import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.api.admin.router import router as admin_router
from app.api.auth.router import router as auth_router
from app.api.chat.router import router as chat_router
from app.api.grades.router import router as grades_router
from app.api.jobs.router import router as jobs_router
from app.api.lessons.router import router as lessons_router
from app.api.profile.router import router as profile_router
from app.api.student.router import router as student_router
from app.api.teacher.router import router as teacher_router
from app.bootstrap_admin import ensure_bootstrap_admin
from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models import User
import app.models  # noqa: F401 - ensure all models are registered before create_all

_log = logging.getLogger("uvicorn.error")


def _maybe_seed_demo_data(db) -> None:
    settings = get_settings()
    if not settings.auto_seed_test_data:
        return

    teacher_exists = db.query(User.id).filter(User.role == "teacher").first()
    if teacher_exists:
        return

    try:
        from seed_mock_data import main as seed_mock_data_main
        from seed_timetable import main as seed_timetable_main

        seed_mock_data_main()
        seed_timetable_main()
        _log.info("Тест дата автоматаар оруулагдлаа (seed_mock_data + seed_timetable).")
    except Exception as e:
        _log.warning("Тест дата автоматаар оруулахад алдаа гарлаа: %s", e)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Postgres can become available shortly after API boot.
    # Retry initialization so the app does not stay in a broken state.
    for attempt in range(1, 11):
        try:
            Base.metadata.create_all(bind=engine)
            db = SessionLocal()
            try:
                ensure_bootstrap_admin(db)
                _maybe_seed_demo_data(db)
            finally:
                db.close()
            break
        except OperationalError as e:
            if attempt == 10:
                _log.warning(
                    "PostgreSQL холбогдохгүй байна — хүснэгт үүсгэх алгаслаа. "
                    "docker compose up -d эсвэл DATABASE_URL тохируулна уу. Шалтгаан: %s",
                    e,
                )
            else:
                time.sleep(1)
    yield


app = FastAPI(title="EduSmart MN — Сургуулийн удирдлагын систем", version="1.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(grades_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(teacher_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(lessons_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
