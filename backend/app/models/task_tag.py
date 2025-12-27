"""TaskTag junction table SQLModel definition."""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.tag import Tag
    from app.models.task import Task


class TaskTag(SQLModel, table=True):
    """Junction table for many-to-many relationship between Tasks and Tags."""

    __tablename__ = "task_tags"

    task_id: UUID = Field(foreign_key="tasks.id", primary_key=True, ondelete="CASCADE")
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True, ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="task_tags")
    tag: "Tag" = Relationship(back_populates="task_tags")
