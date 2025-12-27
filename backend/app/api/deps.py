"""FastAPI dependencies for authentication and authorization."""

import logging
from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.core.security import verify_jwt_token
from app.models.user import User

logger = logging.getLogger(__name__)

# HTTP Bearer token security scheme
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> User:
    """
    Dependency to get the current authenticated user.

    This dependency:
    1. Extracts the Bearer token from the Authorization header
    2. Verifies the JWT using JWKS from Better Auth
    3. Retrieves or auto-creates the user in the database

    Args:
        credentials: The HTTP Bearer credentials (token)
        session: The database session

    Returns:
        User: The authenticated user object

    Raises:
        HTTPException: 401 if no token provided, token invalid, or token expired
    """
    if credentials is None:
        logger.warning("No authorization credentials provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        # Verify the JWT token
        claims = verify_jwt_token(token)

        # Get or create the user
        user = await get_or_create_user(session, claims)
        return user

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except InvalidTokenError as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except ValueError as e:
        # Handle UUID conversion errors
        logger.error(f"Invalid user ID format in token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_or_create_user(
    session: AsyncSession,
    claims: dict,
) -> User:
    """
    Get existing user or auto-create from JWT claims.

    Args:
        session: The database session
        claims: The decoded JWT claims

    Returns:
        User: The user object (existing or newly created)
    """
    # Extract user ID from 'sub' claim (Better Auth uses string IDs)
    user_id = claims["sub"]

    # Try to find existing user
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        # Auto-create user from JWT claims
        email = claims.get("email", "")
        name = claims.get("name")

        # Derive display name from name claim or email prefix
        if name:
            display_name = name
        elif email:
            display_name = email.split("@")[0]
        else:
            display_name = "User"

        user = User(
            id=user_id,
            email=email,
            display_name=display_name,
            created_at=datetime.utcnow(),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        logger.info(f"Auto-provisioned new user: {user_id} ({email})")

    return user


# Type alias for dependency injection
CurrentUser = Annotated[User, Depends(get_current_user)]
