from fastapi.testclient import TestClient

from app.main import app
from app.mock import state

client = TestClient(app)


def test_active_session_returns_200_and_session():
    r = client.get("/api/sessions/active")
    assert r.status_code == 200
    data = r.json()
    assert data is not None
    assert data["id"] == "0847"
    assert data["algorithm"] == "Flood Fill"
    assert data["status"] == "finished"   


def test_active_session_returns_null_when_no_session():
    saved = state.session
    state.session = None
    try:
        r = client.get("/api/sessions/active")
        assert r.status_code == 200
        assert r.json() is None
    finally:
        state.session = saved  


def test_active_session_shape_matches_model():
    """O JSON tem exatamente os campos do modelo Session."""
    r = client.get("/api/sessions/active")
    data = r.json()
    assert set(data.keys()) == {"id", "status", "algorithm", "elapsed_seconds"}