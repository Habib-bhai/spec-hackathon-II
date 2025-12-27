"""User SQLModel definition."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.tag import Tag
    from app.models.task import Task


class User(SQLModel, table=True):
    """User model representing a registered user.

    Note: Authentication is handled by Better Auth on the frontend.
    The backend only stores user metadata and verifies JWTs.
    Better Auth uses string IDs (not UUIDs).
    """

    __tablename__ = "users"

    id: str = Field(primary_key=True, max_length=64)  # String ID from Better Auth JWT 'sub' claim
    email: str = Field(max_length=255, unique=True, index=True)
    display_name: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")
    projects: list["Project"] = Relationship(back_populates="user")
    tags: list["Tag"] = Relationship(back_populates="user")
