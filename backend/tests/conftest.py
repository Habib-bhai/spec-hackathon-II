"""Pytest configuration and fixtures."""

import asyncio
from collections.abc import AsyncGenerator, Generator
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.api.deps import get_current_user
from app.core.database import get_session
from app.main import app
from app.models.user import User


# Test database URL - use SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Fixed test user ID for consistent testing
TEST_USER_ID = UUID("00000000-0000-0000-0000-000000000001")

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

# Test session factory
test_session_maker = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
async def setup_database() -> AsyncGenerator[None, None]:
    """Set up and tear down test database for each test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


async def override_get_session() -> AsyncGenerator[AsyncSession, None]:
    """Override database session for testing."""
    async with test_session_maker() as session:
        yield session


# Store the current test user for the mock
_current_test_user: User | None = None


async def override_get_current_user() -> User:
    """Override authentication for testing - returns the test user."""
    if _current_test_user is None:
        raise RuntimeError("Test user not set. Ensure test_user fixture is used.")
    return _current_test_user


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Get test database session."""
    async with test_session_maker() as session:
        yield session


@pytest.fixture
async def client(test_user: User) -> AsyncGenerator[AsyncClient, None]:
    """Create async test client with authentication override."""
    global _current_test_user
    _current_test_user = test_user

    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[get_current_user] = override_get_current_user
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
    _current_test_user = None


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """Create a test user in the database."""
    user = User(
        id=TEST_USER_ID,
        email="test@example.com",
        display_name="Test User",
        created_at=datetime.utcnow(),
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
def test_user_id() -> str:
    """Generate a test user ID."""
    return str(uuid4())


@pytest.fixture
def test_user_data() -> dict[str, Any]:
    """Generate test user data."""
    return {
        "id": str(uuid4()),
        "email": "test@example.com",
        "display_name": "Test User",
    }
