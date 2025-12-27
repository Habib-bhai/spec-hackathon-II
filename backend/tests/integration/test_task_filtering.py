"""Integration tests for task filtering, searching, and sorting."""

from datetime import datetime, timedelta
from uuid import UUID

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


@pytest.fixture
async def test_project(client: AsyncClient, test_user):
    """Create a test project."""
    response = await client.post(
        "/api/v1/projects/",
        json={"name": "Test Project", "description": "For filtering tests"},
    )
    return response.json()


@pytest.fixture
async def test_tags(client: AsyncClient, test_user):
    """Create test tags."""
    tag1 = await client.post(
        "/api/v1/tags/", json={"label": "urgent", "color": "#FF0000"}
    )
    tag2 = await client.post(
        "/api/v1/tags/", json={"label": "work", "color": "#0000FF"}
    )
    return [tag1.json(), tag2.json()]


@pytest.fixture
async def sample_tasks(client: AsyncClient, test_user, test_project, test_tags):
    """Create a variety of sample tasks for filtering tests."""
    now = datetime.utcnow()
    tasks = []

    # Task 1: High priority, completed, with deadline in past
    task1 = await client.post(
        "/api/v1/tasks/",
        json={
            "title": "Urgent report submission",
            "description": "Complete the quarterly report",
            "priority": Priority.HIGH,
            "deadline": (now - timedelta(days=1)).isoformat(),
            "project_id": test_project["id"],
        },
    )
    task1_data = task1.json()
    await client.patch(f"/api/v1/tasks/{task1_data['id']}/complete")
    tasks.append(task1_data)

    # Task 2: Medium priority, not completed, deadline in future
    task2 = await client.post(
        "/api/v1/tasks/",
        json={
            "title": "Review code changes",
            "description": "Review the pull request from team",
            "priority": Priority.MEDIUM,
            "deadline": (now + timedelta(days=7)).isoformat(),
        },
    )
    tasks.append(task2.json())

    # Task 3: Low priority, not completed, no deadline
    task3 = await client.post(
        "/api/v1/tasks/",
        json={
            "title": "Organize files",
            "description": "Clean up the documentation folder",
            "priority": Priority.LOW,
        },
    )
    tasks.append(task3.json())

    # Task 4: Critical priority, not completed, deadline tomorrow
    task4 = await client.post(
        "/api/v1/tasks/",
        json={
            "title": "Fix critical bug",
            "description": "Production server down",
            "priority": Priority.CRITICAL,
            "deadline": (now + timedelta(days=1)).isoformat(),
            "project_id": test_project["id"],
        },
    )
    tasks.append(task4.json())

    # Task 5: Medium priority, no description
    task5 = await client.post(
        "/api/v1/tasks/",
        json={
            "title": "Meeting preparation",
            "priority": Priority.MEDIUM,
            "deadline": (now + timedelta(days=3)).isoformat(),
        },
    )
    tasks.append(task5.json())

    # Add tags to some tasks
    await client.post(f"/api/v1/tasks/{tasks[0]['id']}/tags/{test_tags[0]['id']}")
    await client.post(f"/api/v1/tasks/{tasks[0]['id']}/tags/{test_tags[1]['id']}")
    await client.post(f"/api/v1/tasks/{tasks[3]['id']}/tags/{test_tags[0]['id']}")

    return tasks


class TestDeadlineFiltering:
    """Tests for deadline range filtering."""

    @pytest.mark.asyncio
    async def test_filter_deadline_before(self, client: AsyncClient, sample_tasks):
        """Test filtering tasks with deadline before a date."""
        now = datetime.utcnow()
        future_date = (now + timedelta(days=2)).isoformat()

        response = await client.get(f"/api/v1/tasks/?deadline_before={future_date}")

        assert response.status_code == 200
        data = response.json()
        # Should include task 1 (past), task 4 (tomorrow)
        for task in data["items"]:
            if task["deadline"]:
                assert datetime.fromisoformat(task["deadline"].replace("Z", "")) <= datetime.fromisoformat(future_date)

    @pytest.mark.asyncio
    async def test_filter_deadline_after(self, client: AsyncClient, sample_tasks):
        """Test filtering tasks with deadline after a date."""
        now = datetime.utcnow()
        today = now.isoformat()

        response = await client.get(f"/api/v1/tasks/?deadline_after={today}")

        assert response.status_code == 200
        data = response.json()
        # All tasks with deadline after today
        for task in data["items"]:
            if task["deadline"]:
                assert datetime.fromisoformat(task["deadline"].replace("Z", "")) >= datetime.fromisoformat(today)

    @pytest.mark.asyncio
    async def test_filter_deadline_range(self, client: AsyncClient, sample_tasks):
        """Test filtering tasks within a deadline range."""
        now = datetime.utcnow()
        start_date = now.isoformat()
        end_date = (now + timedelta(days=5)).isoformat()

        response = await client.get(
            f"/api/v1/tasks/?deadline_after={start_date}&deadline_before={end_date}"
        )

        assert response.status_code == 200
        data = response.json()
        for task in data["items"]:
            if task["deadline"]:
                deadline = datetime.fromisoformat(task["deadline"].replace("Z", ""))
                assert datetime.fromisoformat(start_date) <= deadline <= datetime.fromisoformat(end_date)


