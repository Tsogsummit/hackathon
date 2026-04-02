from pathlib import Path
from unittest.mock import MagicMock

import httpx
import pytest

from app.services import chimege_service


def _mock_settings(**overrides):
    base = dict(
        chimege_api_token="tok",
        chimege_timeout_seconds=30.0,
        chimege_stt_mode="transcribe",
        chimege_stt_long_max_wait_seconds=1800.0,
    )
    base.update(overrides)
    return MagicMock(**base)


def test_transcribe_bytes_403_clear_message(monkeypatch: pytest.MonkeyPatch) -> None:
    class _Resp403:
        status_code = 403
        text = ""

    class _Client403:
        def post(self, *a, **k):
            return _Resp403()

        def close(self) -> None:
            return None

    monkeypatch.setattr("app.services.chimege_service.get_settings", lambda: _mock_settings())
    monkeypatch.setattr(httpx, "Client", lambda **k: _Client403())

    with pytest.raises(chimege_service.ChimegeError, match="CHIMEGE_API_TOKEN"):
        chimege_service.transcribe_bytes(b"x")


def test_transcribe_bytes_success(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    calls = {"n": 0}

    class _Resp:
        status_code = 200

        def raise_for_status(self) -> None:
            return None

        text = "  Сайн байна  "

    class _Client:
        def __init__(self, *a, **k) -> None:
            pass

        def post(self, url, content=None, headers=None):
            calls["n"] += 1
            return _Resp()

        def close(self) -> None:
            return None

    monkeypatch.setattr("app.services.chimege_service.get_settings", lambda: _mock_settings())
    monkeypatch.setattr(httpx, "Client", lambda **k: _Client())

    out = chimege_service.transcribe_bytes(b"\x00\x01")
    assert out == "Сайн байна"
    assert calls["n"] == 1


def test_transcribe_bytes_timeout_retries_once(monkeypatch: pytest.MonkeyPatch) -> None:
    calls = {"n": 0}

    class _Client:
        def post(self, *a, **k):
            calls["n"] += 1
            raise httpx.TimeoutException("timeout")

        def close(self) -> None:
            return None

    monkeypatch.setattr("app.services.chimege_service.get_settings", lambda: _mock_settings())
    monkeypatch.setattr(httpx, "Client", lambda **k: _Client())

    with pytest.raises(chimege_service.ChimegeError):
        chimege_service.transcribe_bytes(b"data")
    assert calls["n"] == 2


def test_auto_mode_falls_back_to_stt_long_on_403(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.services.chimege_service.time.sleep", lambda _s: None)

    class _R403:
        status_code = 403

    class _RPush:
        status_code = 200

        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {"uuid": "job-1"}

    class _RPoll:
        status_code = 200

        def raise_for_status(self) -> None:
            return None

        def json(self) -> list:
            return [{"done": True, "transcription": "  fallback  "}]

    class _Client:
        def post(self, url, content=None, headers=None):
            if url.endswith("/transcribe"):
                return _R403()
            if url.endswith("/stt-long"):
                return _RPush()
            raise AssertionError(url)

        def get(self, url, headers=None):
            assert "stt-long-transcript" in url
            return _RPoll()

        def close(self) -> None:
            return None

    monkeypatch.setattr(
        "app.services.chimege_service.get_settings",
        lambda: _mock_settings(chimege_stt_mode="auto"),
    )
    monkeypatch.setattr(httpx, "Client", lambda **k: _Client())

    assert chimege_service.transcribe_bytes(b"\xffwav") == "fallback"


def test_transcribe_file_chunks_concat(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr("app.services.chimege_service.transcribe_bytes", lambda b, client=None: "хэсэг")
    p1 = tmp_path / "a.wav"
    p2 = tmp_path / "b.wav"
    p1.write_bytes(b"a")
    p2.write_bytes(b"b")
    out = chimege_service.transcribe_file_chunks([p1, p2])
    assert out == "хэсэг\nхэсэг"
