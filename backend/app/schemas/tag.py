"""Tag Pydantic schemas for request/response validation."""

import re
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class TagBase(BaseModel):
    """Base schema with common tag fields."""

    label: str = Field(..., min_length=1, max_length=50, description="Tag label")
    color: Optional[str] = Field(
        None,
        max_length=7,
        description="Hex color code (#RRGGBB format)",
        examples=["#FF5733", "#3498DB"],
    )

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        """Validate color is a valid hex code."""
        if v is None:
            return v
        if not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex code in #RRGGBB format")
        return v.upper()  # Normalize to uppercase


class TagCreate(TagBase):
    """Schema for creating a new tag."""

    pass


class TagUpdate(BaseModel):
    """Schema for updating an existing tag. All fields optional."""

    label: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, max_length=7)

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        """Validate color is a valid hex code."""
        if v is None:
            return v
        if not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex code in #RRGGBB format")
        return v.upper()


class TagResponse(BaseModel):
    """Schema for tag response."""

    id: UUID
    label: str
    color: Optional[str]
    user_id: str
    created_at: datetime
    task_count: int = Field(0, description="Number of tasks with this tag")

    model_config = {"from_attributes": True}


class TagSummary(BaseModel):
    """Minimal tag info for embedding in task responses."""

    id: UUID
    label: str
    color: Optional[str]

    model_config = {"from_attributes": True}


class TagListResponse(BaseModel):
    """Schema for paginated tag list response."""

    items: list[TagResponse]
    total: int
    page: int
    page_size: int
    pages: int
