"""End-to-end integration tests for complete user workflows."""

from datetime import datetime, timedelta

import pytest
from httpx import AsyncClient

from app.models.task import Priority


class TestCompleteTaskWorkflow:
    """Test a complete user workflow: create project, tags, tasks, organize, complete."""

    @pytest.mark.asyncio
    async def test_complete_task_management_workflow(self, client: AsyncClient, test_user):
        """
        Complete workflow test:
        1. Create a project for organizing tasks
        2. Create tags for categorization
        3. Create tasks in the project
        4. Add tags to tasks
        5. Filter and search tasks
        6. Complete tasks
        7. Delete completed tasks
        8. Clean up project
        """
        # =====================
        # Step 1: Create Project
        # =====================
        project_response = await client.post(
            "/api/v1/projects/",
            json={
                "name": "Q4 Goals",
                "description": "Fourth quarter objectives",
            },
        )
        assert project_response.status_code == 201
        project = project_response.json()
        project_id = project["id"]
        assert project["name"] == "Q4 Goals"

        # =====================
        # Step 2: Create Tags
        # =====================
        tag1_response = await client.post(
            "/api/v1/tags/",
            json={"label": "urgent", "color": "#FF0000"},
        )
        assert tag1_response.status_code == 201
        urgent_tag = tag1_response.json()

        tag2_response = await client.post(
            "/api/v1/tags/",
            json={"label": "meeting", "color": "#0000FF"},
        )
        assert tag2_response.status_code == 201
        meeting_tag = tag2_response.json()

        tag3_response = await client.post(
            "/api/v1/tags/",
            json={"label": "review", "color": "#00FF00"},
        )
        assert tag3_response.status_code == 201
        review_tag = tag3_response.json()

        # =====================
        # Step 3: Create Tasks
        # =====================
        # Task 1: High priority with deadline
        deadline = (datetime.utcnow() + timedelta(days=3)).isoformat()
        task1_response = await client.post(
            "/api/v1/tasks/",
            json={
                "title": "Prepare quarterly report",
                "description": "Compile all metrics for Q4 review",
                "priority": Priority.HIGH,
                "deadline": deadline,
                "project_id": project_id,
                "time_estimate": 240,
            },
        )
        assert task1_response.status_code == 201
        task1 = task1_response.json()

        # Task 2: Medium priority
        task2_response = await client.post(
            "/api/v1/tasks/",
            json={
                "title": "Review team feedback",
                "description": "Go through team performance reviews",
                "priority": Priority.MEDIUM,
                "project_id": project_id,
            },
        )
        assert task2_response.status_code == 201
        task2 = task2_response.json()

        # Task 3: Low priority without project (inbox)
        task3_response = await client.post(
            "/api/v1/tasks/",
            json={
                "title": "Schedule team meeting",
                "description": "Book conference room for Q4 kickoff",
                "priority": Priority.LOW,
            },
        )
        assert task3_response.status_code == 201
        task3 = task3_response.json()

        # =====================
        # Step 4: Add Tags to Tasks
        # =====================
        # Add urgent and review tags to task1
        await client.post(f"/api/v1/tasks/{task1['id']}/tags/{urgent_tag['id']}")
        await client.post(f"/api/v1/tasks/{task1['id']}/tags/{review_tag['id']}")

        # Add review tag to task2
        await client.post(f"/api/v1/tasks/{task2['id']}/tags/{review_tag['id']}")

        # Add meeting tag to task3
        await client.post(f"/api/v1/tasks/{task3['id']}/tags/{meeting_tag['id']}")

        # Verify tags were added
        task1_updated = await client.get(f"/api/v1/tasks/{task1['id']}")
        assert len(task1_updated.json()["tag_ids"]) == 2

        # =====================
        # Step 5: Filter and Search
        # =====================
        # Filter by project
        project_tasks = await client.get(f"/api/v1/tasks/?project_id={project_id}")
        assert project_tasks.status_code == 200
        assert project_tasks.json()["total"] == 2

        # Filter by priority
        high_priority = await client.get(f"/api/v1/tasks/?priority={Priority.HIGH}")
        assert high_priority.status_code == 200
        assert high_priority.json()["total"] == 1

        # Search by keyword
        search_results = await client.get("/api/v1/tasks/?search=quarterly")
        assert search_results.status_code == 200
        assert search_results.json()["total"] >= 1

        # Filter by tag
        urgent_tasks = await client.get(f"/api/v1/tasks/?tag_ids={urgent_tag['id']}")
        assert urgent_tasks.status_code == 200
        assert urgent_tasks.json()["total"] == 1

        # Filter by multiple tags (AND)
        review_urgent = await client.get(
            f"/api/v1/tasks/?tag_ids={urgent_tag['id']}&tag_ids={review_tag['id']}"
        )
        assert review_urgent.status_code == 200
        assert review_urgent.json()["total"] == 1  # Only task1 has both

        # =====================
        # Step 6: Complete Tasks
        # =====================
        # Complete task1
        toggle_response = await client.patch(f"/api/v1/tasks/{task1['id']}/complete")
        assert toggle_response.status_code == 200
        assert toggle_response.json()["is_completed"] is True

        # Verify completed count
        completed_tasks = await client.get("/api/v1/tasks/?is_completed=true")
        assert completed_tasks.status_code == 200
        assert completed_tasks.json()["total"] == 1

        active_tasks = await client.get("/api/v1/tasks/?is_completed=false")
        assert active_tasks.status_code == 200
        assert active_tasks.json()["total"] == 2

        # =====================
        # Step 7: Update and Delete
        # =====================
        # Update task2 to critical priority
        update_response = await client.patch(
            f"/api/v1/tasks/{task2['id']}",
            json={"priority": Priority.CRITICAL},
        )
        assert update_response.status_code == 200
        assert update_response.json()["priority"] == Priority.CRITICAL

        # Delete completed task1
        delete_response = await client.delete(f"/api/v1/tasks/{task1['id']}")
        assert delete_response.status_code == 204

        # Verify deletion
        get_deleted = await client.get(f"/api/v1/tasks/{task1['id']}")
        assert get_deleted.status_code == 404

        # =====================
        # Step 8: Project Cleanup
        # =====================
        # Delete the project (tasks should be moved to inbox)
        project_delete = await client.delete(f"/api/v1/projects/{project_id}")
        assert project_delete.status_code == 204

        # Verify task2 still exists but without project
        task2_after = await client.get(f"/api/v1/tasks/{task2['id']}")
        assert task2_after.status_code == 200
        # Project ID should be None now (moved to inbox)
        assert task2_after.json()["project_id"] is None

        # Clean up remaining tasks
        await client.delete(f"/api/v1/tasks/{task2['id']}")
        await client.delete(f"/api/v1/tasks/{task3['id']}")

        # Clean up tags
        await client.delete(f"/api/v1/tags/{urgent_tag['id']}")
        await client.delete(f"/api/v1/tags/{meeting_tag['id']}")
        await client.delete(f"/api/v1/tags/{review_tag['id']}")


