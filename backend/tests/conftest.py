import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """TestClient для вызова API без запуска сервера."""
    return TestClient(app)