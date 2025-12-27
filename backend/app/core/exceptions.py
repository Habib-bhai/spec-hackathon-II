"""Custom exception classes for the application."""

from typing import Any


class AppException(Exception):
    """Base exception for application errors."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class ResourceNotFoundError(AppException):
    """Raised when a requested resource is not found."""

    def __init__(
        self,
        resource: str,
        resource_id: str | None = None,
        message: str | None = None,
    ) -> None:
        msg = message or f"{resource} not found"
        if resource_id:
            msg = f"{resource} with id '{resource_id}' not found"
        super().__init__(
            code="RESOURCE_NOT_FOUND",
            message=msg,
            status_code=404,
            details={"resource": resource, "resource_id": resource_id},
        )


class ValidationError(AppException):
    """Raised when request validation fails."""

    def __init__(
        self,
        message: str = "Validation error",
        field: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        error_details = details or {}
        if field:
            error_details["field"] = field
        super().__init__(
            code="VALIDATION_ERROR",
            message=message,
            status_code=422,
            details=error_details,
        )


class DuplicateResourceError(AppException):
    """Raised when attempting to create a duplicate resource."""

    def __init__(
        self,
        resource: str,
        field: str | None = None,
        message: str | None = None,
    ) -> None:
        msg = message or f"{resource} already exists"
        if field:
            msg = f"{resource} with this {field} already exists"
        super().__init__(
            code="DUPLICATE_RESOURCE",
            message=msg,
            status_code=409,
            details={"resource": resource, "field": field},
        )


class DatabaseError(AppException):
    """Raised when a database operation fails."""

    def __init__(
        self,
        message: str = "Database operation failed",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            code="DATABASE_ERROR",
            message=message,
            status_code=500,
            details=details,
        )
