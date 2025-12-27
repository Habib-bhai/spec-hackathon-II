"""Task API endpoints."""

from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser
from app.core.database import SessionDep
from app.models.task import Priority
from app.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskToggleResponse,
    TaskUpdate,
)
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _task_to_response(task) -> TaskResponse:
    """Convert Task model to TaskResponse schema."""
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        deadline=task.deadline,
        time_estimate=task.time_estimate,
        is_completed=task.is_completed,
        user_id=task.user_id,
        project_id=task.project_id,
        created_at=task.created_at,
        updated_at=task.updated_at,
        is_overdue=task.is_overdue,
        days_until_deadline=task.days_until_deadline,
        tag_ids=[tt.tag_id for tt in task.task_tags] if task.task_tags else [],
    )


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: CurrentUser,
    session: SessionDep,
) -> TaskResponse:
    """Create a new task.

    Creates a task for the authenticated user with the provided details.
    """
    service = TaskService(session)
    task = await service.create(current_user.id, task_data)
    return _task_to_response(task)


@router.get("/", response_model=TaskListResponse)
async def list_tasks(
    current_user: CurrentUser,
    session: SessionDep,
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(20, ge=1, le=100, description="Maximum items to return"),
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[Priority] = Query(None, description="Filter by priority"),
    project_id: Optional[UUID] = Query(None, description="Filter by project"),
    tag_ids: Optional[list[UUID]] = Query(None, description="Filter by tag IDs (must have ALL)"),
    deadline_before: Optional[datetime] = Query(None, description="Filter tasks with deadline before this date"),
    deadline_after: Optional[datetime] = Query(None, description="Filter tasks with deadline after this date"),
    search: Optional[str] = Query(None, max_length=200, description="Text search on title and description"),
    sort_by: Literal["created_at", "deadline", "priority", "title"] = Query(
        "created_at", description="Field to sort by"
    ),
    sort_order: Literal["asc", "desc"] = Query("desc", description="Sort direction"),
) -> TaskListResponse:
    """List tasks with pagination, filtering, searching, and sorting.

    Returns paginated list of tasks for the authenticated user.

    **Filtering:**
    - `is_completed`: Filter by completion status (true/false)
    - `priority`: Filter by priority level (0=CRITICAL, 1=HIGH, 2=MEDIUM, 3=LOW)
    - `project_id`: Filter by project UUID
    - `tag_ids`: Filter by tag UUIDs (tasks must have ALL specified tags)
    - `deadline_before`: Filter tasks with deadline before this datetime
    - `deadline_after`: Filter tasks with deadline after this datetime

    **Searching:**
    - `search`: Case-insensitive search on title and description fields

    **Sorting:**
    - `sort_by`: Field to sort by (created_at, deadline, priority, title)
    - `sort_order`: Sort direction (asc, desc)

    **Pagination:**
    - `offset`: Number of items to skip (default: 0)
    - `limit`: Maximum items to return (default: 20, max: 100)
    """
    service = TaskService(session)
    tasks, total = await service.get_all(
        user_id=current_user.id,
        offset=offset,
        limit=limit,
        is_completed=is_completed,
        priority=priority,
        project_id=project_id,
        tag_ids=tag_ids,
        deadline_before=deadline_before,
        deadline_after=deadline_after,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    # Calculate page info for backwards compatibility
    page = (offset // limit) + 1 if limit > 0 else 1
    pages = (total + limit - 1) // limit if total > 0 else 1

    return TaskListResponse(
        items=[_task_to_response(task) for task in tasks],
        total=total,
        page=page,
        page_size=limit,
        pages=pages,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> TaskResponse:
    """Get a single task by ID.

    Returns the task details if it belongs to the authenticated user.
    """
    service = TaskService(session)
    task = await service.get(task_id, current_user.id)
    return _task_to_response(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user: CurrentUser,
    session: SessionDep,
) -> TaskResponse:
    """Update an existing task.

    Updates only the provided fields for the task.
    """
    service = TaskService(session)
    task = await service.update(task_id, current_user.id, task_data)
    return _task_to_response(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> None:
    """Delete a task.

    Permanently removes the task and all associated data.
    """
    service = TaskService(session)
    await service.delete(task_id, current_user.id)


@router.patch("/{task_id}/complete", response_model=TaskToggleResponse)
async def toggle_task_complete(
    task_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> TaskToggleResponse:
    """Toggle task completion status.

    Flips the is_completed flag for the task.
    """
    service = TaskService(session)
    task = await service.toggle_complete(task_id, current_user.id)
    return TaskToggleResponse(
        id=task.id,
        is_completed=task.is_completed,
        updated_at=task.updated_at,
    )


@router.post("/{task_id}/tags/{tag_id}", response_model=TaskResponse)
async def add_tag_to_task(
    task_id: UUID,
    tag_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> TaskResponse:
    """Add a tag to a task."""
    service = TaskService(session)
    task = await service.add_tag(task_id, current_user.id, tag_id)
    return _task_to_response(task)


@router.delete("/{task_id}/tags/{tag_id}", response_model=TaskResponse)
async def remove_tag_from_task(
    task_id: UUID,
    tag_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> TaskResponse:
    """Remove a tag from a task."""
    service = TaskService(session)
    task = await service.remove_tag(task_id, current_user.id, tag_id)
    return _task_to_response(task)
