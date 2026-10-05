Path = trajetória percorrida
Maze = Mapa conhecido
Id da sessão = string com padding
formato de elapsed_seconds em segundos inteiros
speed = cm/s faz mais sentido
rpm = rotações por segundo deve fazer mais sentido
battery = porcentagem "1-100%"

Ideia seria paredes embutidas no grid (cada célula é full/free) e as com "full" indicariam a orientação, por exemplo algo como cell_full = célula contém parede cell_free = célula não contém parede; wallplus_y parede no "norte", wallminus_y = "parede no sul", wallplus_x = "parede na direita", wallminus_x = "parede na esquerda"