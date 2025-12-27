"""Project service for business logic."""

import logging
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DuplicateResourceError, ResourceNotFoundError
from app.models.project import Project
from app.models.task import Task
from app.schemas.project import ProjectCreate, ProjectUpdate

logger = logging.getLogger(__name__)


class ProjectService:
    """Service class for project operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: str, project_data: ProjectCreate) -> Project:
        """Create a new project for a user.

        Raises DuplicateResourceError if user already has a project with the same name.
        """
        logger.info(f"Creating project for user {user_id}: {project_data.name}")
        # Check for duplicate name per user
        existing = await self._get_by_name(user_id, project_data.name)
        if existing:
            logger.warning(f"Duplicate project name '{project_data.name}' for user {user_id}")
            raise DuplicateResourceError("Project", "name", project_data.name)

        project = Project(
            name=project_data.name,
            description=project_data.description,
            user_id=user_id,
        )
        self.session.add(project)
        await self.session.commit()
        await self.session.refresh(project)
        logger.info(f"Created project {project.id}")
        return project

    async def get(self, project_id: UUID, user_id: str) -> Project:
        """Get a single project by ID, ensuring it belongs to the user."""
        logger.debug(f"Getting project {project_id} for user {user_id}")
        stmt = select(Project).where(Project.id == project_id, Project.user_id == user_id)
        result = await self.session.execute(stmt)
        project = result.scalar_one_or_none()
        if not project:
            logger.warning(f"Project {project_id} not found for user {user_id}")
            raise ResourceNotFoundError("Project", str(project_id))
        return project

    async def _get_by_name(self, user_id: str, name: str) -> Optional[Project]:
        """Get a project by name for a user (case-insensitive check)."""
        stmt = select(Project).where(
            Project.user_id == user_id,
            func.lower(Project.name) == func.lower(name),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Project], int]:
        """Get paginated projects for a user.

        Returns tuple of (projects, total_count).
        """
        logger.debug(f"Getting all projects for user {user_id}")
        stmt = select(Project).where(Project.user_id == user_id)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar() or 0

        # Apply pagination and ordering
        stmt = stmt.order_by(Project.name)
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        projects = list(result.scalars().all())

        logger.debug(f"Found {len(projects)} projects (total: {total})")
        return projects, total

    async def update(
        self, project_id: UUID, user_id: str, project_data: ProjectUpdate
    ) -> Project:
        """Update an existing project."""
        logger.info(f"Updating project {project_id} for user {user_id}")
        project = await self.get(project_id, user_id)

        # Check for duplicate name if name is being changed
        update_data = project_data.model_dump(exclude_unset=True)
        if "name" in update_data and update_data["name"] != project.name:
            existing = await self._get_by_name(user_id, update_data["name"])
            if existing:
                logger.warning(f"Duplicate project name '{update_data['name']}' for user {user_id}")
                raise DuplicateResourceError("Project", "name", update_data["name"])

        # Update only provided fields
        for field, value in update_data.items():
            setattr(project, field, value)

        project.updated_at = datetime.utcnow()

        self.session.add(project)
        await self.session.commit()
        await self.session.refresh(project)
        logger.info(f"Updated project {project_id}")
        return project

    async def delete(self, project_id: UUID, user_id: str) -> None:
        """Delete a project.

        Tasks in the project will have their project_id set to NULL (moved to inbox).
        """
        logger.info(f"Deleting project {project_id} for user {user_id}")
        project = await self.get(project_id, user_id)
        await self.session.delete(project)
        await self.session.commit()
        logger.info(f"Deleted project {project_id}")

    async def get_task_counts(self, project_id: UUID) -> tuple[int, int]:
        """Get task count and completed task count for a project.

        Returns tuple of (task_count, completed_task_count).
        """
        # Total tasks
        total_stmt = select(func.count()).where(Task.project_id == project_id)
        total_result = await self.session.execute(total_stmt)
        task_count = total_result.scalar() or 0

        # Completed tasks
        completed_stmt = select(func.count()).where(
            Task.project_id == project_id,
            Task.is_completed == True,  # noqa: E712
        )
        completed_result = await self.session.execute(completed_stmt)
        completed_count = completed_result.scalar() or 0

        return task_count, completed_count
