from __future__ import annotations
from sqlalchemy.orm import Session
from app.core.exceptions import ConflictError, NotFoundError
from app.models.customer import Customer
from app.repositories.customer import CustomerRepository
from app.schemas.customer import CustomerCreate

class CustomerService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = CustomerRepository(db)

    def list(self, skip: int, limit: int) -> list[Customer]:
        return self.repository.list(skip, limit)

    def get(self, customer_id: int) -> Customer:
        customer = self.repository.get(customer_id)
        if customer is None:
            raise NotFoundError("Customer not found")
        return customer

    def create(self, payload: CustomerCreate) -> Customer:
        if self.repository.get_by_email(payload.email) is not None:
            raise ConflictError("A customer with this email already exists")
        customer = Customer(**payload.model_dump())
        self.repository.add(customer)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def delete(self, customer_id: int) -> None:
        customer = self.get(customer_id)
        self.repository.delete(customer)
        self.db.commit()
