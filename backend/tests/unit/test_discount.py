import pytest
from app.core.discount import calculate_totals, calculate_discount


@pytest.mark.parametrize(
        "items, expected_discount",
        [
            ([], 0.0),
            ([{"id": 4, "price": 100.0}], 0.0),
            ([{"id": 4, "price": 100.0}] * 2, 0.0),
            ([{"id": 4, "price": 100.0}] * 3, 0.1),
            ([{"id": 4, "price": 100.0}] * 4, 0.1),
        ]
)
def test_calculate_discount(items, expected_discount):
    discount = calculate_discount(items)
    assert discount == expected_discount

def test_calculate_empty_cart_returns_zero():
    items = []
    total = calculate_totals(items)
    assert total == {
        "subtotal": 0.0,
        "discount": 0.0,
        "total": 0.0,
    }

def test_calculate_totals_no_discount_items_returns_no_discount():
    items = [
        {"id":1, "name":"Product with no discount", "price":100.0},
        {"id":2, "name":"Product 2 with no discount", "price":200.0}
    ]
    total = calculate_totals(items)
    assert total == {
        "subtotal": 300.0,
        "discount": 0.0,
        "total": 300.0,
    }

def test_calculate_totals_with_discount_adding_3_products_with_id_4_to_any_other_product_to_cart_returns_10_percent_discount():
    items = [
        {"id":4, "name":"Product with Discount", "price":100.0},
        {"id":4, "name":"Product with Discount", "price":100.0},
        {"id":4, "name":"Product with Discount", "price":100.0},
        {"id":1, "name":"Product with no discount", "price":100.0},
    ]
    total = calculate_totals(items)
    assert total == {
        "subtotal": 400.0,
        "discount": 0.1,
        "total": 360.0,
    }

def test_calculate_totals_for_2_special_items_returns_no_discount():
    items = [
        {"id":4, "name":"Product with Discount", "price":100.0},
        {"id":4, "name":"Product with Discount", "price":100.0}
    ]
    total = calculate_totals(items)
    assert total == {
        "subtotal": 200.0,
        "discount": 0.0,
        "total": 200.0,
    }
