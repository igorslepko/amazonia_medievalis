from pydantic import BaseModel, Field


class Product(BaseModel):
    id: int
    emoji: str
    category: str | None = None
    name: str
    desc: str
    price: int = Field(gt=0, description="Price in base currency (rubles)")
    oldPrice: int | None = None


class HealthResponse(BaseModel):
    status: str


class CartAddRequest(BaseModel):
    product_id: int


class CartResponse(BaseModel):
    items: list[Product]
    subtotal: float
    discount: float
    total: float