from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ProductRepository(db)

    def list(self, skip: int, limit: int) -> list[Product]:
        return self.repository.list(skip, limit)

    def get(self, product_id: int) -> Product:
        product = self.repository.get(product_id)
        if product is None:
            raise NotFoundError("Product not found")
        return product

    def create(self, payload: ProductCreate) -> Product:
        if self.repository.get_by_sku(payload.sku) is not None:
            raise ConflictError("A product with this SKU already exists")
        product = Product(**payload.model_dump())
        self.repository.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get(product_id)
        changes = payload.model_dump(exclude_unset=True)

        new_sku = changes.get("sku")
        if new_sku is not None and new_sku != product.sku:
            if self.repository.get_by_sku(new_sku) is not None:
                raise ConflictError("A product with this SKU already exists")

        for field, value in changes.items():
            setattr(product, field, value)

        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, product_id: int) -> None:
        product = self.get(product_id)
        self.repository.delete(product)
        self.db.commit()
