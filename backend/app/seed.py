from sqlalchemy.orm import Session

from app.data import PRODUCTS
from app.models import Product, ProductTranslation

def seed_products(db: Session) -> None:
    """Заполнить БД товарами, если она пуста."""
    if db.query(Product).count() > 0:
        return

    for i, p in enumerate(PRODUCTS["ru"]):
        product = Product(
            id = p["id"],
            emoji = p["emoji"],
            category = p.get("category"),
            price = p["price"],
            old_price = p.get("oldPrice")
        )
        db.add(product)

        for lang in ["ru", "en", "la"]:
            translation = ProductTranslation(
                product_id=p["id"],
                language=lang,
                name=PRODUCTS[lang][i]["name"],
                description=PRODUCTS[lang][i]["desc"],
            )
            db.add(translation)
    db.commit()

if __name__ == "__main__":
    from app.core.database import SessionLocal, init_db

    init_db()
    db = SessionLocal()
    try:
        seed_products(db)
        print("Seed completed")
    finally:
        db.close()