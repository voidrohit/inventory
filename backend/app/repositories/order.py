from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload
from app.models.order import Order

class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> list[Order]:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .order_by(Order.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def get(self, order_id: int) -> Order | None:
        stmt = select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
        return self.db.scalar(stmt)

    def count(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Order)) or 0

    def add(self, order: Order) -> Order:
        self.db.add(order)
        self.db.flush()
        return order

    def delete(self, order: Order) -> None:
        self.db.delete(order)
        self.db.flush()
