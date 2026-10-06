from app.models import Metrics

from app.mock import state
from app.mock.seed import build_seed_path
from app.models import SessionStatus

ROUTE = build_seed_path()


SPEED_CM_S = 18.0
RPM = 101.0
BATTERY_DRAIN = 0.5

def start_run() -> None:
    state.metrics = Metrics(speed_cm_s=0, rpm=0, battery_pct=100)
    state.path = [ROUTE[0]]
    state.session.status = SessionStatus.running
    state.session.elapsed_seconds = 0


def tick() -> None:
    step = len(state.path)
    if step == len(ROUTE):
        return
    state.path.append(ROUTE[step])
    state.session.elapsed_seconds += 1
    state.metrics = Metrics(speed_cm_s=SPEED_CM_S, rpm=RPM, battery_pct=state.metrics.battery_pct - BATTERY_DRAIN)
    if step == len(ROUTE) - 1:
        state.session.status = SessionStatus.finished
        state.metrics = Metrics(speed_cm_s=0, rpm=0, battery_pct=state.metrics.battery_pct)
