from fastapi import FastAPI
from app.routes import sessions

app = FastAPI(
    title="Maze API",
    version="0.1.0",
    description="Backend do Labirinto (mock — sem integração com o robô)",
)

app.include_router(sessions.router, prefix="/api")