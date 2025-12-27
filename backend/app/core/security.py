"""JWT/JWKS security module for Better Auth integration."""

import logging
from typing import Any

import jwt
from jwt import PyJWKClient
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize JWKS client with caching
# This client fetches and caches the public keys from Better Auth
_jwks_client: PyJWKClient | None = None


def get_jwks_client() -> PyJWKClient:
    """Get or create the JWKS client singleton."""
    global _jwks_client
    if _jwks_client is None:
        # Better Auth exposes JWKS at /api/auth/jwks by default
        jwks_uri = f"{settings.BETTER_AUTH_URL}/api/auth/jwks"
        _jwks_client = PyJWKClient(
            uri=jwks_uri,
            cache_keys=True,
            max_cached_keys=16,
            cache_jwk_set=True,
            lifespan=settings.JWKS_CACHE_TTL,
            timeout=30,
        )
        logger.info(f"Initialized JWKS client with URI: {jwks_uri}")
    return _jwks_client


def verify_jwt_token(token: str) -> dict[str, Any]:
    """
    Verify a JWT token using JWKS from Better Auth.

    Args:
        token: The JWT token string to verify

    Returns:
        dict: The decoded JWT claims if valid

    Raises:
        ExpiredSignatureError: If the token has expired
        InvalidTokenError: If the token is invalid (bad signature, malformed, etc.)
    """
    try:
        jwks_client = get_jwks_client()

        # Get the signing key from the token's 'kid' header
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and verify the token
        # Only allow RS256 algorithm to prevent algorithm confusion attacks
        # Better Auth sets audience to its own URL (BETTER_AUTH_URL) by default
        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.BETTER_AUTH_URL,
            issuer=settings.BETTER_AUTH_URL,
            options={
                "verify_exp": True,
                "verify_iat": True,
                "verify_aud": True,
                "verify_iss": True,
                "require": ["sub", "exp", "iat"],
            },
        )

        logger.info(
            "JWT verification successful",
            extra={
                "user_id": decoded.get("sub"),
                "email": decoded.get("email"),
                "event": "auth_success",
            },
        )
        return decoded

    except ExpiredSignatureError:
        logger.warning(
            "JWT token has expired",
            extra={"event": "auth_token_expired"},
        )
        raise

    except InvalidTokenError as e:
        logger.warning(
            f"Invalid JWT token: {e}",
            extra={"event": "auth_invalid_token", "error": str(e)},
        )
        raise


def reset_jwks_client() -> None:
    """Reset the JWKS client (useful for testing or config changes)."""
    global _jwks_client
    _jwks_client = None
    logger.info("JWKS client has been reset")
