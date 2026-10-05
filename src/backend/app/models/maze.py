from pydantic import BaseModel, Field

class Cell(BaseModel):
    """
    Convenção de eixos:
      row cresce para baixo (sul), col cresce para a direita (leste).
      wall_plus_y  -> parede ao NORTE  (row - 1)
      wall_minus_y -> parede ao SUL    (row + 1)
      wall_plus_x  -> parede a LESTE   (col + 1)
      wall_minus_x -> parede a OESTE   (col - 1)
    """
    wall_plus_y: bool = False
    wall_minus_y: bool = False
    wall_plus_x: bool = False
    wall_minus_x: bool = False

class Position(BaseModel):
    row: int
    col: int

class Maze(BaseModel):
    size: int               #16
    grid: list[list[Cell]] = Field(..., description="grid[row][col]")  #16x16
    start: Position
    goal: Position