from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user import UserRepository


def seed_admin(db: Session) -> None:
    settings = get_settings()
    repository = UserRepository(db)

    if repository.get_by_email(settings.admin_email) is not None:
        return

    repository.add(
        User(
            email=settings.admin_email,
            hashed_password=hash_password(settings.admin_password),
        )
    )
    db.commit()
