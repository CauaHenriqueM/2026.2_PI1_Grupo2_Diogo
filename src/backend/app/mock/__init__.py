from app.models import Session, Maze, PathPoint, Metrics, Event
from app.mock.maze import build_seed_maze
from app.mock.seed import (
    build_seed_session,
    build_seed_metrics,
    build_seed_path,
    build_seed_events,
)


class AppState:
    """Estado em memória do mock. Um singleton por processo."""

    def __init__(self) -> None:
        self.session: Session | None = build_seed_session()
        self.maze: Maze = build_seed_maze()
        self.path: list[PathPoint] = build_seed_path()
        self.metrics: Metrics = build_seed_metrics()
        self.events: list[Event] = build_seed_events()

    def reset(self) -> None:
        """Recria tudo — útil em testes."""
        self.__init__()


state = AppState()