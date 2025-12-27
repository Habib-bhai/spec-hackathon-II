"""Task service for business logic."""

import logging
from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import ResourceNotFoundError, ValidationError
from app.models.task import Priority, Task
from app.models.task_tag import TaskTag
from app.schemas.task import TaskCreate, TaskUpdate

logger = logging.getLogger(__name__)


class TaskService:
    """Service class for task operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: str, task_data: TaskCreate) -> Task:
        """Create a new task for a user."""
        logger.info(f"Creating task for user {user_id}: {task_data.title}")
        task = Task(
            title=task_data.title,
            description=task_data.description,
            priority=task_data.priority,
            deadline=task_data.deadline,
            time_estimate=task_data.time_estimate,
            project_id=task_data.project_id,
            user_id=user_id,
        )
        self.session.add(task)
        await self.session.commit()

        # Re-fetch with eager loading to avoid lazy load issues in async
        stmt = (
            select(Task)
            .options(selectinload(Task.task_tags))
            .where(Task.id == task.id)
        )
        result = await self.session.execute(stmt)
        task = result.scalar_one()

        logger.info(f"Created task {task.id}")
        return task

    async def get(self, task_id: UUID, user_id: str) -> Task:
        """Get a single task by ID, ensuring it belongs to the user."""
        logger.debug(f"Getting task {task_id} for user {user_id}")
        stmt = (
            select(Task)
            .options(selectinload(Task.task_tags))
            .where(Task.id == task_id, Task.user_id == user_id)
        )
        result = await self.session.execute(stmt)
        task = result.scalar_one_or_none()
        if not task:
            logger.warning(f"Task {task_id} not found for user {user_id}")
            raise ResourceNotFoundError("Task", str(task_id))
        return task

    async def get_all(
        self,
        user_id: str,
        *,
        offset: int = 0,
        limit: int = 20,
        is_completed: Optional[bool] = None,
        priority: Optional[Priority] = None,
        project_id: Optional[UUID] = None,
        tag_ids: Optional[list[UUID]] = None,
        deadline_before: Optional[datetime] = None,
        deadline_after: Optional[datetime] = None,
        search: Optional[str] = None,
        sort_by: Literal["created_at", "deadline", "priority", "title"] = "created_at",
        sort_order: Literal["asc", "desc"] = "desc",
    ) -> tuple[list[Task], int]:
        """Get paginated tasks for a user with comprehensive filters.

        Args:
            user_id: The user's ID
            offset: Number of items to skip (for pagination)
            limit: Maximum number of items to return
            is_completed: Filter by completion status
            priority: Filter by priority level
            project_id: Filter by project
            tag_ids: Filter by multiple tag IDs (tasks must have ALL specified tags)
            deadline_before: Filter tasks with deadline before this date
            deadline_after: Filter tasks with deadline after this date
            search: Text search on title and description
            sort_by: Field to sort by
            sort_order: Sort direction (asc/desc)

        Returns:
            Tuple of (tasks list, total count)
        """
        logger.debug(
            f"Getting tasks for user {user_id} with filters: "
            f"is_completed={is_completed}, priority={priority}, "
            f"project_id={project_id}, tag_ids={tag_ids}, "
            f"deadline_before={deadline_before}, deadline_after={deadline_after}, "
            f"search={search}, sort_by={sort_by}, sort_order={sort_order}"
        )

        # Base query
        stmt = select(Task).options(selectinload(Task.task_tags)).where(Task.user_id == user_id)

        # Apply filters
        if is_completed is not None:
            stmt = stmt.where(Task.is_completed == is_completed)
        if priority is not None:
            stmt = stmt.where(Task.priority == priority)
        if project_id is not None:
            stmt = stmt.where(Task.project_id == project_id)

        # Deadline range filtering
        if deadline_before is not None:
            stmt = stmt.where(Task.deadline <= deadline_before)
        if deadline_after is not None:
            stmt = stmt.where(Task.deadline >= deadline_after)

        # Multiple tag filtering (tasks must have ALL specified tags)
        if tag_ids:
            for tag_id in tag_ids:
                # Subquery to find tasks that have this specific tag
                tag_subquery = (
                    select(TaskTag.task_id)
                    .where(TaskTag.tag_id == tag_id)
                    .subquery()
                )
                stmt = stmt.where(Task.id.in_(select(tag_subquery.c.task_id)))

        # Text search on title and description
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    Task.title.ilike(search_pattern),
                    Task.description.ilike(search_pattern),
                )
            )

        # Count total before pagination
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar() or 0

        # Apply sorting
        sort_column = getattr(Task, sort_by)
        if sort_order == "desc":
            stmt = stmt.order_by(sort_column.desc())
        else:
            stmt = stmt.order_by(sort_column.asc())

        # Apply pagination using offset/limit
        stmt = stmt.offset(offset).limit(limit)

        result = await self.session.execute(stmt)
        tasks = list(result.scalars().all())

        logger.debug(f"Found {len(tasks)} tasks (total: {total})")
        return tasks, total

    async def update(self, task_id: UUID, user_id: str, task_data: TaskUpdate) -> Task:
        """Update an existing task."""
        logger.info(f"Updating task {task_id} for user {user_id}")
        task = await self.get(task_id, user_id)

        # Update only provided fields
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        task.updated_at = datetime.utcnow()

        self.session.add(task)
        await self.session.commit()

        # Re-fetch with eager loading to avoid lazy load issues
        task = await self.get(task_id, user_id)
        logger.info(f"Updated task {task_id}")
        return task

    async def delete(self, task_id: UUID, user_id: str) -> None:
        """Delete a task."""
        logger.info(f"Deleting task {task_id} for user {user_id}")
        task = await self.get(task_id, user_id)
        await self.session.delete(task)
        await self.session.commit()
        logger.info(f"Deleted task {task_id}")

    async def toggle_complete(self, task_id: UUID, user_id: str) -> Task:
        """Toggle the completion status of a task."""
        logger.info(f"Toggling completion for task {task_id}")
        task = await self.get(task_id, user_id)
        task.is_completed = not task.is_completed
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        await self.session.commit()

        # Re-fetch with eager loading to avoid lazy load issues
        task = await self.get(task_id, user_id)
        logger.info(f"Task {task_id} is_completed={task.is_completed}")
        return task

    async def add_tag(self, task_id: UUID, user_id: str, tag_id: UUID) -> Task:
        """Add a tag to a task."""
        logger.info(f"Adding tag {tag_id} to task {task_id}")
        task = await self.get(task_id, user_id)

        # Check if tag already assigned
        existing = [tt for tt in task.task_tags if tt.tag_id == tag_id]
        if existing:
            raise ValidationError(f"Tag {tag_id} already assigned to task")

        task_tag = TaskTag(task_id=task_id, tag_id=tag_id)
        self.session.add(task_tag)
        await self.session.commit()

        # Re-fetch with eager loading to avoid lazy load issues
        task = await self.get(task_id, user_id)
        logger.info(f"Added tag {tag_id} to task {task_id}")
        return task

    async def remove_tag(self, task_id: UUID, user_id: str, tag_id: UUID) -> Task:
        """Remove a tag from a task."""
        logger.info(f"Removing tag {tag_id} from task {task_id}")
        task = await self.get(task_id, user_id)

        # Find and remove the tag
        stmt = select(TaskTag).where(TaskTag.task_id == task_id, TaskTag.tag_id == tag_id)
        result = await self.session.execute(stmt)
        task_tag = result.scalar_one_or_none()

        if not task_tag:
            raise ResourceNotFoundError("TaskTag", f"{task_id}/{tag_id}")

        await self.session.delete(task_tag)
        await self.session.commit()

        # Re-fetch with eager loading to avoid lazy load issues
        task = await self.get(task_id, user_id)
        logger.info(f"Removed tag {tag_id} from task {task_id}")
        return task
