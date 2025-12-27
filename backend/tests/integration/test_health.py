"""Integration tests for health check API endpoints."""

import pytest
from httpx import AsyncClient


class TestHealthEndpoint:
    """Tests for GET /api/v1/health endpoint."""

    @pytest.mark.asyncio
    async def test_health_check_returns_healthy(self, client: AsyncClient):
        """Test that health check returns healthy status."""
        response = await client.get("/api/v1/health/")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data

    @pytest.mark.asyncio
    async def test_health_check_has_version(self, client: AsyncClient):
        """Test that health check includes version information."""
        response = await client.get("/api/v1/health/")

        assert response.status_code == 200
        data = response.json()
        assert data["version"] == "0.1.0"


class TestDatabaseHealthEndpoint:
    """Tests for GET /api/v1/health/db endpoint."""

    @pytest.mark.asyncio
    async def test_database_health_returns_healthy(self, client: AsyncClient):
        """Test that database health check returns healthy status."""
        response = await client.get("/api/v1/health/db")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database_connected"] is True
        assert "timestamp" in data
        assert "latency_ms" in data

    @pytest.mark.asyncio
    async def test_database_health_has_latency(self, client: AsyncClient):
        """Test that database health check includes latency information."""
        response = await client.get("/api/v1/health/db")

        assert response.status_code == 200
        data = response.json()
        assert data["latency_ms"] is not None
        assert data["latency_ms"] >= 0
