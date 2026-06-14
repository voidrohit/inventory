from sqlalchemy import CheckConstraint, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.models.timestamp import TimestampMixin

class Product(Base, TimestampMixin):
    __tablename__ = "products"
    __table_args__ = (CheckConstraint("quantity_in_stock >= 0", name="ck_product_qty_non_negative"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    quantity_in_stock: Mapped[int] = mapped_column(nullable=False, default=0)
