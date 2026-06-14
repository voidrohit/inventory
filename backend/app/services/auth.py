from sqlalchemy.orm import Session
from app.core.exceptions import AuthError
from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.auth import LoginRequest

class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def login(self, payload: LoginRequest) -> str:
        user = self.repository.get_by_email(payload.email)
        if user is None or not verify_password(payload.password, user.hashed_password):
            raise AuthError("Invalid email or password")
        return create_access_token(str(user.id))

    def get_user(self, user_id: int) -> User | None:
        return self.repository.get(user_id)
