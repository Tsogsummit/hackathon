import re
import tempfile
import uuid
from pathlib import Path
from typing import Annotated, Any
from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.api.lessons.schemas import (
    DistributeBody,
    DistributeResponse,
    GenerateMaterialsBody,
    GenerateMaterialsResponse,
    MaterialListItem,
    RecordingUrlBody,
    TranscribeResponse,
)
from app.config import get_settings
from app.core.security import get_lesson_for_teacher, require_teacher
from app.database import get_db
from app.models import Lesson, LessonMaterial, LessonTranscript, User
from app.services import audio_service
from app.services.chimege_service import ChimegeError, transcribe_audio_chunks
from app.services.notification_service import notify_students_and_parents
from app.services.redis_client import get_job, increment_gemini_usage, set_job
from app.tasks.generation_task import run_material_generation_job

router = APIRouter(prefix="/lessons", tags=["lessons-ai"])


def _latin_script_warning(text: str) -> bool:
    if not text or not text.strip():
        return False
    letters = [c for c in text if c.isalpha()]
    if not letters:
        return False
    latin = sum(1 for c in letters if ("A" <= c <= "Z") or ("a" <= c <= "z"))
    return (latin / len(letters)) > 0.4


def _word_count(text: str) -> int:
    parts = re.split(r"\s+", text.strip()) if text else []
    return len([p for p in parts if p])


async def _save_upload_or_url(
    request: Request,
    audio: UploadFile | None,
) -> tuple[Path, str, tempfile.TemporaryDirectory | None]:
    """Returns (path, original_suffix, temp_dir_for_cleanup_or_none)."""
    ctype = request.headers.get("content-type", "")
    if audio is not None and "multipart/form-data" in ctype:
        raw_name = audio.filename or "recording.wav"
        suffix = Path(raw_name).suffix.lower() or ".wav"
        if suffix not in audio_service.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Зөвшөөрөгдсөн формат: WAV, MP3, M4A, OGG, WEBM",
            )
        tmpdir = tempfile.TemporaryDirectory(prefix="stuto_upload_")
        dest = Path(tmpdir.name) / f"upload{suffix}"
        content = await audio.read()
        settings = get_settings()
        max_b = settings.max_audio_size_mb * 1024 * 1024
        if len(content) > max_b:
            tmpdir.cleanup()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Файлын хэмжээ {settings.max_audio_size_mb}MB-аас их байна",
            )
        dest.write_bytes(content)
        return dest, suffix, tmpdir

    if "application/json" in ctype:
        body = await request.json()
        rb = RecordingUrlBody.model_validate(body)
        url = rb.recording_url.strip()
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            raise HTTPException(status_code=400, detail="Буруу recording_url")
        settings = get_settings()
        max_b = settings.max_audio_size_mb * 1024 * 1024
        path_suffix = Path(parsed.path).suffix.lower() or ".wav"
        ext = path_suffix if path_suffix in audio_service.ALLOWED_EXTENSIONS else ".mp3"
        tmpdir = tempfile.TemporaryDirectory(prefix="stuto_url_")
        dest = Path(tmpdir.name) / f"remote{ext}"
        total = 0
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
                async with client.stream("GET", url) as resp:
                    resp.raise_for_status()
                    cl = resp.headers.get("content-length")
                    if cl and int(cl) > max_b:
                        raise HTTPException(status_code=400, detail="Файлын хэмжээ хэт том")
                    with dest.open("wb") as f:
                        async for chunk in resp.aiter_bytes():
                            total += len(chunk)
                            if total > max_b:
                                raise HTTPException(status_code=400, detail="Файлын хэмжээ хэт том")
                            f.write(chunk)
        except HTTPException:
            tmpdir.cleanup()
            raise
        except Exception as e:
            tmpdir.cleanup()
            raise HTTPException(status_code=400, detail=f"Татаж чадсангүй: {e}") from e
        return dest, ext, tmpdir

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail='Аудио файл эсвэл JSON {"recording_url": "..."} илгээнэ үү',
    )


@router.post("/{lesson_id}/transcribe", response_model=TranscribeResponse)
async def transcribe_lesson_audio(
    request: Request,
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
    audio: UploadFile | None = File(None),
    lesson: Lesson = Depends(get_lesson_for_teacher),
) -> TranscribeResponse:
    _ = lesson_id
    upload_dir: tempfile.TemporaryDirectory | None = None
    prep_tmp: tempfile.TemporaryDirectory | None = None
    source_path: Path | None = None
    try:
        source_path, suffix, upload_dir = await _save_upload_or_url(request, audio)
        audio_service.validate_size(source_path)

        tr = LessonTranscript(
            lesson_id=lesson.id,
            teacher_id=teacher.id,
            audio_filename=audio.filename if audio and audio.filename else "recording_url",
            audio_duration=audio_service.get_duration_seconds(source_path),
            raw_text=None,
            word_count=None,
            chimege_status="processing",
        )
        db.add(tr)
        db.commit()
        db.refresh(tr)

        chunks, prep_tmp = audio_service.prepare_audio_paths(source_path, suffix)
        try:
            text, stt_src = transcribe_audio_chunks(chunks)
        except ChimegeError as e:
            tr.chimege_status = "failed"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Текст болгож чадсангүй: {e}",
            ) from e

        warnings: list[str] = []
        if not text.strip():
            warnings.append("empty_transcript")
        if _latin_script_warning(text):
            warnings.append("language_warning")

        wc = _word_count(text)
        tr.raw_text = text
        tr.word_count = wc
        tr.chimege_status = "completed"
        db.commit()

        return TranscribeResponse(
            transcript_id=tr.id,
            text=text,
            word_count=wc,
            warnings=warnings,
            stt_source=stt_src,
        )
    finally:
        if prep_tmp is not None:
            prep_tmp.cleanup()
        if upload_dir is not None:
            upload_dir.cleanup()


