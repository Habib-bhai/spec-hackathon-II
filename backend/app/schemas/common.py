"""Common Pydantic schemas for request/response validation."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class Pagination(BaseModel):
    """Pagination metadata."""

    offset: int = Field(ge=0, default=0, description="Number of items to skip")
    limit: int = Field(ge=1, le=100, default=50, description="Number of items to return")
    total: int = Field(ge=0, description="Total number of items available")

    model_config = ConfigDict(from_attributes=True)


class ErrorDetail(BaseModel):
    """Error detail structure."""

    code: str = Field(description="Machine-readable error code")
    message: str = Field(description="Human-readable error message")
    details: dict[str, Any] = Field(default_factory=dict, description="Additional error details")


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response wrapper."""

    success: bool = True
    data: T


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated success response wrapper."""

    success: bool = True
    data: list[T]
    pagination: Pagination


class ErrorResponse(BaseModel):
    """Standard error response wrapper."""

    success: bool = False
    error: ErrorDetail


class MessageResponse(BaseModel):
    """Simple message response."""

    success: bool = True
    message: str
