"""
Тесты для GET /api/products.

Проверяют:
- базовый список товаров
- фильтрацию по языку
- фильтрацию по категории
- поиск
- валидацию параметров
"""


def test_get_products_default_returns_five(client):
    """По умолчанию возвращаются 5 товаров на русском."""
    response = client.get("/api/products")
    assert response.status_code == 200

    products = response.json()
    assert len(products) == 5
    assert products[0]["name"] == "Свитки для уединения"


def test_get_products_lang_en_returns_english(client):
    """С lang=en названия на английском."""
    response = client.get("/api/products?lang=en")
    assert response.status_code == 200

    products = response.json()
    assert len(products) == 5
    assert products[0]["name"] == "Scrolls for Solitude"


def test_get_products_lang_la_returns_latin(client):
    """С lang=la названия на латыни."""
    response = client.get("/api/products?lang=la")
    assert response.status_code == 200

    products = response.json()
    assert products[0]["name"] == "VOLUMINA SOLITUDINI"


def test_get_products_invalid_lang_returns_422(client):
    """Невалидный lang → 422 (валидация Pydantic)."""
    response = client.get("/api/products?lang=xx")
    assert response.status_code == 422


def test_get_products_filter_by_category_books(client):
    """Категория books возвращает только книги/свитки."""
    response = client.get("/api/products?category=books")
    assert response.status_code == 200

    products = response.json()
    assert len(products) == 2
    assert all(p["category"] == "books" for p in products)


def test_get_products_filter_by_category_clothing(client):
    """Категория clothing возвращает только одежду."""
    response = client.get("/api/products?category=clothing")
    assert response.status_code == 200

    products = response.json()
    assert len(products) == 2
    assert all(p["category"] == "clothing" for p in products)


def test_get_products_search_by_name(client):
    """Поиск по имени находит индульгенцию."""
    response = client.get("/api/products?search=индульгенция")
    assert response.status_code == 200

    products = response.json()
    assert len(products) == 1
    assert products[0]["id"] == 4


def test_get_products_search_case_insensitive(client):
    """Поиск не зависит от регистра."""
    response_lower = client.get("/api/products?search=свитки")
    response_upper = client.get("/api/products?search=СВИТКИ")

    assert response_lower.status_code == 200
    assert response_upper.status_code == 200
    assert len(response_lower.json()) == len(response_upper.json()) == 1


def test_get_products_search_not_found_returns_empty(client):
    """Поиск без совпадений возвращает пустой список."""
    response = client.get("/api/products?search=дракон")
    assert response.status_code == 200
    assert response.json() == []


def test_get_products_invalid_category_returns_empty(client):
    """Несуществующая категория возвращает пустой список."""
    response = client.get("/api/products?category=weapons")
    assert response.status_code == 200
    assert response.json() == []


def test_health_endpoint(client):
    """Healthcheck возвращает ok."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}