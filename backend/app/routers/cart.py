import uuid

from fastapi import APIRouter, Cookie, HTTPException, Response, status

from app.core.cart_store import (
    add_to_cart,
    clear_cart,
    get_cart,
    remove_from_cart,
)
from app.core.discount import calculate_totals
from app.data import PRODUCTS
from app.schemas import CartAddRequest, CartResponse

router = APIRouter(prefix="/api/cart", tags=["cart"])

def _get_or_create_session(response: Response, session_id: str | None) -> str:
    """
    Вернуть session_id из cookie.
    Если cookie нет — сгенерировать новый и поставить cookie.
    """
    if session_id is None:
        session_id = str(uuid.uuid4())
        response.set_cookie("session_id", session_id, httponly=True)
    return session_id

@router.get("", response_model=CartResponse)
def get_cart_endpoint(
    response: Response,
    session_id: str | None = Cookie(None),
):
    """Получить корзину текущей сессии."""
    sid = _get_or_create_session(response, session_id)
    items = get_cart(sid)
    totals = calculate_totals(items)
    return {"items": items, **totals}

@router.post("", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart_endpoint(
    payload: CartAddRequest,
    response: Response,
    session_id: str | None = Cookie(None),
):
    """Добавить товар в корзину."""
    sid = _get_or_create_session(response, session_id)

    # Ищем товар в PRODUCTS (на русском — там все товары)
    product = next(
        (p for p in PRODUCTS["ru"] if p["id"] == payload.product_id),
        None,
    )
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {payload.product_id} not found",
        )

    items = add_to_cart(sid, product)
    totals = calculate_totals(items)
    return {"items": items, **totals}

@router.delete("/{index}", response_model=CartResponse)
def remove_from_cart_endpoint(
    index: int,
    response: Response,
    session_id: str | None = Cookie(None),
):
    """Удалить товар из корзины по индексу."""
    sid = _get_or_create_session(response, session_id)
    items = get_cart(sid)

    if index < 0 or index >= len(items):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Index {index} out of range",
        )

    items = remove_from_cart(sid, index)
    totals = calculate_totals(items)
    return {"items": items, **totals}

@router.delete("", response_model=CartResponse)
def clear_cart_endpoint(
    response: Response,
    session_id: str | None = Cookie(None),
):
    """Очистить корзину."""
    sid = _get_or_create_session(response, session_id)
    clear_cart(sid)
    items = get_cart(sid)
    totals = calculate_totals(items)
    return {"items": items, **totals}

@router.post("/checkout")
def checkout_endpoint(
    response: Response,
    session_id: str | None = Cookie(None),
):
    """Оформить заказ. Очистить корзину. Вернуть order_id и total."""
    sid = _get_or_create_session(response, session_id)
    items = get_cart(sid)

    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    totals = calculate_totals(items)
    order_id = str(uuid.uuid4())

    # TODO: здесь будет сохранение заказа в БД
    clear_cart(sid)

    return {
        "order_id": order_id,
        "total": totals["total"],
    }