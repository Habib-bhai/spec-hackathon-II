"""Tag SQLModel definition."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.task_tag import TaskTag
    from app.models.user import User


class Tag(SQLModel, table=True):
    """Tag model representing a categorization label for tasks."""

    __tablename__ = "tags"
    __table_args__ = (UniqueConstraint("user_id", "label", name="uq_tag_user_label"),)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    label: str = Field(max_length=50)
    color: Optional[str] = Field(default=None, max_length=7)  # #RRGGBB format

    user_id: str = Field(foreign_key="users.id", index=True, max_length=64)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tags")
    task_tags: list["TaskTag"] = Relationship(back_populates="tag")
