from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.customer import Customer

class CustomerRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> list[Customer]:
        stmt = select(Customer).order_by(Customer.id).offset(skip).limit(limit)
        return list(self.db.scalars(stmt).all())

    def get(self, customer_id: int) -> Customer | None:
        return self.db.get(Customer, customer_id)

    def get_by_email(self, email: str) -> Customer | None:
        return self.db.scalar(select(Customer).where(Customer.email == email))

    def count(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Customer)) or 0

    def add(self, customer: Customer) -> Customer:
        self.db.add(customer)
        self.db.flush()
        return customer

    def delete(self, customer: Customer) -> None:
        self.db.delete(customer)
        self.db.flush()
