"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.core.exceptions import AppException

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Rate limiter configuration
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup/shutdown events."""
    # Startup
    logger.info("Starting application...")
    if settings.DEBUG:
        # Only auto-create tables in debug mode
        # In production, use Alembic migrations
        logger.info("DEBUG mode: Auto-creating database tables")
        await create_db_and_tables()
    logger.info("Application started successfully")
    yield
    # Shutdown
    logger.info("Shutting down application...")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="RESTful API for Full-Stack Todo application",
        version="0.1.0",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        """Handle custom application exceptions."""
        logger.warning(
            f"AppException: {exc.code} - {exc.message}",
            extra={"path": request.url.path, "method": request.method},
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                },
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle request validation errors."""
        errors = exc.errors()
        logger.warning(
            f"Validation error: {errors}",
            extra={"path": request.url.path, "method": request.method},
        )
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Request validation failed",
                    "details": {"errors": errors},
                },
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(
        request: Request, exc: SQLAlchemyError
    ) -> JSONResponse:
        """Handle database errors."""
        logger.error(
            f"Database error: {exc}",
            extra={"path": request.url.path, "method": request.method},
            exc_info=True,
        )
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "error": {
                    "code": "DATABASE_ERROR",
                    "message": "Database operation failed" if not settings.DEBUG else str(exc),
                    "details": {},
                },
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Handle unexpected exceptions."""
        logger.error(
            f"Unexpected error: {exc}",
            extra={"path": request.url.path, "method": request.method},
            exc_info=True,
        )
        if settings.DEBUG:
            error_message = str(exc)
        else:
            error_message = "An unexpected error occurred"

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": error_message,
                    "details": {},
                },
            },
        )

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return app


# Create the application instance
app = create_application()


@app.get("/", include_in_schema=False)
async def root() -> dict[str, Any]:
    """Root endpoint redirect to docs."""
    return {
        "message": "Welcome to Full-Stack Todo API",
        "docs": "/docs",
        "openapi": f"{settings.API_V1_PREFIX}/openapi.json",
    }