class TestTextSearch:
    """Tests for text search functionality."""

    @pytest.mark.asyncio
    async def test_search_title(self, client: AsyncClient, sample_tasks):
        """Test searching by title."""
        response = await client.get("/api/v1/tasks/?search=report")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1
        assert any("report" in task["title"].lower() for task in data["items"])

    @pytest.mark.asyncio
    async def test_search_description(self, client: AsyncClient, sample_tasks):
        """Test searching by description."""
        response = await client.get("/api/v1/tasks/?search=quarterly")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1
        assert any("quarterly" in (task["description"] or "").lower() for task in data["items"])

    @pytest.mark.asyncio
    async def test_search_case_insensitive(self, client: AsyncClient, sample_tasks):
        """Test that search is case-insensitive."""
        response_lower = await client.get("/api/v1/tasks/?search=urgent")
        response_upper = await client.get("/api/v1/tasks/?search=URGENT")
        response_mixed = await client.get("/api/v1/tasks/?search=Urgent")

        assert response_lower.status_code == 200
        assert response_upper.status_code == 200
        assert response_mixed.status_code == 200

        # All should return the same results
        assert response_lower.json()["total"] == response_upper.json()["total"]
        assert response_lower.json()["total"] == response_mixed.json()["total"]

    @pytest.mark.asyncio
    async def test_search_no_results(self, client: AsyncClient, sample_tasks):
        """Test search with no matching results."""
        response = await client.get("/api/v1/tasks/?search=nonexistentxyz123")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 0
        assert data["total"] == 0

    @pytest.mark.asyncio
    async def test_search_partial_match(self, client: AsyncClient, sample_tasks):
        """Test that partial matches work."""
        response = await client.get("/api/v1/tasks/?search=bug")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1


class TestSorting:
    """Tests for sorting functionality."""

    @pytest.mark.asyncio
    async def test_sort_by_created_at_desc(self, client: AsyncClient, sample_tasks):
        """Test sorting by created_at descending (default)."""
        response = await client.get("/api/v1/tasks/?sort_by=created_at&sort_order=desc")

        assert response.status_code == 200
        data = response.json()
        items = data["items"]
        if len(items) > 1:
            for i in range(len(items) - 1):
                assert items[i]["created_at"] >= items[i + 1]["created_at"]

    @pytest.mark.asyncio
    async def test_sort_by_created_at_asc(self, client: AsyncClient, sample_tasks):
        """Test sorting by created_at ascending."""
        response = await client.get("/api/v1/tasks/?sort_by=created_at&sort_order=asc")

        assert response.status_code == 200
        data = response.json()
        items = data["items"]
        if len(items) > 1:
            for i in range(len(items) - 1):
                assert items[i]["created_at"] <= items[i + 1]["created_at"]

    @pytest.mark.asyncio
    async def test_sort_by_priority_desc(self, client: AsyncClient, sample_tasks):
        """Test sorting by priority descending (highest first)."""
        response = await client.get("/api/v1/tasks/?sort_by=priority&sort_order=desc")

        assert response.status_code == 200
        data = response.json()
        items = data["items"]
        # Priority: 0=CRITICAL, 1=HIGH, 2=MEDIUM, 3=LOW
        # Descending = LOW first (higher number)
        if len(items) > 1:
            for i in range(len(items) - 1):
                assert items[i]["priority"] >= items[i + 1]["priority"]

    @pytest.mark.asyncio
    async def test_sort_by_priority_asc(self, client: AsyncClient, sample_tasks):
        """Test sorting by priority ascending (lowest number = highest priority first)."""
        response = await client.get("/api/v1/tasks/?sort_by=priority&sort_order=asc")

        assert response.status_code == 200
        data = response.json()
        items = data["items"]
        if len(items) > 1:
            for i in range(len(items) - 1):
                assert items[i]["priority"] <= items[i + 1]["priority"]

    @pytest.mark.asyncio
    async def test_sort_by_title(self, client: AsyncClient, sample_tasks):
        """Test sorting by title alphabetically."""
        response = await client.get("/api/v1/tasks/?sort_by=title&sort_order=asc")

        assert response.status_code == 200
        data = response.json()
        items = data["items"]
        if len(items) > 1:
            for i in range(len(items) - 1):
                assert items[i]["title"].lower() <= items[i + 1]["title"].lower()


