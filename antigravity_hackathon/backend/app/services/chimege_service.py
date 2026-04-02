import time
from pathlib import Path

import httpx

from app.config import get_settings


class ChimegeError(Exception):
    pass


CHIMEGE_TRANSCRIBE_URL = "https://api.chimege.com/v1.2/transcribe"
CHIMEGE_STT_LONG_PUSH_URL = "https://api.chimege.com/v1.2/stt-long"
CHIMEGE_STT_LONG_POLL_URL = "https://api.chimege.com/v1.2/stt-long-transcript"

# Chimege docs: HTTP 403 = "error related to Token" (баримт: docs.api.chimege.com v1.2)
_CHIMEGE_403_HINT = (
    "Chimege API token буруу, хүчингүй эсвэл эрх дууссан (HTTP 403). "
    "STT-Long токен зөвхөн /stt-long-д зориулагддаг бол /transcribe 403 өгнө — "
    "CHIMEGE_STT_MODE=stt_long эсвэл auto ашиглана уу. "
    ".env дахь CHIMEGE_API_TOKEN-ийг шалгана уу."
)


def _raise_if_403(r: httpx.Response) -> None:
    if r.status_code == 403:
        raise ChimegeError(_CHIMEGE_403_HINT)


def _transcribe_short(c: httpx.Client, audio_bytes: bytes, token: str) -> str:
    headers = {
        "Content-Type": "application/octet-stream",
        "Punctuate": "true",
        "Token": token,
    }
    r = c.post(CHIMEGE_TRANSCRIBE_URL, content=audio_bytes, headers=headers)
    _raise_if_403(r)
    r.raise_for_status()
    return (r.text or "").strip()


def _transcribe_stt_long(c: httpx.Client, audio_bytes: bytes, token: str) -> str:
    """STT-Long: push WAV, then poll /stt-long-transcript (Chimege v1.2)."""
    settings = get_settings()
    push_headers = {
        "Content-Type": "application/octet-stream",
        "Token": token,
    }
    r = c.post(CHIMEGE_STT_LONG_PUSH_URL, content=audio_bytes, headers=push_headers)
    _raise_if_403(r)
    r.raise_for_status()
    try:
        payload = r.json()
    except Exception as e:
        raise ChimegeError("Chimege stt-long: JSON хариу биш") from e
    job_uuid = payload.get("uuid")
    if not job_uuid:
        raise ChimegeError("Chimege stt-long: uuid алга")

    deadline = time.monotonic() + settings.chimege_stt_long_max_wait_seconds
    poll_headers = {"Token": token, "UUID": str(job_uuid)}

    while time.monotonic() < deadline:
        time.sleep(1.0)
        pr = c.get(CHIMEGE_STT_LONG_POLL_URL, headers=poll_headers)
        _raise_if_403(pr)
        pr.raise_for_status()
        try:
            arr = pr.json()
        except Exception:
            continue
        if not arr:
            continue
        item = arr[0] if isinstance(arr, list) else arr
        if isinstance(item, dict) and item.get("done"):
            return (item.get("transcription") or "").strip()

    raise ChimegeError("chimege_stt_long_timeout")


def transcribe_bytes(audio_bytes: bytes, client: httpx.Client | None = None) -> str:
    settings = get_settings()
    if not settings.chimege_api_token:
        raise ChimegeError("Chimege токен тохируулаагүй байна")

    token = settings.chimege_api_token
    timeout = httpx.Timeout(settings.chimege_timeout_seconds)
    mode = settings.chimege_stt_mode

    def _single(c: httpx.Client) -> str:
        if mode == "stt_long":
            return _transcribe_stt_long(c, audio_bytes, token)
        if mode == "transcribe":
            return _transcribe_short(c, audio_bytes, token)
        # auto: эхлээд богино transcribe, 403 бол STT-Long (dashboard-ийн «STT-Long» токен)
        headers = {
            "Content-Type": "application/octet-stream",
            "Punctuate": "true",
            "Token": token,
        }
        r = c.post(CHIMEGE_TRANSCRIBE_URL, content=audio_bytes, headers=headers)
        if r.status_code == 403:
            return _transcribe_stt_long(c, audio_bytes, token)
        r.raise_for_status()
        return (r.text or "").strip()

    close = client is None
    c = client or httpx.Client(timeout=timeout)
    try:
        try:
            return _single(c)
        except httpx.TimeoutException:
            try:
                return _single(c)
            except httpx.TimeoutException as e:
                raise ChimegeError("chimege_timeout") from e
    except httpx.HTTPError as e:
        if isinstance(e, httpx.HTTPStatusError) and e.response is not None and e.response.status_code == 403:
            raise ChimegeError(_CHIMEGE_403_HINT) from e
        raise ChimegeError(str(e)) from e
    finally:
        if close:
            c.close()


def transcribe_file_chunks(chunk_paths: list[Path], client: httpx.Client | None = None) -> str:
    parts: list[str] = []
    for p in chunk_paths:
        data = p.read_bytes()
        text = transcribe_bytes(data, client=client)
        parts.append(text)
    return "\n".join(parts)


def transcribe_audio_chunks(chunk_paths: list[Path]) -> tuple[str, str]:
    """
    Бүх аудиог Chimege API-аар текст болгоно.
    Returns (transcript, stt_source) — stt_source үргэлж 'chimege'.
    """
    with httpx.Client() as client:
        text = transcribe_file_chunks(chunk_paths, client=client)
    return text, "chimege"
