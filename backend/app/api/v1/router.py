"""API v1 router aggregating all endpoint routes."""

from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.projects import router as projects_router
from app.api.v1.tags import router as tags_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.users import router as users_router

api_router = APIRouter()

# Health check endpoints (Phase 4)
api_router.include_router(health_router)

# User endpoints (Phase 4)
api_router.include_router(users_router)

# Task CRUD endpoints (Phase 3)
api_router.include_router(tasks_router)

# Project CRUD endpoints (Phase 5)
api_router.include_router(projects_router)

# Tag CRUD endpoints (Phase 6)
api_router.include_router(tags_router)
