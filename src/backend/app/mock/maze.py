from app.models import Maze, Cell, Position


# Labirinto 4x4.
#   '+'  canto da célula
#   '---' parede horizontal
#   '|'  parede vertical
#   ' '  passagem
#   'S'  start (célula)
#   'G'  goal  (célula)
#   +---+
#   |   |
#   +---+
#   ^^ uma célula completa
# Cada fileira de células é representada por linhas ímpares.
# As linhas pares (com '+' e '---') mostram as paredes horizontais.

_MAZE_ASCII = """\
+---+---+---+---+
| S             |
+   +---+   +   +
|   |       |   |
+   +   +---+   +
|   |   |       |
+   +   +   +---+
|             G |        
+---+---+---+---+
"""


def _parse_ascii_maze(raw: str) -> tuple[list[list[Cell]], Position, Position]:
    lines = raw.splitlines()

    cell_lines = lines[1::2]
    size = len(cell_lines) #any N size works based on the model

    grid: list[list[Cell]] = []
    start = Position(row=0, col=0)
    goal = Position(row=size - 1, col=size - 1)

    for r in range(size):
        # linha de células da fileira r:
        #   raw: linha 1, 3, 5, ...  (índice = 2*r + 1)
        cell_line = lines[2 * r + 1]
        # linha de paredes acima (índice = 2*r)
        top_line = lines[2 * r]
        # linha de paredes abaixo (índice = 2*r + 2)
        bottom_line = lines[2 * r + 2]

        row_cells: list[Cell] = []
        for c in range(size):
            # cada célula ocupa 4 chars: " X  " ou "| X "
            # offset do conteúdo da célula c na string
            content_idx = 4 * c + 2

            # parede oeste: char em 4*c
            wall_minus_x = cell_line[4 * c] == "|"
            # parede leste: char em 4*c + 4
            wall_plus_x = cell_line[4 * c + 4] == "|"

            # parede norte: char central da célula na linha de cima
            wall_plus_y = top_line[content_idx] == "-"
            # parede sul: char central da célula na linha de baixo
            wall_minus_y = bottom_line[content_idx] == "-"

            # start / goal
            char = cell_line[content_idx]
            if char == "S":
                start = Position(row=r, col=c)
            elif char == "G":
                goal = Position(row=r, col=c)

            row_cells.append(Cell(
                wall_plus_y=wall_plus_y,
                wall_minus_y=wall_minus_y,
                wall_plus_x=wall_plus_x,
                wall_minus_x=wall_minus_x,
            ))
        grid.append(row_cells)

    return grid, start, goal


def build_seed_maze() -> Maze:
    grid, start, goal = _parse_ascii_maze(_MAZE_ASCII)
    size = len(grid) #toma do grid o tamanho certo,n depende de colocar o valor aqui
    return Maze(size=size, grid=grid, start=start, goal=goal)