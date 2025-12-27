"""Task Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.models.task import Priority


class TaskBase(BaseModel):
    """Base schema with common task fields."""

    title: str = Field(..., min_length=1, max_length=500, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: Priority = Field(Priority.MEDIUM, description="Task priority level")
    deadline: Optional[datetime] = Field(None, description="Due date/time (UTC)")
    time_estimate: Optional[int] = Field(None, ge=0, description="Estimated minutes")
    project_id: Optional[UUID] = Field(None, description="Project assignment")


class TaskCreate(TaskBase):
    """Schema for creating a new task."""

    pass


class TaskUpdate(BaseModel):
    """Schema for updating an existing task. All fields optional."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    priority: Optional[Priority] = None
    deadline: Optional[datetime] = None
    time_estimate: Optional[int] = Field(None, ge=0)
    is_completed: Optional[bool] = None
    project_id: Optional[UUID] = None


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: UUID
    title: str
    description: Optional[str]
    priority: Priority
    deadline: Optional[datetime]
    time_estimate: Optional[int]
    is_completed: bool
    user_id: str
    project_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    is_overdue: bool = Field(description="Whether task is past deadline")
    days_until_deadline: Optional[int] = Field(description="Days until deadline")
    tag_ids: list[UUID] = Field(default_factory=list, description="Associated tag IDs")

    model_config = {"from_attributes": True}

    @field_validator("is_overdue", mode="before")
    @classmethod
    def compute_is_overdue(cls, v, info):
        """Compute is_overdue from model property or raw value."""
        if v is not None:
            return v
        # If coming from ORM model, will be computed via property
        return False

    @field_validator("days_until_deadline", mode="before")
    @classmethod
    def compute_days_until_deadline(cls, v, info):
        """Compute days_until_deadline from model property or raw value."""
        return v


class TaskListResponse(BaseModel):
    """Schema for paginated task list response."""

    items: list[TaskResponse]
    total: int
    page: int
    page_size: int
    pages: int


class TaskToggleResponse(BaseModel):
    """Schema for task completion toggle response."""

    id: UUID
    is_completed: bool
    updated_at: datetime
