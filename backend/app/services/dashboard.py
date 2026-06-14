from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.repositories.customer import CustomerRepository
from app.repositories.order import OrderRepository
from app.repositories.product import ProductRepository

class DashboardService:
    def __init__(self, db: Session):
        self.products = ProductRepository(db)
        self.customers = CustomerRepository(db)
        self.orders = OrderRepository(db)
        self.settings = get_settings()

    def summary(self) -> dict:
        return {
            "total_products": self.products.count(),
            "total_customers": self.customers.count(),
            "total_orders": self.orders.count(),
            "low_stock_products": self.products.list_low_stock(self.settings.low_stock_threshold),
        }
