from fastapi import APIRouter, Query, status
from app.api.deps import CurrentUser, DbSession
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("", response_model=list[OrderResponse])
def list_orders(
    db: DbSession,
    _: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
) -> list[OrderResponse]:
    return OrderService(db).list(skip, limit)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: DbSession, _: CurrentUser) -> OrderResponse:
    return OrderService(db).get(order_id)

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: DbSession, _: CurrentUser) -> OrderResponse:
    return OrderService(db).create(payload)

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: DbSession, _: CurrentUser) -> None:
    OrderService(db).delete(order_id)
