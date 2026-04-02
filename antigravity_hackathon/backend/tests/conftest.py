import json
from typing import Any, Optional
from unittest.mock import MagicMock

import pytest


class _FakeRedis:
    def __init__(self) -> None:
        self._data: dict[str, str] = {}

    def setex(self, key: str, ttl: int, value: str) -> None:
        self._data[key] = value

    def get(self, key: str) -> Optional[str]:
        return self._data.get(key)

    def incr(self, key: str) -> int:
        cur = int(self._data.get(key, "0"))
        cur += 1
        self._data[key] = str(cur)
        return cur

    def decr(self, key: str) -> int:
        cur = int(self._data.get(key, "0"))
        cur -= 1
        self._data[key] = str(cur)
        return cur

    def expire(self, key: str, ttl: int) -> bool:
        return True


@pytest.fixture
def fake_redis(monkeypatch: pytest.MonkeyPatch) -> _FakeRedis:
    fr = _FakeRedis()

    def _get_redis() -> _FakeRedis:
        return fr

    monkeypatch.setattr("app.services.redis_client._redis", fr)
    monkeypatch.setattr("app.services.redis_client.get_redis", _get_redis)
    return fr


@pytest.fixture
def sample_transcript() -> str:
    from pathlib import Path

    p = Path(__file__).parent / "fixtures" / "sample_transcript.txt"
    return p.read_text(encoding="utf-8")


@pytest.fixture
def mock_genai(monkeypatch: pytest.MonkeyPatch) -> MagicMock:
    m = MagicMock()

    class _Resp:
        text = json.dumps(
            {
                "summary": "Товчлол",
                "key_points": ["a", "b", "c", "d", "e"],
                "homework": {"description": "Даалгавар", "tasks": ["1", "2", "3"]},
                "exercises": [],
                "exam_questions": [],
                "next_lesson_plan": {
                    "suggested_topic": "Сэдэв",
                    "learning_objectives": ["o1", "o2", "o3"],
                    "recommended_activities": ["a1", "a2", "a3"],
                },
                "subject_detected": "математик",
                "grade_level_detected": "8",
                "quality_warning": False,
            },
            ensure_ascii=False,
        )

    m.generate_content.return_value = _Resp()
    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *a, **k: m)
    monkeypatch.setattr("google.generativeai.configure", lambda **k: None)
    return m
