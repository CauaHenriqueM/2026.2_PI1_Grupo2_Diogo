# API da tela Labirinto

API REST em [FastAPI](https://fastapi.tiangolo.com/) que entrega os dados da tela **Labirinto** do frontend: a sessão (corrida) ativa, o labirinto, a trajetória do robô, as métricas e o log de eventos.

Por enquanto os dados são **simulados (mock)** e ficam na memória do servidor. Ainda não há integração com o robô nem com o banco de dados. O formato das respostas já é o definitivo, para o frontend não precisar mudar quando os dados reais chegarem (issue #111).

## Como funciona

```
navegador ──► frontend (:5173) ──proxy /api──► backend (:8000)
                                                │
                                   app/routes/sessions.py   as rotas
                                                │ leem
                                   app/mock (state)         dados em memória,
                                                            montados quando o servidor liga
```

1. Ao ligar, o backend monta uma sessão de exemplo (`0847`, algoritmo Flood Fill) num labirinto 4×4 fixo. É o *seed*.
2. Cada rota lê esse estado e devolve JSON. Os modelos de `app/models` garantem o formato.
3. O frontend pergunta a cada 1 s (*polling*) e redesenha a tela.

## Estrutura

Os caminhos são a partir de `src/backend`.

| Caminho | O que tem |
|---|---|
| `app/main.py` | Cria o app FastAPI e registra as rotas com o prefixo `/api`. |
| `app/routes/sessions.py` | As rotas da tela Labirinto e a checagem de sessão (404). |
| `app/models/` | O formato dos dados (Pydantic): sessão, labirinto, trajetória, métricas e eventos. |
| `app/mock/` | Os dados simulados (seed e labirinto) e a simulação do robô. Ver [o README do mock](../mock/README.md). |
| `tests/` | Testes automáticos (pytest). |

## Rotas

Todas começam com `/api`. Com o servidor rodando, a documentação interativa fica em http://127.0.0.1:8000/docs, e dá para testar cada rota pelo botão *Try it out*.

| Rota | Devolve | Se a sessão não existir |
|---|---|---|
| `GET /api/sessions/active` | A sessão ativa (`id`, `status`, `algorithm`, `elapsed_seconds`), ou `null` se não houver. | — |
| `GET /api/sessions/{id}/maze` | O labirinto: `size`, `grid[row][col]` com as paredes de cada célula, `start` e `goal`. | 404 |
| `GET /api/sessions/{id}/path` | A trajetória: lista de `{row, col}`, do início até a posição atual. | 404 |
| `GET /api/sessions/{id}/metrics` | As métricas atuais: `speed_cm_s`, `rpm` e `battery_pct`. | 404 |
| `GET /api/sessions/{id}/events` | O log de eventos: `timestamp`, `type` e `message`. | 404 |

- **Como o front usa:** primeiro ele pergunta o `/active` para descobrir o `id` da sessão, e depois usa esse id nas outras rotas. Nenhum id fica fixo no front.
- **Por que o `/active` devolve `null` e não 404:** não ter sessão não é erro, é só o robô desligado (o front mostra "Sem conexão"). Já pedir uma sessão que não existe é erro de quem pediu, por isso as rotas com `{id}` respondem `404 {"detail": "No active session found"}`.

## Como rodar

Os comandos são para o PowerShell (Windows), dentro de `src/backend`. No Linux ou no Mac, troque `.venv\Scripts\python` por `.venv/bin/python`.

### Preparar o ambiente (só na primeira vez)

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install fastapi uvicorn pytest httpx
```

A `.venv` é uma pasta com um Python só deste projeto. Ela está no `.gitignore` e não vai para o repositório. Ainda não há `requirements.txt`; os pacotes acima são os necessários.

### Operação normal: dados do mock, parados

```powershell
.venv\Scripts\python -m uvicorn app.main:app --reload --host 0.0.0.0
```

- `--reload` reinicia o servidor sozinho quando você salva um arquivo.
- `--host 0.0.0.0` faz o backend aceitar conexões de fora do próprio PC. É obrigatório quando o frontend roda no Docker, porque para o container o seu PC é "outro computador".

A tela mostra a sessão 0847 já concluída: status *Concluído*, 00:42, 31 células, posição (15, 15), 12,5 cm/s, 310 rpm e bateria 87%.

### Com a simulação: robô andando

```powershell
.venv\Scripts\python -m uvicorn app.mock.dev_server:app --reload --host 0.0.0.0
```

O robô começa a andar quando o servidor liga: uma célula por segundo, até chegar na meta em 30 s. Para ver de novo, reinicie o servidor. Com o `--reload`, salvar qualquer arquivo também reinicia. Como funciona: [o README do mock](../mock/README.md).

### Junto com o frontend

1. Suba o backend com um dos comandos acima.
2. Suba o frontend com `docker compose up -d` em `src/frontend/web-micromouse` (detalhes no README de lá).
3. Abra http://localhost:5173/labirinto.

## Testes

```powershell
.venv\Scripts\python -m pytest -v
```

Use `python -m pytest`, e não só `pytest`. O `-m` coloca a pasta atual no caminho de import, e é isso que faz o `from app...` dos testes funcionar.

| Arquivo | O que testa |
|---|---|
| `tests/test_seed.py` | O labirinto e a trajetória do seed: tamanho, bordas fechadas, paredes simétricas e um caminho que não atravessa parede. |
| `tests/test_routes.py` | `GET /api/sessions/active`, com e sem sessão. |
| `tests/test_session_data.py` | `/maze`, `/path`, `/metrics` e `/events`, e o 404 de todas elas, tanto para id desconhecido quanto para quando não há sessão. |

- Os testes de 404 usam `@pytest.mark.parametrize`: o mesmo teste roda uma vez para cada rota da lista. Se surgir uma rota nova com `{id}`, é só incluir o nome dela na lista.
- Os testes não carregam a simulação. Por isso os dados não mudam com o tempo e o resultado é sempre o mesmo.

## Decisões e por quês

- **Uma função só para o 404** (`check_active_session`, em `sessions.py`): a mesma regra vale para todas as rotas com `{id}`, então mudar a regra ou a mensagem é em um lugar só. O `/maze`, feito depois, reaproveitou a função.
- **404 documentado no `/docs`** (o `responses=` em cada rota): quem for usar a API vê que o 404 existe sem precisar ler o código.
- **O id é texto** (`"0847"`): como número ele viraria `847`, perdendo o zero, e não bateria com o da sessão.
- **Os testes comparam com o próprio estado** (`len(state.path)`, `SESSION_ID`) em vez de números fixos: se o seed mudar, os testes continuam valendo.
- **A simulação fica isolada em `app/mock`:** só o `dev_server` carrega ela. O servidor de produção (`app.main`) nem sabe que ela existe.

## Quem fez o quê (issue #111)

- **João (@Karmantinedev):** os modelos de dados, o seed e o labirinto 16×16, o `GET /active` e o `GET /maze`.
- **Cauã (@CauaHenriqueM):**
  - o `GET /path`, o `/metrics` e o `/events`;
  - o 404 (`check_active_session` e a documentação no `/docs`);
  - os testes de `tests/test_session_data.py`;
  - a simulação (`app/mock/simulation.py` e `app/mock/dev_server.py`);
  - a integração com o frontend.

## Pendências conhecidas

- **Tamanho do labirinto:** o mock é 16×16, como pediu a issue, mas a documentação do projeto usa labirintos de 4×4, 8×4 e 12×4. Além disso, o modelo `Maze` guarda um número só (`size`), o que não serve para labirintos retangulares. Em andamento com o João.
- **Status:** a documentação define *em execução*, *concluído* e *interrompido*. O enum `SessionStatus` ainda não tem o `interrupted`, e tem `paused`, `idle` e `analizing`, que não são usados.
- **Nomes das paredes:** `wall_plus_y`, `wall_minus_y`, `wall_plus_x` e `wall_minus_x` são, nessa ordem, as paredes norte, sul, leste e oeste (ver `app/models/maze.py`). A proposta é renomear para `wall_north`, `wall_south`, `wall_east` e `wall_west`, como na documentação.
- **Banco de dados (PostgreSQL):** é a próxima etapa. Hoje os dados somem quando o servidor reinicia.
- **`requirements.txt`:** ainda não existe.
