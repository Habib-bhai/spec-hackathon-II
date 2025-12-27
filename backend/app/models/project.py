"""Project SQLModel definition."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.task import Task
    from app.models.user import User


class Project(SQLModel, table=True):
    """Project model representing a collection of related tasks."""

    __tablename__ = "projects"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=100)
    description: Optional[str] = Field(default=None)

    user_id: str = Field(foreign_key="users.id", index=True, max_length=64)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="projects")
    tasks: list["Task"] = Relationship(back_populates="project")
