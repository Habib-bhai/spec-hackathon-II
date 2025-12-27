"""Async database connection and session management."""

from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.core.config import settings

# Create async engine with connection pooling optimized for serverless
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,  # Base pool size
    max_overflow=10,  # Allow up to 15 total connections
    pool_recycle=300,  # Recycle connections after 5 minutes
)

# Session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def create_db_and_tables() -> None:
    """Create database tables.

    Note: In production, use Alembic migrations instead.
    This is for development/testing convenience.
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get async database session."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


# Type alias for dependency injection
SessionDep = Annotated[AsyncSession, Depends(get_session)]
