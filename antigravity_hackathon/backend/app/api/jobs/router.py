from fastapi import APIRouter, Depends, HTTPException, status

from app.api.lessons.schemas import JobStatusResponse
from app.core.security import require_teacher
from app.models import User
from app.services.redis_client import get_job

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/{job_id}/status", response_model=JobStatusResponse)
def get_job_status(
    job_id: str,
    _: User = Depends(require_teacher),
) -> JobStatusResponse:
    data = get_job(job_id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ажил олдсонгүй")
    return JobStatusResponse.model_validate(data)
