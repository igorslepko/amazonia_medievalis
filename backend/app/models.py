from datetime import datetime, timezone
from sqlalchemy import Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    emoji: Mapped[str] = mapped_column(String(10))
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    price: Mapped[int] = mapped_column(Integer)
    old_price: Mapped[int | None] = mapped_column(Integer, nullable=True)

    translations: Mapped[list["ProductTranslation"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
    )

class ProductTranslation(Base):
    __tablename__ = "product_translations"
    __table_args__ = (
        UniqueConstraint("product_id", "language", name="uq_product_language"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    language: Mapped[str] = mapped_column(String(2))
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(String(1000))
    product: Mapped["Product"] = relationship(back_populates="translations")

class Cart(Base):
    __tablename__ = "carts"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(36), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
    default=lambda: datetime.now(timezone.utc)
)

    items: Mapped[list["CartItem"]] = relationship(
        back_populates="cart",
        cascade="all, delete-orphan",
    )

class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey("carts.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    added_at: Mapped[datetime] = mapped_column(
    default=lambda: datetime.now(timezone.utc)
)
    default=lambda: datetime.now(timezone.utc)

    cart: Mapped["Cart"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(36), index=True)
    created_at: Mapped[datetime] = mapped_column(
    default=lambda: datetime.now(timezone.utc)
)
    order_id: Mapped[str] = mapped_column(String(36), unique=True, index=True)
    subtotal: Mapped[int] = mapped_column()
    discount: Mapped[float] = mapped_column()
    total: Mapped[float] = mapped_column()
    
    items: Mapped[list["OrderItem"]] = relationship(
            back_populates="order",
            cascade="all, delete-orphan",
        )
    
class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    price_at_purchase: Mapped[int] = mapped_column()

    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
