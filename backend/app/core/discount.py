def calculate_discount(items: list[dict]) -> float:
    """
    Calculate the discounted total based on the original total and discount rate.

    Args:
        total (float): The original total amount.
        discount_rate (float): The discount rate as a percentage (e.g., 10 for 10%).

    Returns:
        float: The total amount after applying the discount.
    """
    count = 0
    for item in items:
        if item["id"] == 4:
            count += 1
    if count >= 3:
        return 0.1
    return 0.0   # No discount

def calculate_totals(items: list[dict]) -> dict:
    """Считает subtotal, discount, total."""
    subtotal = sum(item["price"] for item in items)
    discount = calculate_discount(items)
    total = round(subtotal * (1 - discount), 2)
    return {
        "subtotal": subtotal,
        "discount": discount,
        "total": total,
    }