class TestProjectWorkflow:
    """Test project management workflow."""

    @pytest.mark.asyncio
    async def test_project_with_tasks_workflow(self, client: AsyncClient, test_user):
        """Test creating a project, adding tasks, and verifying task counts."""
        # Create project
        project_response = await client.post(
            "/api/v1/projects/",
            json={"name": "Sprint 42", "description": "Two-week sprint"},
        )
        assert project_response.status_code == 201
        project = project_response.json()
        project_id = project["id"]

        # Create tasks in project
        for i in range(5):
            await client.post(
                "/api/v1/tasks/",
                json={
                    "title": f"Sprint Task {i + 1}",
                    "project_id": project_id,
                },
            )

        # List project tasks
        tasks = await client.get(f"/api/v1/tasks/?project_id={project_id}")
        assert tasks.json()["total"] == 5

        # Get project with task counts
        project_detail = await client.get(f"/api/v1/projects/{project_id}")
        assert project_detail.status_code == 200
        project_data = project_detail.json()
        assert project_data["task_count"] == 5
        assert project_data["completed_task_count"] == 0

        # Complete 2 tasks
        all_tasks = tasks.json()["items"]
        await client.patch(f"/api/v1/tasks/{all_tasks[0]['id']}/complete")
        await client.patch(f"/api/v1/tasks/{all_tasks[1]['id']}/complete")

        # Verify updated counts
        project_updated = await client.get(f"/api/v1/projects/{project_id}")
        assert project_updated.json()["task_count"] == 5
        assert project_updated.json()["completed_task_count"] == 2

        # Clean up
        await client.delete(f"/api/v1/projects/{project_id}")


