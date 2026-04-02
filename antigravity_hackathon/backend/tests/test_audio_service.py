from pathlib import Path
from unittest.mock import MagicMock

import pytest

from app.services import audio_service


def test_validate_size_too_large(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr("app.services.audio_service.get_settings", lambda: MagicMock(max_audio_size_mb=1))
    p = tmp_path / "big.bin"
    p.write_bytes(b"x" * (2 * 1024 * 1024))
    with pytest.raises(audio_service.AudioServiceError):
        audio_service.validate_size(p)


def test_ensure_wav_calls_ffmpeg(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    src = tmp_path / "a.mp3"
    src.write_bytes(b"fake")
    work = tmp_path / "w"
    work.mkdir()

    def fake_run(cmd, **kwargs):
        assert "ffmpeg" in cmd
        out = Path(cmd[-1])
        out.write_bytes(b"RIFF")

    monkeypatch.setattr("app.services.audio_service.subprocess.run", fake_run)
    out = audio_service.ensure_wav(src, work)
    assert out.suffix == ".wav"


def test_split_wav_if_needed_small_file(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr("app.services.audio_service.get_settings", lambda: MagicMock(max_audio_size_mb=50, audio_chunk_duration_minutes=10))
    wav = tmp_path / "s.wav"
    wav.write_bytes(b"small")
    monkeypatch.setattr("app.services.audio_service.max_bytes", lambda: 999999)
    chunks = audio_service.split_wav_if_needed(wav, tmp_path)
    assert chunks == [wav]
