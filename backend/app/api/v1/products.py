from fastapi import APIRouter, Query, status
from app.api.deps import CurrentUser, DbSession
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product import ProductService

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=list[ProductResponse])
def list_products(
    db: DbSession,
    _: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
) -> list[ProductResponse]:
    return ProductService(db).list(skip, limit)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: DbSession, _: CurrentUser) -> ProductResponse:
    return ProductService(db).get(product_id)

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: DbSession, _: CurrentUser) -> ProductResponse:
    return ProductService(db).create(payload)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int, payload: ProductUpdate, db: DbSession, _: CurrentUser
) -> ProductResponse:
    return ProductService(db).update(product_id, payload)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: DbSession, _: CurrentUser) -> None:
    ProductService(db).delete(product_id)
