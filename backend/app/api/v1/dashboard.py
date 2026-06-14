from fastapi import APIRouter
from app.api.deps import CurrentUser, DbSession
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: DbSession, _: CurrentUser) -> DashboardSummary:
    return DashboardService(db).summary()
