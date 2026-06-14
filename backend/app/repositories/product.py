from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.product import Product

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> list[Product]:
        stmt = select(Product).order_by(Product.id).offset(skip).limit(limit)
        return list(self.db.scalars(stmt).all())

    def get(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)

    def get_by_sku(self, sku: str) -> Product | None:
        return self.db.scalar(select(Product).where(Product.sku == sku))

    def count(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Product)) or 0

    def list_low_stock(self, threshold: int) -> list[Product]:
        stmt = (
            select(Product)
            .where(Product.quantity_in_stock <= threshold)
            .order_by(Product.quantity_in_stock)
        )
        return list(self.db.scalars(stmt).all())

    def add(self, product: Product) -> Product:
        self.db.add(product)
        self.db.flush()
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.flush()