class TestMultiTagFiltering:
    """Tests for filtering by multiple tags."""

    @pytest.mark.asyncio
    async def test_filter_single_tag(self, client: AsyncClient, sample_tasks, test_tags):
        """Test filtering by a single tag."""
        tag_id = test_tags[0]["id"]
        response = await client.get(f"/api/v1/tasks/?tag_ids={tag_id}")

        assert response.status_code == 200
        data = response.json()
        # Tasks 1 and 4 have the "urgent" tag
        assert data["total"] >= 1

    @pytest.mark.asyncio
    async def test_filter_multiple_tags(self, client: AsyncClient, sample_tasks, test_tags):
        """Test filtering by multiple tags (AND logic)."""
        tag1_id = test_tags[0]["id"]
        tag2_id = test_tags[1]["id"]
        response = await client.get(f"/api/v1/tasks/?tag_ids={tag1_id}&tag_ids={tag2_id}")

        assert response.status_code == 200
        data = response.json()
        # Only task 1 has both tags
        assert data["total"] >= 1
        for task in data["items"]:
            assert tag1_id in [str(t) for t in task["tag_ids"]]
            assert tag2_id in [str(t) for t in task["tag_ids"]]


class TestCombinedFiltering:
    """Tests for combining multiple filters."""

    @pytest.mark.asyncio
    async def test_priority_and_completion(self, client: AsyncClient, sample_tasks):
        """Test filtering by priority AND completion status."""
        response = await client.get(
            "/api/v1/tasks/?priority=1&is_completed=true"  # HIGH and completed
        )

        assert response.status_code == 200
        data = response.json()
        for task in data["items"]:
            assert task["priority"] == Priority.HIGH
            assert task["is_completed"] is True

    @pytest.mark.asyncio
    async def test_project_and_search(self, client: AsyncClient, sample_tasks, test_project):
        """Test filtering by project AND search."""
        project_id = test_project["id"]
        response = await client.get(
            f"/api/v1/tasks/?project_id={project_id}&search=bug"
        )

        assert response.status_code == 200
        data = response.json()
        for task in data["items"]:
            assert task["project_id"] == project_id
            assert "bug" in task["title"].lower() or "bug" in (task["description"] or "").lower()

    @pytest.mark.asyncio
    async def test_all_filters_combined(
        self, client: AsyncClient, sample_tasks, test_project
    ):
        """Test combining multiple filter types."""
        now = datetime.utcnow()
        response = await client.get(
            f"/api/v1/tasks/"
            f"?is_completed=false"
            f"&project_id={test_project['id']}"
            f"&deadline_after={now.isoformat()}"
            f"&sort_by=priority"
            f"&sort_order=asc"
        )

        assert response.status_code == 200
        data = response.json()
        for task in data["items"]:
            assert task["is_completed"] is False
            assert task["project_id"] == test_project["id"]


class TestPaginationWithFilters:
    """Tests for pagination combined with filtering."""

    @pytest.mark.asyncio
    async def test_offset_limit_pagination(self, client: AsyncClient, sample_tasks):
        """Test offset/limit pagination."""
        # Get first 2
        response1 = await client.get("/api/v1/tasks/?offset=0&limit=2")
        assert response1.status_code == 200
        data1 = response1.json()
        assert len(data1["items"]) == 2

        # Get next 2
        response2 = await client.get("/api/v1/tasks/?offset=2&limit=2")
        assert response2.status_code == 200
        data2 = response2.json()
        assert len(data2["items"]) == 2

        # Ensure no overlap
        ids1 = {item["id"] for item in data1["items"]}
        ids2 = {item["id"] for item in data2["items"]}
        assert ids1.isdisjoint(ids2)

    @pytest.mark.asyncio
    async def test_pagination_with_filter(self, client: AsyncClient, sample_tasks):
        """Test that pagination works correctly with filters applied."""
        response = await client.get(
            "/api/v1/tasks/?is_completed=false&offset=0&limit=2"
        )

        assert response.status_code == 200
        data = response.json()
        # Verify all returned items match the filter
        for task in data["items"]:
            assert task["is_completed"] is False
        # Total should reflect filtered count, not all tasks
        assert data["total"] >= len(data["items"])
