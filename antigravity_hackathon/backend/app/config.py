from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    chimege_api_token: str = ""

    @field_validator("chimege_api_token", mode="before")
    @classmethod
    def strip_chimege_token(cls, v: object) -> str:
        if v is None:
            return ""
        return str(v).strip()
    gemini_api_key: str = ""
    database_url: str = "postgresql://user:pass@localhost/edusmartmn"
    redis_url: str = "redis://localhost:6379"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"

    max_audio_size_mb: int = 50
    audio_chunk_duration_minutes: int = 10
    chimege_timeout_seconds: float = 30.0
    # transcribe = зөвхөн /transcribe; stt_long = зөвхөн STT-Long; auto = эхлээд transcribe, 403 бол stt-long
    chimege_stt_mode: Literal["auto", "transcribe", "stt_long"] = "auto"
    chimege_stt_long_max_wait_seconds: float = 1800.0

    # gemini-1.5-flash зарим түлхүүр/API хувилбарт v1beta дээр 404 өгдөг — stable: gemini-2.5-flash
    gemini_model: str = "gemini-2.5-flash"
    gemini_daily_limit_per_teacher: int = 10

    # Анхны админ (хэрэглэгч байхгүй үед л үүснэ)
    bootstrap_admin_email: str | None = None
    bootstrap_admin_password: str | None = None
    bootstrap_admin_name: str = "Системийн админ"
    auto_seed_test_data: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
