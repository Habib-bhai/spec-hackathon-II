"""User API endpoints."""

from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_endpoint(current_user: CurrentUser) -> UserResponse:
    """Get the current authenticated user's profile.

    Returns the profile of the authenticated user based on their JWT token.
    If the user doesn't exist in the database, they are auto-created from
    the JWT claims on first request.
    """
    return UserResponse.model_validate(current_user)
