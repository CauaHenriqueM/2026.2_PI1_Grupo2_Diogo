from datetime import datetime, timedelta, timezone

from app.models import (
    Session, SessionStatus,
    PathPoint, Metrics,
    Event, EventType,
)

SESSION_ID = "0847"


def build_seed_session() -> Session:
    path = build_seed_path()
    return Session(
        id=SESSION_ID,
        status=SessionStatus.finished,
        algorithm="Flood Fill",
        elapsed_seconds=42,
    )


def build_seed_metrics() -> Metrics:
    return Metrics(speed_cm_s=12.5, rpm=310.0, battery_pct=87.0)


def build_seed_path() -> list[PathPoint]:
    """
    Caminho inicial do robô a partir do start (0,0).
    Cada passo é vizinho ortogonal do anterior.
    Ainda NÃO chegou ao goal (a sessão está em execução).
    """
    return [
        PathPoint(row=0, col=0),
        PathPoint(row=1, col=0),
        PathPoint(row=2, col=0),
        PathPoint(row=3, col=0),
        PathPoint(row=4, col=0),
        PathPoint(row=5, col=0),
        PathPoint(row=6, col=0),
        PathPoint(row=7, col=0),   
        PathPoint(row=8, col=0),
        PathPoint(row=9, col=0),
        PathPoint(row=10, col=0),
        PathPoint(row=11, col=0),
        PathPoint(row=12, col=0),
        PathPoint(row=13, col=0),
        PathPoint(row=14, col=0),
        PathPoint(row=15, col=0),
        PathPoint(row=15, col=1),
        PathPoint(row=15, col=2),
        PathPoint(row=15, col=3),
        PathPoint(row=15, col=4),
        PathPoint(row=15, col=5),
        PathPoint(row=15, col=6),
        PathPoint(row=15, col=7),
        PathPoint(row=15, col=8),
        PathPoint(row=15, col=9),
        PathPoint(row=15, col=10),
        PathPoint(row=15, col=11),
        PathPoint(row=15, col=12),
        PathPoint(row=15, col=13),
        PathPoint(row=15, col=14),
        PathPoint(row=15, col=15),
    ]


def build_seed_events() -> list[Event]:
    now = datetime.now(timezone.utc)
    return [
        Event(
            timestamp=now - timedelta(seconds=42),
            type=EventType.info,
            message="Sessão iniciada",
        ),
        Event(
            timestamp=now - timedelta(seconds=41),
            type=EventType.info,
            message="Flood Fill inicializado: distâncias calculadas",
        ),
        Event(
            timestamp=now - timedelta(seconds=30),
            type=EventType.decision,
            message="Decisão: seguir para leste (distância menor)",
        ),
        Event(
            timestamp=now - timedelta(seconds=15),
            type=EventType.info,
            message="Robô em movimento",
        ),
        Event(
            timestamp=now - timedelta(seconds=5),
            type=EventType.warning,
            message="Bateria abaixo de 90%",
        ),
    ]