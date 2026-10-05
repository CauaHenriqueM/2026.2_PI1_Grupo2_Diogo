from enum import Enum
from pydantic import BaseModel

class Cell(str, Enum):
    wall = "wall"
    free = "free"
    start = "start"
    goal = "goal"

class Position(BaseModel):
    row: int
    col: int

class Maze(BaseModel):
    size: int               #16
    grid: list[list[Cell]]  #16x16
    start: Position
    goal: Position