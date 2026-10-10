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

class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=3)

class UserLogin(BaseModel):
    user_login: str
    user_password: str

class UserResponse(BaseModel):
    id: int
    username: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse