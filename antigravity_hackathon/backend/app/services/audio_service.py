import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from app.config import get_settings

ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg", ".webm"}


class AudioServiceError(Exception):
    pass


def max_bytes() -> int:
    return get_settings().max_audio_size_mb * 1024 * 1024


def validate_size(path: Path) -> None:
    size = path.stat().st_size
    if size > max_bytes():
        raise AudioServiceError(
            f"Аудио файлын хэмжээ {get_settings().max_audio_size_mb}MB-аас их байна"
        )


def get_duration_seconds(path: Path) -> int | None:
    try:
        out = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(path),
            ],
            capture_output=True,
            text=True,
            check=True,
            timeout=120,
        )
        d = float(out.stdout.strip())
        return int(round(d))
    except (subprocess.CalledProcessError, ValueError, subprocess.TimeoutExpired, OSError):
        return None


def ensure_wav(input_path: Path, work_dir: Path) -> Path:
    suffix = input_path.suffix.lower()
    if suffix == ".wav":
        return input_path
    out_wav = work_dir / "converted.wav"
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(input_path),
                "-acodec",
                "pcm_s16le",
                "-ar",
                "16000",
                "-ac",
                "1",
                str(out_wav),
            ],
            capture_output=True,
            check=True,
            timeout=600,
        )
    except subprocess.CalledProcessError as e:
        raise AudioServiceError("Аудиог WAV болгон хөрвүүлж чадсангүй") from e
    except subprocess.TimeoutExpired as e:
        raise AudioServiceError("ffmpeg хугацаа дууслаа") from e
    return out_wav


def split_wav_if_needed(wav_path: Path, work_dir: Path) -> list[Path]:
    """If file > max size, split into chunks of max N minutes."""
    settings = get_settings()
    chunk_sec = settings.audio_chunk_duration_minutes * 60
    if wav_path.stat().st_size <= max_bytes():
        return [wav_path]

    pattern = str(work_dir / "chunk_%03d.wav")
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(wav_path),
                "-f",
                "segment",
                "-segment_time",
                str(chunk_sec),
                "-c",
                "copy",
                pattern,
            ],
            capture_output=True,
            check=True,
            timeout=1200,
        )
    except subprocess.CalledProcessError as e:
        raise AudioServiceError("Аудиог хэсэглэж чадсангүй") from e

    chunks = sorted(work_dir.glob("chunk_*.wav"))
    if not chunks:
        raise AudioServiceError("Хэсэглэлт үүсээгүй")
    return chunks


def prepare_audio_paths(source_path: Path, original_suffix: str) -> tuple[list[Path], tempfile.TemporaryDirectory]:
    """
    Returns list of WAV chunk paths to send to STT and a temp dir handle (caller must cleanup).
    """
    tmp = tempfile.TemporaryDirectory(prefix="stuto_audio_")
    work = Path(tmp.name)
    try:
        src = Path(shutil.copy2(source_path, work / f"source{original_suffix}"))
        validate_size(src)
        wav = ensure_wav(src, work)
        chunks = split_wav_if_needed(wav, work)
        return chunks, tmp
    except Exception:
        tmp.cleanup()
        raise


def safe_unlink(path: str | Path) -> None:
    try:
        os.unlink(path)
    except OSError:
        pass