class TestTagWorkflow:
    """Test tag management workflow."""

    @pytest.mark.asyncio
    async def test_tag_application_workflow(self, client: AsyncClient, test_user):
        """Test creating tags and applying them to multiple tasks."""
        # Create tags
        priority_tag = (
            await client.post("/api/v1/tags/", json={"label": "priority", "color": "#FF0000"})
        ).json()
        bug_tag = (
            await client.post("/api/v1/tags/", json={"label": "bug", "color": "#FFAA00"})
        ).json()

        # Create tasks
        task1 = (
            await client.post("/api/v1/tasks/", json={"title": "Fix login bug"})
        ).json()
        task2 = (
            await client.post("/api/v1/tasks/", json={"title": "Fix payment bug"})
        ).json()
        task3 = (
            await client.post("/api/v1/tasks/", json={"title": "Add feature X"})
        ).json()

        # Apply tags
        await client.post(f"/api/v1/tasks/{task1['id']}/tags/{bug_tag['id']}")
        await client.post(f"/api/v1/tasks/{task1['id']}/tags/{priority_tag['id']}")
        await client.post(f"/api/v1/tasks/{task2['id']}/tags/{bug_tag['id']}")
        await client.post(f"/api/v1/tasks/{task3['id']}/tags/{priority_tag['id']}")

        # Verify tag counts via filtering
        bug_tasks = await client.get(f"/api/v1/tasks/?tag_ids={bug_tag['id']}")
        assert bug_tasks.json()["total"] == 2

        priority_tasks = await client.get(f"/api/v1/tasks/?tag_ids={priority_tag['id']}")
        assert priority_tasks.json()["total"] == 2

        # Both tags (AND)
        both_tags = await client.get(
            f"/api/v1/tasks/?tag_ids={bug_tag['id']}&tag_ids={priority_tag['id']}"
        )
        assert both_tags.json()["total"] == 1  # Only task1

        # Remove tag from task
        await client.delete(f"/api/v1/tasks/{task1['id']}/tags/{bug_tag['id']}")
        task1_updated = await client.get(f"/api/v1/tasks/{task1['id']}")
        assert len(task1_updated.json()["tag_ids"]) == 1

        # Delete tag (should cascade)
        await client.delete(f"/api/v1/tags/{bug_tag['id']}")
        task2_updated = await client.get(f"/api/v1/tasks/{task2['id']}")
        assert len(task2_updated.json()["tag_ids"]) == 0

        # Clean up
        await client.delete(f"/api/v1/tasks/{task1['id']}")
        await client.delete(f"/api/v1/tasks/{task2['id']}")
        await client.delete(f"/api/v1/tasks/{task3['id']}")
        await client.delete(f"/api/v1/tags/{priority_tag['id']}")


class TestSortingWorkflow:
    """Test sorting across different scenarios."""

    @pytest.mark.asyncio
    async def test_task_sorting_workflow(self, client: AsyncClient, test_user):
        """Test sorting tasks by different criteria."""
        now = datetime.utcnow()

        # Create tasks with different priorities and deadlines
        task1 = (
            await client.post(
                "/api/v1/tasks/",
                json={
                    "title": "Alpha Task",
                    "priority": Priority.LOW,
                    "deadline": (now + timedelta(days=5)).isoformat(),
                },
            )
        ).json()

        task2 = (
            await client.post(
                "/api/v1/tasks/",
                json={
                    "title": "Beta Task",
                    "priority": Priority.CRITICAL,
                    "deadline": (now + timedelta(days=1)).isoformat(),
                },
            )
        ).json()

        task3 = (
            await client.post(
                "/api/v1/tasks/",
                json={
                    "title": "Gamma Task",
                    "priority": Priority.HIGH,
                    "deadline": (now + timedelta(days=3)).isoformat(),
                },
            )
        ).json()

        # Sort by title ascending
        by_title = await client.get("/api/v1/tasks/?sort_by=title&sort_order=asc")
        items = by_title.json()["items"]
        assert items[0]["title"] == "Alpha Task"
        assert items[1]["title"] == "Beta Task"
        assert items[2]["title"] == "Gamma Task"

        # Sort by priority ascending (0=CRITICAL first)
        by_priority = await client.get("/api/v1/tasks/?sort_by=priority&sort_order=asc")
        items = by_priority.json()["items"]
        assert items[0]["priority"] == Priority.CRITICAL
        assert items[-1]["priority"] == Priority.LOW

        # Sort by deadline ascending (soonest first)
        by_deadline = await client.get("/api/v1/tasks/?sort_by=deadline&sort_order=asc")
        items = by_deadline.json()["items"]
        assert items[0]["title"] == "Beta Task"  # 1 day
        assert items[1]["title"] == "Gamma Task"  # 3 days
        assert items[2]["title"] == "Alpha Task"  # 5 days

        # Clean up
        await client.delete(f"/api/v1/tasks/{task1['id']}")
        await client.delete(f"/api/v1/tasks/{task2['id']}")
        await client.delete(f"/api/v1/tasks/{task3['id']}")
