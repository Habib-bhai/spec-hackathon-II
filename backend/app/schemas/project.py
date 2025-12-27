"""Project Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    """Base schema with common project fields."""

    name: str = Field(..., min_length=1, max_length=100, description="Project name")
    description: Optional[str] = Field(None, description="Project description")


class ProjectCreate(ProjectBase):
    """Schema for creating a new project."""

    pass


class ProjectUpdate(BaseModel):
    """Schema for updating an existing project. All fields optional."""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    """Schema for project response."""

    id: UUID
    name: str
    description: Optional[str]
    user_id: str
    created_at: datetime
    updated_at: datetime
    task_count: int = Field(0, description="Number of tasks in project")
    completed_task_count: int = Field(0, description="Number of completed tasks")

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    """Schema for paginated project list response."""

    items: list[ProjectResponse]
    total: int
    page: int
    page_size: int
    pages: int
