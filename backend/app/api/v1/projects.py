"""Project API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser
from app.core.database import SessionDep
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


async def _project_to_response(project, service: ProjectService) -> ProjectResponse:
    """Convert Project model to ProjectResponse schema with task counts."""
    task_count, completed_count = await service.get_task_counts(project.id)
    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        user_id=project.user_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        task_count=task_count,
        completed_task_count=completed_count,
    )


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: CurrentUser,
    session: SessionDep,
) -> ProjectResponse:
    """Create a new project.

    Creates a project for the authenticated user with the provided details.
    Project names must be unique per user.
    """
    service = ProjectService(session)
    project = await service.create(current_user.id, project_data)
    return await _project_to_response(project, service)


@router.get("/", response_model=ProjectListResponse)
async def list_projects(
    current_user: CurrentUser,
    session: SessionDep,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
) -> ProjectListResponse:
    """List projects with pagination.

    Returns paginated list of projects for the authenticated user.
    """
    service = ProjectService(session)
    projects, total = await service.get_all(
        user_id=current_user.id,
        page=page,
        page_size=page_size,
    )

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    items = [await _project_to_response(p, service) for p in projects]

    return ProjectListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> ProjectResponse:
    """Get a single project by ID.

    Returns the project details if it belongs to the authenticated user.
    """
    service = ProjectService(session)
    project = await service.get(project_id, current_user.id)
    return await _project_to_response(project, service)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    current_user: CurrentUser,
    session: SessionDep,
) -> ProjectResponse:
    """Update an existing project.

    Updates only the provided fields for the project.
    Project names must be unique per user.
    """
    service = ProjectService(session)
    project = await service.update(project_id, current_user.id, project_data)
    return await _project_to_response(project, service)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> None:
    """Delete a project.

    Deletes the project. Tasks in the project will be moved to the inbox
    (project_id set to NULL).
    """
    service = ProjectService(session)
    await service.delete(project_id, current_user.id)
