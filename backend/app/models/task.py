"""Task SQLModel definition."""

from datetime import datetime
from enum import IntEnum
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.task_tag import TaskTag
    from app.models.user import User


class Priority(IntEnum):
    """Task priority levels."""

    CRITICAL = 0
    HIGH = 1
    MEDIUM = 2
    LOW = 3


class Task(SQLModel, table=True):
    """Task model representing a todo item owned by a user."""

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=500)
    description: Optional[str] = Field(default=None)
    priority: Priority = Field(default=Priority.MEDIUM)
    deadline: Optional[datetime] = Field(default=None, index=True)
    time_estimate: Optional[int] = Field(default=None, ge=0)  # minutes
    is_completed: bool = Field(default=False, index=True)

    user_id: str = Field(foreign_key="users.id", index=True, max_length=64)
    project_id: Optional[UUID] = Field(default=None, foreign_key="projects.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    project: Optional["Project"] = Relationship(back_populates="tasks")
    task_tags: list["TaskTag"] = Relationship(back_populates="task")

    @property
    def is_overdue(self) -> bool:
        """Check if task is past deadline and not completed."""
        if self.deadline and not self.is_completed:
            return datetime.utcnow() > self.deadline
        return False

    @property
    def days_until_deadline(self) -> Optional[int]:
        """Calculate days until deadline."""
        if self.deadline:
            delta = self.deadline - datetime.utcnow()
            return delta.days
        return None
