import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.mock import state
from app.mock.seed import SESSION_ID

client = TestClient(app)

def test_maze_returns_grid():
    r = client.get(f"/api/sessions/{SESSION_ID}/maze")
    assert r.status_code == 200
    body = r.json()
    assert body["size"] == 16
    assert len(body["grid"]) == 16
    assert all(len(row) == 16 for row in body["grid"])
    assert body["start"] == {"row": 0, "col": 0}
    assert body["goal"] == {"row": 15, "col": 15}

def test_path_returns_trajectory():
    r = client.get(f"/api/sessions/{SESSION_ID}/path")
    assert r.status_code == 200
    assert len(r.json()) == len(state.path)

@pytest.mark.parametrize("resource", ["maze", "path", "metrics", "events"])
def test_returns_404_for_unknown_session(resource):
    r = client.get(f"/api/sessions/unknown_session/{resource}")
    assert r.status_code == 404
    assert r.json() == {"detail": "No active session found"}


@pytest.mark.parametrize("resource", ["maze", "path", "metrics", "events"])
def test_path_returns_404_when_no_session(resource):
    saved = state.session
    state.session = None
    try:
        r = client.get(f"/api/sessions/{SESSION_ID}/{resource}")
        assert r.status_code == 404
        assert r.json() == {"detail": "No active session found"}
    finally:
        state.session = saved

def test_metrics_returns_current_metrics():
    r = client.get(f"/api/sessions/{SESSION_ID}/metrics")
    assert r.status_code == 200
    assert set(r.json().keys()) == {"speed_cm_s", "rpm", "battery_pct"}

def test_events_returns_log():
    r = client.get(f"/api/sessions/{SESSION_ID}/events")
    assert r.status_code == 200
    assert len(r.json()) == len(state.events)