import json
from typing import Any

import redis

from app.config import get_settings

_redis: redis.Redis | None = None


def get_redis() -> redis.Redis:
    global _redis
    if _redis is None:
        settings = get_settings()
        _redis = redis.from_url(settings.redis_url, decode_responses=True)
    return _redis


def job_key(job_id: str) -> str:
    return f"stuto:job:{job_id}"


def rate_limit_key(teacher_id: int) -> str:
    return f"stuto:gemini_daily:{teacher_id}"


def set_job(job_id: str, data: dict[str, Any], ttl_seconds: int = 86400) -> None:
    r = get_redis()
    r.setex(job_key(job_id), ttl_seconds, json.dumps(data, ensure_ascii=False))


def get_job(job_id: str) -> dict[str, Any] | None:
    r = get_redis()
    raw = r.get(job_key(job_id))
    if not raw:
        return None
    return json.loads(raw)


def increment_gemini_usage(teacher_id: int, limit: int, ttl_seconds: int = 86400) -> int:
    """Returns new count after increment, or raises if over limit."""
    r = get_redis()
    key = rate_limit_key(teacher_id)
    n = int(r.incr(key))
    if n == 1:
        r.expire(key, ttl_seconds)
    if n > limit:
        r.decr(key)
        raise ValueError("gemini_rate_limit")
    return n
