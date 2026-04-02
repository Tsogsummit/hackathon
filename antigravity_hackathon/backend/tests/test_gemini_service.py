import json
from unittest.mock import MagicMock

import pytest

from app.services import gemini_service


def test_sample_transcript_fixture_readable(sample_transcript: str) -> None:
    assert "квадрат" in sample_transcript.lower() or "Квадрат" in sample_transcript
    assert len(sample_transcript.split()) > 20


def test_parse_and_validate_strips_fences() -> None:
    raw = "```json\n" + '{"summary":"A","key_points":[],"homework":{"description":"","tasks":[]},"exercises":[],"exam_questions":[],"next_lesson_plan":{"suggested_topic":"","learning_objectives":[],"recommended_activities":[]},"subject_detected":"x","grade_level_detected":"5","quality_warning":false}' + "\n```"
    m = gemini_service.parse_and_validate(raw)
    assert m.summary == "A"


def test_generate_does_not_retry_on_model_404(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.services.gemini_service.get_settings", lambda: MagicMock(gemini_api_key="k", gemini_model="gemini-1.5-flash"))

    class _Model:
        def generate_content(self, prompt, generation_config=None):
            raise Exception(
                "404 models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent"
            )

    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *a, **k: _Model())
    monkeypatch.setattr("google.generativeai.configure", lambda **k: None)

    with pytest.raises(RuntimeError, match="gemini-2.5-flash"):
        gemini_service.generate_materials_from_transcript("т", {})


def test_generate_retries_on_bad_json(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.services.gemini_service.get_settings", lambda: MagicMock(gemini_api_key="k", gemini_model="gemini-2.5-flash"))

    good = json.dumps(
        {
            "summary": "OK",
            "key_points": ["1", "2", "3", "4", "5"],
            "homework": {"description": "d", "tasks": ["t1", "t2", "t3"]},
            "exercises": [
                {"question": "q", "type": "open_ended", "options": [], "answer": "a"},
            ]
            * 5,
            "exam_questions": [
                {"question": "q", "type": "open_ended", "options": [], "answer": "a", "difficulty": "easy"},
            ]
            * 10,
            "next_lesson_plan": {
                "suggested_topic": "t",
                "learning_objectives": ["o1", "o2", "o3"],
                "recommended_activities": ["a1", "a2", "a3"],
            },
            "subject_detected": "математик",
            "grade_level_detected": "8",
            "quality_warning": False,
        },
        ensure_ascii=False,
    )

    attempts = {"n": 0}

    class _Model:
        def generate_content(self, prompt, generation_config=None):
            attempts["n"] += 1
            class R:
                text = "not json" if attempts["n"] == 1 else good

            return R()

    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *a, **k: _Model())
    monkeypatch.setattr("google.generativeai.configure", lambda **k: None)

    out = gemini_service.generate_materials_from_transcript("текст", {})
    assert out.summary == "OK"
    assert attempts["n"] >= 2
