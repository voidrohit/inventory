from __future__ import annotations

from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.order import Order, OrderItem, OrderStatus
from app.repositories.customer import CustomerRepository
from app.repositories.order import OrderRepository
from app.repositories.product import ProductRepository
from app.schemas.order import OrderCreate

class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.orders = OrderRepository(db)
        self.products = ProductRepository(db)
        self.customers = CustomerRepository(db)

    def list(self, skip: int, limit: int) -> list[Order]:
        return self.orders.list(skip, limit)

    def get(self, order_id: int) -> Order:
        order = self.orders.get(order_id)
        if order is None:
            raise NotFoundError("Order not found")
        return order

    def create(self, payload: OrderCreate) -> Order:
        if self.customers.get(payload.customer_id) is None:
            raise NotFoundError("Customer not found")

        self._reject_duplicate_products(payload)

        order = Order(customer_id=payload.customer_id, status=OrderStatus.COMPLETED)
        total = Decimal("0")
        currencies: set[str] = set()

        for line in payload.items:
            product = self.products.get(line.product_id)
            if product is None:
                raise NotFoundError(f"Product {line.product_id} not found")
            if product.quantity_in_stock < line.quantity:
                raise ValidationError(
                    f"Insufficient stock for product '{product.name}'"
                )

            currencies.add(product.currency)
            if len(currencies) > 1:
                raise ValidationError("All products in an order must use the same currency")

            product.quantity_in_stock -= line.quantity
            total += Decimal(product.price) * line.quantity
            order.items.append(
                OrderItem(
                    product_id=product.id,
                    quantity=line.quantity,
                    unit_price=product.price,
                )
            )

        order.currency = currencies.pop()
        order.total_amount = total
        self.orders.add(order)
        self.db.commit()
        return self.get(order.id)

    def delete(self, order_id: int) -> None:
        order = self.get(order_id)

        if order.status != OrderStatus.CANCELLED:
            for item in order.items:
                product = self.products.get(item.product_id)
                if product is not None:
                    product.quantity_in_stock += item.quantity

        self.orders.delete(order)
        self.db.commit()

    def _reject_duplicate_products(self, payload: OrderCreate) -> None:
        product_ids = [line.product_id for line in payload.items]
        if len(product_ids) != len(set(product_ids)):
            raise ValidationError("Each product may appear only once per order")
