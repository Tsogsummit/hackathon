from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core import security
from app.main import app
from app.services.redis_client import set_job


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_health(client: TestClient) -> None:
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_jobs_status_401_without_auth(client: TestClient) -> None:
    r = client.get("/api/jobs/any/status")
    assert r.status_code == 401


def test_jobs_status_teacher_override(fake_redis, monkeypatch: pytest.MonkeyPatch) -> None:
    set_job("jid", {"status": "completed", "step": 3, "material_id": 9, "transcript_id": 1})
    app.dependency_overrides[security.require_teacher] = lambda: MagicMock(id=1, role="teacher")
    try:
        c = TestClient(app)
        r = c.get("/api/jobs/jid/status")
        assert r.status_code == 200
        body = r.json()
        assert body["status"] == "completed"
        assert body["material_id"] == 9
    finally:
        app.dependency_overrides.clear()


def test_generate_materials_403_for_non_teacher(monkeypatch: pytest.MonkeyPatch) -> None:
    from app.database import get_db

    def _fake_db():
        yield MagicMock()

    def _forbid_teacher():
        raise HTTPException(status_code=403, detail="no")

    app.dependency_overrides[get_db] = _fake_db
    app.dependency_overrides[security.require_teacher] = _forbid_teacher
    try:
        c = TestClient(app)
        r = c.post("/api/lessons/1/generate-materials", json={"transcript_id": 1})
        assert r.status_code == 403
    finally:
        app.dependency_overrides.clear()
