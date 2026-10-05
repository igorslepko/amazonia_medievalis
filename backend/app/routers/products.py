from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Product as ProductModel, ProductTranslation
from app.schemas import Product

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[Product])
def get_products(
    lang: str = Query("ru", pattern="^(ru|en|la)$"),
    category: str | None = Query(None),
    search: str | None = Query(None, min_length=1),
    db: Session = Depends(get_db),
) -> list[dict]:
    stmt = (
        db.query(ProductModel, ProductTranslation)
        .join(ProductTranslation, ProductTranslation.product_id == ProductModel.id)
        .filter(ProductTranslation.language == lang)
    )

    if category:
        stmt = stmt.filter(ProductModel.category == category)

    results = stmt.all()

    # Фильтр поиска — в Python (SQLite LOWER() не понимает кириллицу)
    if search:
        pattern = search.lower()
        results = [
            (p, t) for p, t in results
            if pattern in t.name.lower() or pattern in t.description.lower()
        ]

    return [
        {
            "id": p.id,
            "emoji": p.emoji,
            "category": p.category,
            "name": t.name,
            "desc": t.description,
            "price": p.price,
            "oldPrice": p.old_price,
        }
        for p, t in results
    ]