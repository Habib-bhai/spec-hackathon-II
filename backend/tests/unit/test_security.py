"""Unit tests for the security module (T045)."""

import time
from unittest.mock import MagicMock, patch

import pytest
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from app.core.security import reset_jwks_client, verify_jwt_token


class TestVerifyJwtToken:
    """Tests for the verify_jwt_token function."""

    def setup_method(self):
        """Reset JWKS client before each test."""
        reset_jwks_client()

    @patch("app.core.security.get_jwks_client")
    @patch("app.core.security.jwt.decode")
    def test_valid_jwt_verification(self, mock_decode, mock_get_client):
        """Test that valid JWT tokens are verified successfully."""
        # Arrange
        mock_client = MagicMock()
        mock_signing_key = MagicMock()
        mock_signing_key.key = "test-key"
        mock_client.get_signing_key_from_jwt.return_value = mock_signing_key
        mock_get_client.return_value = mock_client

        expected_claims = {
            "sub": "user-123",
            "email": "test@example.com",
            "exp": int(time.time()) + 3600,
            "iat": int(time.time()),
        }
        mock_decode.return_value = expected_claims

        # Act
        result = verify_jwt_token("valid.jwt.token")

        # Assert
        assert result == expected_claims
        assert result["sub"] == "user-123"
        assert result["email"] == "test@example.com"
        mock_decode.assert_called_once()

    @patch("app.core.security.get_jwks_client")
    @patch("app.core.security.jwt.decode")
    def test_expired_jwt_handling(self, mock_decode, mock_get_client):
        """Test that expired JWT tokens raise ExpiredSignatureError."""
        # Arrange
        mock_client = MagicMock()
        mock_signing_key = MagicMock()
        mock_signing_key.key = "test-key"
        mock_client.get_signing_key_from_jwt.return_value = mock_signing_key
        mock_get_client.return_value = mock_client

        mock_decode.side_effect = ExpiredSignatureError("Token has expired")

        # Act & Assert
        with pytest.raises(ExpiredSignatureError):
            verify_jwt_token("expired.jwt.token")

    @patch("app.core.security.get_jwks_client")
    @patch("app.core.security.jwt.decode")
    def test_invalid_jwt_handling(self, mock_decode, mock_get_client):
        """Test that invalid JWT tokens raise InvalidTokenError."""
        # Arrange
        mock_client = MagicMock()
        mock_signing_key = MagicMock()
        mock_signing_key.key = "test-key"
        mock_client.get_signing_key_from_jwt.return_value = mock_signing_key
        mock_get_client.return_value = mock_client

        mock_decode.side_effect = InvalidTokenError("Invalid signature")

        # Act & Assert
        with pytest.raises(InvalidTokenError):
            verify_jwt_token("invalid.jwt.token")

    @patch("app.core.security.get_jwks_client")
    def test_missing_token_handling(self, mock_get_client):
        """Test that missing/empty tokens are handled."""
        # Arrange
        mock_client = MagicMock()
        mock_client.get_signing_key_from_jwt.side_effect = InvalidTokenError(
            "Not enough segments"
        )
        mock_get_client.return_value = mock_client

        # Act & Assert
        with pytest.raises(InvalidTokenError):
            verify_jwt_token("")

    @patch("app.core.security.get_jwks_client")
    @patch("app.core.security.jwt.decode")
    def test_rs256_algorithm_enforced(self, mock_decode, mock_get_client):
        """Test that only RS256 algorithm is allowed."""
        # Arrange
        mock_client = MagicMock()
        mock_signing_key = MagicMock()
        mock_signing_key.key = "test-key"
        mock_client.get_signing_key_from_jwt.return_value = mock_signing_key
        mock_get_client.return_value = mock_client

        mock_decode.return_value = {"sub": "user-123", "exp": 0, "iat": 0}

        # Act
        verify_jwt_token("valid.jwt.token")

        # Assert - verify RS256 is in the algorithms list
        call_kwargs = mock_decode.call_args[1]
        assert "algorithms" in call_kwargs
        assert call_kwargs["algorithms"] == ["RS256"]


class TestResetJwksClient:
    """Tests for the reset_jwks_client function."""

    def test_reset_clears_client(self):
        """Test that reset_jwks_client clears the singleton."""
        # This should not raise any errors
        reset_jwks_client()
        # The client should be None after reset
        # We can't directly test the global, but we can verify no exception is raised
        reset_jwks_client()  # Second call should also work
