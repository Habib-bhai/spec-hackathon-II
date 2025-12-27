"""Integration tests for authentication flow (T046)."""

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import UUID

import pytest
from fastapi import HTTPException
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from app.api.deps import get_current_user, get_or_create_user
from app.models.user import User


class TestGetCurrentUser:
    """Integration tests for the get_current_user dependency."""

    @pytest.mark.asyncio
    @patch("app.api.deps.verify_jwt_token")
    @patch("app.api.deps.get_or_create_user")
    async def test_protected_endpoint_with_valid_token(
        self, mock_get_or_create, mock_verify
    ):
        """Test that protected endpoints accept valid tokens."""
        # Arrange
        mock_user = User(
            id=UUID("12345678-1234-5678-1234-567812345678"),
            email="test@example.com",
            display_name="Test User",
            created_at=datetime.utcnow(),
        )
        mock_verify.return_value = {
            "sub": "12345678-1234-5678-1234-567812345678",
            "email": "test@example.com",
        }
        mock_get_or_create.return_value = mock_user

        mock_credentials = MagicMock()
        mock_credentials.credentials = "valid.jwt.token"
        mock_session = AsyncMock()

        # Act
        result = await get_current_user(mock_credentials, mock_session)

        # Assert
        assert result == mock_user
        mock_verify.assert_called_once_with("valid.jwt.token")

    @pytest.mark.asyncio
    async def test_protected_endpoint_without_token(self):
        """Test that protected endpoints reject requests without tokens."""
        # Arrange
        mock_session = AsyncMock()

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(None, mock_session)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Authentication required"

    @pytest.mark.asyncio
    @patch("app.api.deps.verify_jwt_token")
    async def test_protected_endpoint_with_expired_token(self, mock_verify):
        """Test that protected endpoints reject expired tokens."""
        # Arrange
        mock_verify.side_effect = ExpiredSignatureError("Token has expired")

        mock_credentials = MagicMock()
        mock_credentials.credentials = "expired.jwt.token"
        mock_session = AsyncMock()

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(mock_credentials, mock_session)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Token expired"

    @pytest.mark.asyncio
    @patch("app.api.deps.verify_jwt_token")
    async def test_protected_endpoint_with_invalid_token(self, mock_verify):
        """Test that protected endpoints reject invalid tokens."""
        # Arrange
        mock_verify.side_effect = InvalidTokenError("Invalid signature")

        mock_credentials = MagicMock()
        mock_credentials.credentials = "invalid.jwt.token"
        mock_session = AsyncMock()

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(mock_credentials, mock_session)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid token"


class TestUserAutoProvisioning:
    """Integration tests for user auto-provisioning."""

    @pytest.mark.asyncio
    async def test_user_auto_provisioning_new_user(self):
        """Test that new users are auto-provisioned from JWT claims."""
        # Arrange
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute.return_value = mock_result

        claims = {
            "sub": "12345678-1234-5678-1234-567812345678",
            "email": "newuser@example.com",
            "name": "New User",
        }

        # Act
        user = await get_or_create_user(mock_session, claims)

        # Assert
        assert user.email == "newuser@example.com"
        assert user.display_name == "New User"
        mock_session.add.assert_called_once()
        mock_session.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_user_auto_provisioning_existing_user(self):
        """Test that existing users are returned without creating new ones."""
        # Arrange
        existing_user = User(
            id=UUID("12345678-1234-5678-1234-567812345678"),
            email="existing@example.com",
            display_name="Existing User",
            created_at=datetime.utcnow(),
        )

        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = existing_user
        mock_session.execute.return_value = mock_result

        claims = {
            "sub": "12345678-1234-5678-1234-567812345678",
            "email": "existing@example.com",
        }

        # Act
        user = await get_or_create_user(mock_session, claims)

        # Assert
        assert user == existing_user
        mock_session.add.assert_not_called()
        mock_session.commit.assert_not_called()

    @pytest.mark.asyncio
    async def test_user_auto_provisioning_email_fallback(self):
        """Test that display name falls back to email prefix when name is not provided."""
        # Arrange
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute.return_value = mock_result

        claims = {
            "sub": "12345678-1234-5678-1234-567812345678",
            "email": "john.doe@example.com",
            # No 'name' claim
        }

        # Act
        user = await get_or_create_user(mock_session, claims)

        # Assert
        assert user.display_name == "john.doe"
