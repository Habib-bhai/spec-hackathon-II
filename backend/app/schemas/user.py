"""User Pydantic schemas for request/response validation."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    """Schema for user profile response."""

    id: str
    email: EmailStr
    display_name: str = Field(max_length=100)
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    """Schema for creating a user (used internally when syncing from auth)."""

    id: str
    email: EmailStr
    display_name: str = Field(max_length=100)
