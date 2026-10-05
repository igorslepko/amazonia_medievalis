import uuid

from fastapi import APIRouter, Cookie, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.discount import calculate_totals
from app.models import Cart, CartItem, Order, OrderItem
from app.models import Product as ProductModel, ProductTranslation
from app.schemas import CartAddRequest, CartResponse

router = APIRouter(prefix="/api/cart", tags=["cart"])


def _get_or_create_session(response: Response, session_id: str | None) -> str:
    """Вернуть session_id из cookie или создать новый."""
    if session_id is None:
        session_id = str(uuid.uuid4())
        response.set_cookie("session_id", session_id, httponly=True)
    return session_id


def get_or_create_cart(db: Session, session_id: str) -> Cart:
    """Вернуть корзину сессии или создать новую."""
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if cart is None:
        cart = Cart(session_id=session_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _serialize_cart(cart: Cart, lang: str) -> list[dict]:
    """Преобразовать CartItem'ы в список словарей для ответа."""
    items = []
    for item in cart.items:
        translation = next(
            (t for t in item.product.translations if t.language == lang),
            item.product.translations[0] if item.product.translations else None,
        )
        if translation is None:
            continue
        items.append({
            "id": item.product.id,
            "emoji": item.product.emoji,
            "category": item.product.category,
            "name": translation.name,
            "desc": translation.description,
            "price": item.product.price,
            "oldPrice": item.product.old_price,
        })
    return items


def _build_response(cart: Cart, lang: str) -> dict:
    """Собрать ответ корзины: items + totals."""
    items = _serialize_cart(cart, lang)

    # Для расчёта скидки нужны CartItem'ы
    totals = calculate_totals(cart.items)

    return {"items": items, **totals}


@router.get("", response_model=CartResponse)
def get_cart_endpoint(
    response: Response,
    lang: str = Query("ru", pattern="^(ru|en|la)$"),
    session_id: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    """Получить корзину текущей сессии."""
    sid = _get_or_create_session(response, session_id)
    cart = get_or_create_cart(db, sid)
    return _build_response(cart, lang)


@router.post("", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart_endpoint(
    payload: CartAddRequest,
    response: Response,
    lang: str = Query("ru", pattern="^(ru|en|la)$"),
    session_id: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    """Добавить товар в корзину."""
    sid = _get_or_create_session(response, session_id)

    # Проверяем, что товар существует
    product = (
        db.query(ProductModel)
        .filter(ProductModel.id == payload.product_id)
        .first()
    )
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {payload.product_id} not found",
        )

    cart = get_or_create_cart(db, sid)
    item = CartItem(cart_id=cart.id, product_id=payload.product_id)
    db.add(item)
    db.commit()
    db.refresh(cart)

    return _build_response(cart, lang)


@router.delete("/{index}", response_model=CartResponse)
def remove_from_cart_endpoint(
    index: int,
    response: Response,
    lang: str = Query("ru", pattern="^(ru|en|la)$"),
    session_id: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    """Удалить товар из корзины по индексу."""
    sid = _get_or_create_session(response, session_id)
    cart = get_or_create_cart(db, sid)

    if index < 0 or index >= len(cart.items):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Index {index} out of range",
        )

    db.delete(cart.items[index])
    db.commit()
    db.refresh(cart)

    return _build_response(cart, lang)


@router.delete("", response_model=CartResponse)
def clear_cart_endpoint(
    response: Response,
    lang: str = Query("ru", pattern="^(ru|en|la)$"),
    session_id: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    """Очистить корзину."""
    sid = _get_or_create_session(response, session_id)
    cart = get_or_create_cart(db, sid)

    for item in cart.items:
        db.delete(item)
    db.commit()
    db.refresh(cart)

    return _build_response(cart, lang)


@router.post("/checkout")
def checkout_endpoint(
    response: Response,
    session_id: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    """Оформить заказ. Сохранить в БД. Очистить корзину."""
    sid = _get_or_create_session(response, session_id)
    cart = get_or_create_cart(db, sid)

    if not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    totals = calculate_totals(cart.items)

    order = Order(
        order_id=str(uuid.uuid4()),
        session_id=sid,
        subtotal=totals["subtotal"],
        discount=totals["discount"],
        total=totals["total"],
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart.items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            price_at_purchase=item.product.price,
        ))
        db.delete(item)
    db.commit()

    return {
        "order_id": order.order_id,
        "total": order.total,
    }