import pytest
from app.core.discount import calculate_totals, calculate_discount
'''

FakeCartItem — имитация CartItem:

Конструктор принимает product_id: int и price: int

Сохраняет product_id в self.product_id

Создаёт FakeProduct(price) и сохраняет в self.product
'''

class FakeProduct:
    def __init__(self, price: int):
        self.price = price
class FakeCartItem:
    def __init__(self,product_id:int, price:int):
        self.product_id = product_id
        self.product = FakeProduct(price)
        
@pytest.mark.parametrize(
        "items, expected_discount",
        [
            ([], 0.0),
            ([FakeCartItem(4,100)], 0.0),
            ([FakeCartItem(4,100)]*2, 0.0),
            ([FakeCartItem(4,100)]*3, 0.1),
            ([FakeCartItem(4,100)]*4, 0.1),
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
        FakeCartItem(1,100),
        FakeCartItem(2,200)
    ]
    total = calculate_totals(items)
    assert total == {
        "subtotal": 300.0,
        "discount": 0.0,
        "total": 300.0,
    }

def test_calculate_totals_with_discount_adding_3_products_with_id_4_to_any_other_product_to_cart_returns_10_percent_discount():
    items = [
        FakeCartItem(4,100),
        FakeCartItem(4,100),
        FakeCartItem(4,100),
        FakeCartItem(1,100),
    ]
    total = calculate_totals(items)
    assert total == {
        "subtotal": 400.0,
        "discount": 0.1,
        "total": 360.0,
    }

def test_calculate_totals_for_2_special_items_returns_no_discount():
    items = [
        FakeCartItem(4,100),
        FakeCartItem(4,100),
    ]
    total = calculate_totals(items)
    assert total == {
        "subtotal": 200.0,
        "discount": 0.0,
        "total": 200.0,
    }
