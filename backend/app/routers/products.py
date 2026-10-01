from fastapi import APIRouter, Query

from app.data import PRODUCTS
from app.schemas import Product

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[Product])
def get_products(
    lang: str = Query("ru", pattern="^(ru|en|la)$", description="Language: ru, en, la"),
    category: str | None = Query(None, description="Filter by category"),
    search: str | None = Query(None, min_length=1, description="Search in name and description"),
) -> list[dict]:
    """
    Get list of products with optional filters.

    - **lang**: ru / en / la
    - **category**: books / clothing / null
    - **search**: поиск по имени и описанию (case-insensitive)
    """
    products = PRODUCTS.get(lang, PRODUCTS["ru"])

    if category:
        products = [p for p in products if p.get("category") == category]

    if search:
        q = search.lower()
        products = [
            p for p in products
            if q in p["name"].lower() or q in p["desc"].lower()
        ]

    return products