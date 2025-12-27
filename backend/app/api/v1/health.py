"""Health check API endpoints."""

from datetime import datetime
from typing import Literal

from fastapi import APIRouter, status
from pydantic import BaseModel
from sqlalchemy import text

from app.core.database import SessionDep

router = APIRouter(prefix="/health", tags=["health"])


class HealthResponse(BaseModel):
    """Basic health check response."""

    status: Literal["healthy", "unhealthy"]
    timestamp: datetime
    version: str = "0.1.0"


class DatabaseHealthResponse(BaseModel):
    """Database health check response."""

    status: Literal["healthy", "unhealthy"]
    timestamp: datetime
    database_connected: bool
    latency_ms: float | None = None
    error: str | None = None


@router.get("/", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Basic health check endpoint.

    Returns the service health status. This endpoint can be used
    by load balancers and orchestrators to verify the service is running.
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
    )


@router.get("/db", response_model=DatabaseHealthResponse)
async def database_health_check(session: SessionDep) -> DatabaseHealthResponse:
    """Database connectivity health check.

    Verifies the database connection is working by executing a simple query.
    Returns connection status and latency information.
    """
    start_time = datetime.utcnow()
    try:
        # Execute a simple query to verify database connectivity
        await session.execute(text("SELECT 1"))
        end_time = datetime.utcnow()
        latency_ms = (end_time - start_time).total_seconds() * 1000

        return DatabaseHealthResponse(
            status="healthy",
            timestamp=datetime.utcnow(),
            database_connected=True,
            latency_ms=round(latency_ms, 2),
        )
    except Exception as e:
        return DatabaseHealthResponse(
            status="unhealthy",
            timestamp=datetime.utcnow(),
            database_connected=False,
            error=str(e),
        )
