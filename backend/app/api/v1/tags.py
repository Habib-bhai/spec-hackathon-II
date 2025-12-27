"""Tag API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser
from app.core.database import SessionDep
from app.schemas.tag import (
    TagCreate,
    TagListResponse,
    TagResponse,
    TagUpdate,
)
from app.services.tag_service import TagService

router = APIRouter(prefix="/tags", tags=["tags"])


async def _tag_to_response(tag, service: TagService) -> TagResponse:
    """Convert Tag model to TagResponse schema with task count."""
    task_count = await service.get_task_count(tag.id)
    return TagResponse(
        id=tag.id,
        label=tag.label,
        color=tag.color,
        user_id=tag.user_id,
        created_at=tag.created_at,
        task_count=task_count,
    )


@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_data: TagCreate,
    current_user: CurrentUser,
    session: SessionDep,
) -> TagResponse:
    """Create a new tag.

    Creates a tag for the authenticated user with the provided details.
    Tag labels must be unique per user (case-insensitive).
    """
    service = TagService(session)
    tag = await service.create(current_user.id, tag_data)
    return await _tag_to_response(tag, service)


@router.get("/", response_model=TagListResponse)
async def list_tags(
    current_user: CurrentUser,
    session: SessionDep,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
) -> TagListResponse:
    """List tags with pagination.

    Returns paginated list of tags for the authenticated user, sorted alphabetically.
    """
    service = TagService(session)
    tags, total = await service.get_all(
        user_id=current_user.id,
        page=page,
        page_size=page_size,
    )

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    items = [await _tag_to_response(t, service) for t in tags]

    return TagListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{tag_id}", response_model=TagResponse)
async def get_tag(
    tag_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> TagResponse:
    """Get a single tag by ID.

    Returns the tag details if it belongs to the authenticated user.
    """
    service = TagService(session)
    tag = await service.get(tag_id, current_user.id)
    return await _tag_to_response(tag, service)


@router.patch("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: UUID,
    tag_data: TagUpdate,
    current_user: CurrentUser,
    session: SessionDep,
) -> TagResponse:
    """Update an existing tag.

    Updates only the provided fields for the tag.
    Tag labels must be unique per user (case-insensitive).
    """
    service = TagService(session)
    tag = await service.update(tag_id, current_user.id, tag_data)
    return await _tag_to_response(tag, service)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> None:
    """Delete a tag.

    Deletes the tag and removes it from all tasks.
    """
    service = TagService(session)
    await service.delete(tag_id, current_user.id)
