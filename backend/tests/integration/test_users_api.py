"""Integration tests for user API endpoints."""

from datetime import datetime
from uuid import UUID

import pytest
from httpx import AsyncClient


# Test user ID used by the placeholder auth
TEST_USER_ID = UUID("00000000-0000-0000-0000-000000000001")


@pytest.fixture
async def test_user(db_session):
    """Create a test user in the database."""
    from app.models.user import User

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


class TestGetCurrentUser:
    """Tests for GET /api/v1/users/me endpoint."""

    @pytest.mark.asyncio
    async def test_get_current_user_success(self, client: AsyncClient, test_user):
        """Test getting current user profile."""
        response = await client.get("/api/v1/users/me")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(TEST_USER_ID)
        assert data["email"] == "test@example.com"
        assert data["display_name"] == "Test User"
        assert "created_at" in data

    @pytest.mark.asyncio
    async def test_get_current_user_not_found(self, client: AsyncClient):
        """Test getting current user when user doesn't exist in database.

        Note: This tests the placeholder auth scenario where the hardcoded
        user ID doesn't exist in the database.
        """
        response = await client.get("/api/v1/users/me")

        # Should return 404 since the test user hasn't been created
        assert response.status_code == 404
