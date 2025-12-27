"""Tag service for business logic."""

import logging
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DuplicateResourceError, ResourceNotFoundError
from app.models.tag import Tag
from app.models.task_tag import TaskTag
from app.schemas.tag import TagCreate, TagUpdate

logger = logging.getLogger(__name__)


class TagService:
    """Service class for tag operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: str, tag_data: TagCreate) -> Tag:
        """Create a new tag for a user.

        Raises DuplicateResourceError if user already has a tag with the same label.
        """
        logger.info(f"Creating tag for user {user_id}: {tag_data.label}")
        # Check for duplicate label per user (case-insensitive)
        existing = await self._get_by_label(user_id, tag_data.label)
        if existing:
            logger.warning(f"Duplicate tag label '{tag_data.label}' for user {user_id}")
            raise DuplicateResourceError("Tag", "label", tag_data.label)

        tag = Tag(
            label=tag_data.label,
            color=tag_data.color,
            user_id=user_id,
        )
        self.session.add(tag)
        await self.session.commit()
        await self.session.refresh(tag)
        logger.info(f"Created tag {tag.id}")
        return tag

    async def get(self, tag_id: UUID, user_id: str) -> Tag:
        """Get a single tag by ID, ensuring it belongs to the user."""
        logger.debug(f"Getting tag {tag_id} for user {user_id}")
        stmt = select(Tag).where(Tag.id == tag_id, Tag.user_id == user_id)
        result = await self.session.execute(stmt)
        tag = result.scalar_one_or_none()
        if not tag:
            logger.warning(f"Tag {tag_id} not found for user {user_id}")
            raise ResourceNotFoundError("Tag", str(tag_id))
        return tag

    async def _get_by_label(self, user_id: str, label: str) -> Optional[Tag]:
        """Get a tag by label for a user (case-insensitive check)."""
        stmt = select(Tag).where(
            Tag.user_id == user_id,
            func.lower(Tag.label) == func.lower(label),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 50,
    ) -> tuple[list[Tag], int]:
        """Get paginated tags for a user.

        Returns tuple of (tags, total_count).
        """
        logger.debug(f"Getting all tags for user {user_id}")
        stmt = select(Tag).where(Tag.user_id == user_id)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar() or 0

        # Apply pagination and ordering
        stmt = stmt.order_by(Tag.label)
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        tags = list(result.scalars().all())

        logger.debug(f"Found {len(tags)} tags (total: {total})")
        return tags, total

    async def update(self, tag_id: UUID, user_id: str, tag_data: TagUpdate) -> Tag:
        """Update an existing tag."""
        logger.info(f"Updating tag {tag_id} for user {user_id}")
        tag = await self.get(tag_id, user_id)

        # Check for duplicate label if label is being changed
        update_data = tag_data.model_dump(exclude_unset=True)
        if "label" in update_data and update_data["label"] != tag.label:
            existing = await self._get_by_label(user_id, update_data["label"])
            if existing:
                logger.warning(f"Duplicate tag label '{update_data['label']}' for user {user_id}")
                raise DuplicateResourceError("Tag", "label", update_data["label"])

        # Update only provided fields
        for field, value in update_data.items():
            setattr(tag, field, value)

        self.session.add(tag)
        await self.session.commit()
        await self.session.refresh(tag)
        logger.info(f"Updated tag {tag_id}")
        return tag

    async def delete(self, tag_id: UUID, user_id: str) -> None:
        """Delete a tag.

        TaskTag records will be cascade deleted due to FK constraint.
        """
        logger.info(f"Deleting tag {tag_id} for user {user_id}")
        tag = await self.get(tag_id, user_id)
        await self.session.delete(tag)
        await self.session.commit()
        logger.info(f"Deleted tag {tag_id}")

    async def get_task_count(self, tag_id: UUID) -> int:
        """Get the count of tasks using this tag."""
        stmt = select(func.count()).where(TaskTag.tag_id == tag_id)
        result = await self.session.execute(stmt)
        return result.scalar() or 0
