import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Base


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./amazonia.db",   # fallback для локалки
)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    """FastAPI dependency: сессия БД на время запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Создать все таблицы. Вызывается при старте приложения."""
    Base.metadata.create_all(bind=engine)