from enum import Enum
from pydantic import BaseModel

class SessionStatus(str, Enum):
    running = "running"
    finished = "finished"
    paused = "paused"
    idle = "idle"
    analizing = "analizing"

class Session(BaseModel):
    id: str                 # ex: 0001
    status: SessionStatus
    algorithm: str          #algo como "flood fill"
    elapsed_seconds: int    #tempo decorrido
