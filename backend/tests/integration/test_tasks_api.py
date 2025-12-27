"""Integration tests for task API endpoints."""

from datetime import datetime, timedelta
from uuid import UUID, uuid4

import pytest
from httpx import AsyncClient

from app.models.task import Priority


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


class TestCreateTask:
    """Tests for POST /api/v1/tasks endpoint."""

    @pytest.mark.asyncio
    async def test_create_task_minimal(self, client: AsyncClient, test_user):
        """Test creating a task with minimal data."""
        response = await client.post(
            "/api/v1/tasks/",
            json={"title": "My Task"},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "My Task"
        assert data["priority"] == Priority.MEDIUM  # default
        assert data["is_completed"] is False
        assert data["user_id"] == str(TEST_USER_ID)
        assert "id" in data

    @pytest.mark.asyncio
    async def test_create_task_full(self, client: AsyncClient, test_user):
        """Test creating a task with all fields."""
        deadline = (datetime.utcnow() + timedelta(days=7)).isoformat()
        response = await client.post(
            "/api/v1/tasks/",
            json={
                "title": "Complete Task",
                "description": "A full task description",
                "priority": Priority.HIGH,
                "deadline": deadline,
                "time_estimate": 120,
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Complete Task"
        assert data["description"] == "A full task description"
        assert data["priority"] == Priority.HIGH
        assert data["time_estimate"] == 120

    @pytest.mark.asyncio
    async def test_create_task_empty_title_fails(self, client: AsyncClient, test_user):
        """Test that creating a task with empty title fails."""
        response = await client.post(
            "/api/v1/tasks/",
            json={"title": ""},
        )

        assert response.status_code == 422


class TestListTasks:
    """Tests for GET /api/v1/tasks endpoint."""

    @pytest.mark.asyncio
    async def test_list_tasks_empty(self, client: AsyncClient, test_user):
        """Test listing tasks when none exist."""
        response = await client.get("/api/v1/tasks/")

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["page"] == 1

    @pytest.mark.asyncio
    async def test_list_tasks_with_data(self, client: AsyncClient, test_user):
        """Test listing tasks after creating some."""
        # Create tasks
        await client.post("/api/v1/tasks/", json={"title": "Task 1"})
        await client.post("/api/v1/tasks/", json={"title": "Task 2"})

        response = await client.get("/api/v1/tasks/")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total"] == 2

    @pytest.mark.asyncio
    async def test_list_tasks_pagination(self, client: AsyncClient, test_user):
        """Test task list pagination."""
        # Create multiple tasks
        for i in range(5):
            await client.post("/api/v1/tasks/", json={"title": f"Task {i}"})

        response = await client.get("/api/v1/tasks/?page=1&page_size=2")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total"] == 5
        assert data["pages"] == 3

    @pytest.mark.asyncio
    async def test_list_tasks_filter_completed(self, client: AsyncClient, test_user):
        """Test filtering tasks by completion status."""
        # Create tasks
        task_response = await client.post("/api/v1/tasks/", json={"title": "Completed Task"})
        task_id = task_response.json()["id"]
        await client.patch(f"/api/v1/tasks/{task_id}/complete")
        await client.post("/api/v1/tasks/", json={"title": "Incomplete Task"})

        # Filter completed
        response = await client.get("/api/v1/tasks/?is_completed=true")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["is_completed"] is True

        # Filter incomplete
        response = await client.get("/api/v1/tasks/?is_completed=false")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["is_completed"] is False

    @pytest.mark.asyncio
    async def test_list_tasks_filter_priority(self, client: AsyncClient, test_user):
        """Test filtering tasks by priority."""
        await client.post("/api/v1/tasks/", json={"title": "High", "priority": Priority.HIGH})
        await client.post("/api/v1/tasks/", json={"title": "Low", "priority": Priority.LOW})

        response = await client.get(f"/api/v1/tasks/?priority={Priority.HIGH}")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["priority"] == Priority.HIGH


class TestGetTask:
    """Tests for GET /api/v1/tasks/{task_id} endpoint."""

    @pytest.mark.asyncio
    async def test_get_task_success(self, client: AsyncClient, test_user):
        """Test getting a specific task."""
        create_response = await client.post(
            "/api/v1/tasks/",
            json={"title": "Get This Task"},
        )
        task_id = create_response.json()["id"]

        response = await client.get(f"/api/v1/tasks/{task_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == "Get This Task"

    @pytest.mark.asyncio
    async def test_get_task_not_found(self, client: AsyncClient, test_user):
        """Test getting a non-existent task."""
        fake_id = uuid4()
        response = await client.get(f"/api/v1/tasks/{fake_id}")

        assert response.status_code == 404


class TestUpdateTask:
    """Tests for PATCH /api/v1/tasks/{task_id} endpoint."""

    @pytest.mark.asyncio
    async def test_update_task_title(self, client: AsyncClient, test_user):
        """Test updating task title."""
        create_response = await client.post(
            "/api/v1/tasks/",
            json={"title": "Original Title"},
        )
        task_id = create_response.json()["id"]

        response = await client.patch(
            f"/api/v1/tasks/{task_id}",
            json={"title": "Updated Title"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

    @pytest.mark.asyncio
    async def test_update_task_priority(self, client: AsyncClient, test_user):
        """Test updating task priority."""
        create_response = await client.post(
            "/api/v1/tasks/",
            json={"title": "Task", "priority": Priority.LOW},
        )
        task_id = create_response.json()["id"]

        response = await client.patch(
            f"/api/v1/tasks/{task_id}",
            json={"priority": Priority.CRITICAL},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["priority"] == Priority.CRITICAL

    @pytest.mark.asyncio
    async def test_update_task_not_found(self, client: AsyncClient, test_user):
        """Test updating a non-existent task."""
        fake_id = uuid4()
        response = await client.patch(
            f"/api/v1/tasks/{fake_id}",
            json={"title": "New Title"},
        )

        assert response.status_code == 404


class TestDeleteTask:
    """Tests for DELETE /api/v1/tasks/{task_id} endpoint."""

    @pytest.mark.asyncio
    async def test_delete_task_success(self, client: AsyncClient, test_user):
        """Test deleting a task."""
        create_response = await client.post(
            "/api/v1/tasks/",
            json={"title": "Delete Me"},
        )
        task_id = create_response.json()["id"]

        response = await client.delete(f"/api/v1/tasks/{task_id}")
        assert response.status_code == 204

        # Verify it's deleted
        get_response = await client.get(f"/api/v1/tasks/{task_id}")
        assert get_response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_task_not_found(self, client: AsyncClient, test_user):
        """Test deleting a non-existent task."""
        fake_id = uuid4()
        response = await client.delete(f"/api/v1/tasks/{fake_id}")

        assert response.status_code == 404


class TestToggleTaskComplete:
    """Tests for PATCH /api/v1/tasks/{task_id}/complete endpoint."""

    @pytest.mark.asyncio
    async def test_toggle_to_complete(self, client: AsyncClient, test_user):
        """Test toggling task to completed."""
        create_response = await client.post(
            "/api/v1/tasks/",
            json={"title": "Toggle Me"},
        )
        task_id = create_response.json()["id"]

        response = await client.patch(f"/api/v1/tasks/{task_id}/complete")

        assert response.status_code == 200
        data = response.json()
        assert data["is_completed"] is True

    @pytest.mark.asyncio
    async def test_toggle_to_incomplete(self, client: AsyncClient, test_user):
        """Test toggling task back to incomplete."""
        create_response = await client.post(
            "/api/v1/tasks/",
            json={"title": "Toggle Me"},
        )
        task_id = create_response.json()["id"]

        # Toggle to complete
        await client.patch(f"/api/v1/tasks/{task_id}/complete")

        # Toggle back to incomplete
        response = await client.patch(f"/api/v1/tasks/{task_id}/complete")

        assert response.status_code == 200
        data = response.json()
        assert data["is_completed"] is False
