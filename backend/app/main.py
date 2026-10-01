from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import products
from app.schemas import HealthResponse

app = FastAPI(
    title="Amazonia Medievalis API",
    description="API для шуточного средневекового магазина",
    version="0.1.0",
)

# CORS — разрешаем фронту ходить в API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",           # локальный фронт
        "http://127.0.0.1:5500",           # локальный фронт (альтернативный)
        "https://igorslepko.github.io",    # задеплоенный фронт на GitHub Pages
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> dict:
    """Healthcheck для мониторинга."""
    return {"status": "ok"}