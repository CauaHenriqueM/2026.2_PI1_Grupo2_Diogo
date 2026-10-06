from app.mock import state
from app.mock.seed import build_seed_path
from app.models import SessionStatus

ROUTE = build_seed_path()


def start_run() -> None:
    state.path = [ROUTE[0]]
    state.session.status = SessionStatus.running
    state.session.elapsed_seconds = 0


def tick() -> None:
    step = len(state.path)
    if step == len(ROUTE):
        return
    state.path.append(ROUTE[step])
    state.session.elapsed_seconds += 1
    if step == len(ROUTE) - 1:
        state.session.status = SessionStatus.finished
