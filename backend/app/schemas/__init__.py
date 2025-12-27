"""Pydantic schemas for request/response validation."""

from app.schemas.common import ErrorDetail, ErrorResponse, Pagination, SuccessResponse
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.schemas.tag import TagCreate, TagListResponse, TagResponse, TagUpdate
from app.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskToggleResponse,
    TaskUpdate,
)
from app.schemas.user import UserResponse

__all__ = [
    # Common
    "ErrorDetail",
    "ErrorResponse",
    "Pagination",
    "SuccessResponse",
    # Project
    "ProjectCreate",
    "ProjectListResponse",
    "ProjectResponse",
    "ProjectUpdate",
    # Tag
    "TagCreate",
    "TagListResponse",
    "TagResponse",
    "TagUpdate",
    # Task
    "TaskCreate",
    "TaskListResponse",
    "TaskResponse",
    "TaskToggleResponse",
    "TaskUpdate",
    # User
    "UserResponse",
]