@router.post("/{lesson_id}/generate-materials", response_model=GenerateMaterialsResponse)
def generate_materials(
    lesson_id: int,
    body: GenerateMaterialsBody,
    background_tasks: BackgroundTasks,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
    lesson: Lesson = Depends(get_lesson_for_teacher),
) -> GenerateMaterialsResponse:
    _ = lesson_id
    transcript = (
        db.query(LessonTranscript)
        .filter(
            LessonTranscript.id == body.transcript_id,
            LessonTranscript.lesson_id == lesson.id,
            LessonTranscript.teacher_id == teacher.id,
        )
        .first()
    )
    if not transcript or not (transcript.raw_text or "").strip():
        raise HTTPException(status_code=400, detail="Тайлбар текст олдсонгүй. Дахин бичлэг хийнэ үү.")

    settings = get_settings()
    try:
        increment_gemini_usage(teacher.id, settings.gemini_daily_limit_per_teacher)
    except ValueError:
        raise HTTPException(
            status_code=429,
            detail="Өдөрт Gemini ашиглалтын хязгаар (10) хүрсэн байна. Маргааш дахин оролдоно уу.",
        ) from None

    job_id = str(uuid.uuid4())
    meta = body.metadata.model_dump(exclude_none=True)
    set_job(
        job_id,
        {
            "status": "pending",
            "step": 3,
            "message": "Хүлээгдэж байна...",
            "transcript_id": transcript.id,
        },
    )
    background_tasks.add_task(
        run_material_generation_job,
        job_id,
        transcript.id,
        teacher.id,
        meta,
    )
    return GenerateMaterialsResponse(job_id=job_id)


@router.get("/{lesson_id}/materials", response_model=list[MaterialListItem])
def list_materials(
    lesson_id: int,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
    lesson: Lesson = Depends(get_lesson_for_teacher),
) -> list[LessonMaterial]:
    _ = lesson_id
    rows = (
        db.query(LessonMaterial)
        .filter(LessonMaterial.lesson_id == lesson.id, LessonMaterial.teacher_id == teacher.id)
        .order_by(LessonMaterial.created_at.desc())
        .all()
    )
    return rows


@router.patch("/{lesson_id}/materials/{material_id}")
def patch_material(
    lesson_id: int,
    material_id: int,
    updates: dict[str, Any],
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
    lesson: Lesson = Depends(get_lesson_for_teacher),
) -> dict[str, Any]:
    _ = lesson_id
    mat = (
        db.query(LessonMaterial)
        .filter(
            LessonMaterial.id == material_id,
            LessonMaterial.lesson_id == lesson.id,
            LessonMaterial.teacher_id == teacher.id,
        )
        .first()
    )
    if not mat:
        raise HTTPException(status_code=404, detail="Материал олдсонгүй")

    allowed = {
        "summary",
        "key_points",
        "homework",
        "exercises",
        "exam_questions",
        "next_lesson_plan",
        "subject_detected",
        "grade_detected",
        "quality_warning",
    }
    for k, v in updates.items():
        if k in allowed and hasattr(mat, k):
            setattr(mat, k, v)
    mat.teacher_approved = True
    db.commit()
    db.refresh(mat)
    return {"id": mat.id, "teacher_approved": mat.teacher_approved}


@router.post("/{lesson_id}/materials/{material_id}/distribute", response_model=DistributeResponse)
def distribute_material(
    lesson_id: int,
    material_id: int,
    body: DistributeBody,
    teacher: Annotated[User, Depends(require_teacher)],
    db: Annotated[Session, Depends(get_db)],
    lesson: Lesson = Depends(get_lesson_for_teacher),
) -> DistributeResponse:
    _ = lesson_id
    mat = (
        db.query(LessonMaterial)
        .filter(
            LessonMaterial.id == material_id,
            LessonMaterial.lesson_id == lesson.id,
            LessonMaterial.teacher_id == teacher.id,
        )
        .first()
    )
    if not mat:
        raise HTTPException(status_code=404, detail="Материал олдсонгүй")
    if not mat.teacher_approved:
        raise HTTPException(status_code=400, detail="Эхлээд материалыг баталгаажуулна уу")

    if body.class_id is not None and body.class_id != lesson.class_id:
        raise HTTPException(
            status_code=400,
            detail="Зөвхөн энэ хичээлийн ангид илгээх боломжтой",
        )

    from datetime import datetime, timezone

    title = "Шинэ хичээлийн материал"
    body_text = (mat.summary or "")[:2000]
    n = notify_students_and_parents(db, lesson, title, body_text, body.notify_parents)

    mat.sent_to_students = True
    mat.distributed_at = datetime.now(timezone.utc)
    db.commit()

    return DistributeResponse(notified_count=n, distributed_at=mat.distributed_at)
