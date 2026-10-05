from app.models import CartItem


def calculate_discount(items: list[CartItem]) -> float:
    """Считает процент скидки: 10% при 3+ индульгенциях."""
    count = sum(1 for item in items if item.product_id == 4)
    return 0.1 if count >= 3 else 0.0


def calculate_totals(items: list[CartItem]) -> dict:
    """Считает subtotal, discount, total."""
    subtotal = sum(item.product.price for item in items)
    discount = calculate_discount(items)
    total = round(subtotal * (1 - discount), 2)
    return {
        "subtotal": subtotal,
        "discount": discount,
        "total": total,
    }