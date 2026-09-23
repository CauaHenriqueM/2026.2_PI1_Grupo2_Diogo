# Frontend (Vite) — Ambiente Docker

Documentação de como rodar a aplicação frontend em ambiente de desenvolvimento usando Docker e Docker Compose.

## Requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) (já incluso no Docker Desktop)

## Estrutura de arquivos

```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
└── ... (código-fonte da aplicação)
```

## Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

> ⚠️ **Importante:** o `--host 0.0.0.0` é obrigatório. Sem ele, o Vite escuta apenas em `localhost` dentro do container, e o navegador (fora do container) não consegue se conectar — resultando em `ERR_CONNECTION_REFUSED`.
>
> Alternativa: em vez de passar `--host` no `CMD`, você pode ajustar o script `dev` no `package.json`:
> ```json
> "scripts": {
>   "dev": "vite --host 0.0.0.0"
> }
> ```

## docker-compose.yml

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5173"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

### O que cada parte faz

| Configuração | Função |
|---|---|
| `ports` | Mapeia a porta do container para o host (`host:container`) |
| `volumes: .:/app` | Sincroniza o código local com o container, habilitando hot-reload |
| `volumes: /app/node_modules` | Evita que o `node_modules` do host sobrescreva o instalado no container |
| `CHOKIDAR_USEPOLLING` | Força o watcher de arquivos a checar por polling (necessário em alguns sistemas, como Windows/WSL2) |
| `healthcheck` | Verifica periodicamente se a aplicação está respondendo (não só se o container está de pé) |

## Como rodar

### Subir o ambiente

```bash
docker compose up --build
```

Depois é só acessar: **http://localhost:5173**

### Rodar em segundo plano

```bash
docker compose up -d --build
```

### Ver status (incluindo healthcheck)

```bash
docker ps
```

Na coluna `STATUS`, você verá algo como:
- `Up 30 seconds (healthy)` → aplicação respondendo normalmente
- `Up 30 seconds (unhealthy)` → aplicação subiu, mas não está respondendo nas checagens

### Ver logs

```bash
docker compose logs -f frontend
```

### Parar o ambiente

```bash
docker compose down
```

## Solução de problemas

### `ERR_CONNECTION_REFUSED` ao acessar `localhost:5173`

- Confirme que o `--host 0.0.0.0` está aplicado (no `CMD` do Dockerfile ou no script `dev` do `package.json`).
- Confira os logs (`docker compose logs -f frontend`) — o Vite deve mostrar uma linha `Network: http://0.0.0.0:5173/` ou similar.
- Verifique se a porta mapeada no `docker-compose.yml` bate com a porta que o Vite está de fato usando.

### Healthcheck falhando (`unhealthy`)

- Confirme que o `wget` está disponível na imagem (Alpine costuma trazer por padrão). Caso não esteja, instale `curl` no Dockerfile:
  ```dockerfile
  RUN apk add --no-cache curl
  ```
  e ajuste o `test` do healthcheck para usar `curl -f` no lugar de `wget`.
- Aumente o `start_period` se a aplicação demorar mais que 10s para subir.

### Mudanças no código não aparecem (sem hot-reload)

- Confirme que o volume `.:/app` está mapeado corretamente no `docker-compose.yml`.
- Em Windows/WSL2, ative `CHOKIDAR_USEPOLLING=true` (já incluso neste setup).