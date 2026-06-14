from fastapi import APIRouter, Query, status
from app.api.deps import CurrentUser, DbSession
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer import CustomerService

router = APIRouter(prefix="/customers", tags=["customers"])

@router.get("", response_model=list[CustomerResponse])
def list_customers(
    db: DbSession,
    _: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
) -> list[CustomerResponse]:
    return CustomerService(db).list(skip, limit)

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: DbSession, _: CurrentUser) -> CustomerResponse:
    return CustomerService(db).get(customer_id)

@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: DbSession, _: CurrentUser) -> CustomerResponse:
    return CustomerService(db).create(payload)

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: DbSession, _: CurrentUser) -> None:
    CustomerService(db).delete(customer_id)
