import json
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import LessonMaterial, LessonTranscript
from app.services import gemini_service
from app.services.redis_client import set_job


def run_material_generation_job(
    job_id: str,
    transcript_id: int,
    teacher_id: int,
    metadata: dict[str, Any],
) -> None:
    db: Session = SessionLocal()
    try:
        transcript = db.query(LessonTranscript).filter(LessonTranscript.id == transcript_id).first()
        if not transcript or transcript.teacher_id != teacher_id:
            set_job(job_id, {"status": "failed", "error": "Transcript олдсонгүй"})
            return

        set_job(
            job_id,
            {
                "status": "processing",
                "step": 3,
                "message": "Gemini ашиглан материал үүсгэж байна...",
                "transcript_id": transcript.id,
            },
        )
        text = transcript.raw_text or ""
        result = gemini_service.generate_materials_from_transcript(text, metadata)
        data = gemini_service.materials_to_storage_dict(result)

        mat = LessonMaterial(
            lesson_id=transcript.lesson_id,
            transcript_id=transcript.id,
            teacher_id=teacher_id,
            subject_detected=data.get("subject_detected"),
            grade_detected=data.get("grade_level_detected"),
            summary=data.get("summary"),
            key_points=data.get("key_points"),
            homework=data.get("homework"),
            exercises=data.get("exercises"),
            exam_questions=data.get("exam_questions"),
            next_lesson_plan=data.get("next_lesson_plan"),
            quality_warning=bool(data.get("quality_warning")),
            teacher_approved=True,
            sent_to_students=True,
            distributed_at=datetime.now(timezone.utc),
            gemini_status="completed",
            original_gemini_output=json.loads(json.dumps(data, ensure_ascii=False)),
        )
        db.add(mat)
        db.commit()
        db.refresh(mat)

        set_job(
            job_id,
            {
                "status": "completed",
                "step": 3,
                "material_id": mat.id,
                "result": data,
                "transcript_id": transcript.id,
            },
        )
    except Exception as e:
        db.rollback()
        set_job(
            job_id,
            {
                "status": "failed",
                "step": 3,
                "error": str(e),
                "transcript_id": transcript_id,
            },
        )
    finally:
        db.close()
