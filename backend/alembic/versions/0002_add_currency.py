"""add currency to products and orders

Revision ID: 0002_add_currency
Revises: 0001_initial
Create Date: 2026-06-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002_add_currency"
down_revision: Union[str, None] = "0001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="USD"),
    )
    op.add_column(
        "orders",
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="USD"),
    )

def downgrade() -> None:
    op.drop_column("orders", "currency")
    op.drop_column("products", "currency")
