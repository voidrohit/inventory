from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import AuthError
from app.core.security import decode_access_token
from app.models.user import User
from app.services.auth import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
DbSession = Annotated[Session, Depends(get_db)]

def get_current_user(
    db: DbSession,
    token: Annotated[str, Depends(oauth2_scheme)],
) -> User:
    subject = decode_access_token(token)
    if subject is None:
        raise AuthError("Invalid or expired token")

    user = AuthService(db).get_user(int(subject))
    if user is None:
        raise AuthError("User no longer exists")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
