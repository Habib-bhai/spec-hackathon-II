"""Unit tests for TaskService."""

from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest

from app.core.exceptions import ResourceNotFoundError, ValidationError
from app.models.task import Priority, Task
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.task_service import TaskService


@pytest.fixture
def mock_session():
    """Create a mock async session."""
    session = AsyncMock()
    session.add = MagicMock()
    return session


@pytest.fixture
def user_id():
    """Generate a test user ID."""
    return uuid4()


@pytest.fixture
def sample_task(user_id):
    """Create a sample task for testing."""
    return Task(
        id=uuid4(),
        title="Test Task",
        description="Test description",
        priority=Priority.MEDIUM,
        deadline=datetime.utcnow() + timedelta(days=7),
        time_estimate=60,
        is_completed=False,
        user_id=user_id,
        project_id=None,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )


class TestTaskServiceCreate:
    """Tests for TaskService.create method."""

    @pytest.mark.asyncio
    async def test_create_task_success(self, mock_session, user_id):
        """Test successful task creation."""
        task_data = TaskCreate(
            title="New Task",
            description="Task description",
            priority=Priority.HIGH,
        )

        service = TaskService(mock_session)

        # Mock the session behavior
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()

        task = await service.create(user_id, task_data)

        assert task.title == "New Task"
        assert task.description == "Task description"
        assert task.priority == Priority.HIGH
        assert task.user_id == user_id
        assert task.is_completed is False
        mock_session.add.assert_called_once()
        mock_session.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_task_with_deadline(self, mock_session, user_id):
        """Test task creation with deadline."""
        deadline = datetime.utcnow() + timedelta(days=3)
        task_data = TaskCreate(
            title="Urgent Task",
            deadline=deadline,
            priority=Priority.CRITICAL,
        )

        service = TaskService(mock_session)
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()

        task = await service.create(user_id, task_data)

        assert task.deadline == deadline
        assert task.priority == Priority.CRITICAL


class TestTaskServiceGet:
    """Tests for TaskService.get method."""

    @pytest.mark.asyncio
    async def test_get_task_success(self, mock_session, user_id, sample_task):
        """Test successful task retrieval."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)

        service = TaskService(mock_session)
        task = await service.get(sample_task.id, user_id)

        assert task.id == sample_task.id
        assert task.title == sample_task.title

    @pytest.mark.asyncio
    async def test_get_task_not_found(self, mock_session, user_id):
        """Test task retrieval when task doesn't exist."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute = AsyncMock(return_value=mock_result)

        service = TaskService(mock_session)
        task_id = uuid4()

        with pytest.raises(ResourceNotFoundError) as exc_info:
            await service.get(task_id, user_id)

        assert "Task" in str(exc_info.value)


class TestTaskServiceUpdate:
    """Tests for TaskService.update method."""

    @pytest.mark.asyncio
    async def test_update_task_title(self, mock_session, user_id, sample_task):
        """Test updating task title."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()

        service = TaskService(mock_session)
        update_data = TaskUpdate(title="Updated Title")

        task = await service.update(sample_task.id, user_id, update_data)

        assert task.title == "Updated Title"

    @pytest.mark.asyncio
    async def test_update_task_completion(self, mock_session, user_id, sample_task):
        """Test updating task completion status."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()

        service = TaskService(mock_session)
        update_data = TaskUpdate(is_completed=True)

        task = await service.update(sample_task.id, user_id, update_data)

        assert task.is_completed is True


class TestTaskServiceDelete:
    """Tests for TaskService.delete method."""

    @pytest.mark.asyncio
    async def test_delete_task_success(self, mock_session, user_id, sample_task):
        """Test successful task deletion."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.delete = AsyncMock()
        mock_session.commit = AsyncMock()

        service = TaskService(mock_session)
        await service.delete(sample_task.id, user_id)

        mock_session.delete.assert_called_once_with(sample_task)
        mock_session.commit.assert_called_once()


class TestTaskServiceToggleComplete:
    """Tests for TaskService.toggle_complete method."""

    @pytest.mark.asyncio
    async def test_toggle_incomplete_to_complete(self, mock_session, user_id, sample_task):
        """Test toggling task from incomplete to complete."""
        sample_task.is_completed = False
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()

        service = TaskService(mock_session)
        task = await service.toggle_complete(sample_task.id, user_id)

        assert task.is_completed is True

    @pytest.mark.asyncio
    async def test_toggle_complete_to_incomplete(self, mock_session, user_id, sample_task):
        """Test toggling task from complete to incomplete."""
        sample_task.is_completed = True
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()

        service = TaskService(mock_session)
        task = await service.toggle_complete(sample_task.id, user_id)

        assert task.is_completed is False


class TestTaskOverdueProperty:
    """Tests for Task.is_overdue property."""

    def test_task_is_overdue_past_deadline(self, user_id):
        """Test that task is overdue when past deadline."""
        task = Task(
            id=uuid4(),
            title="Overdue Task",
            deadline=datetime.utcnow() - timedelta(days=1),
            is_completed=False,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        assert task.is_overdue is True

    def test_task_not_overdue_future_deadline(self, user_id):
        """Test that task is not overdue when deadline is in future."""
        task = Task(
            id=uuid4(),
            title="Future Task",
            deadline=datetime.utcnow() + timedelta(days=1),
            is_completed=False,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        assert task.is_overdue is False

    def test_completed_task_not_overdue(self, user_id):
        """Test that completed task is never overdue."""
        task = Task(
            id=uuid4(),
            title="Completed Task",
            deadline=datetime.utcnow() - timedelta(days=1),
            is_completed=True,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        assert task.is_overdue is False

    def test_task_no_deadline_not_overdue(self, user_id):
        """Test that task without deadline is never overdue."""
        task = Task(
            id=uuid4(),
            title="No Deadline Task",
            deadline=None,
            is_completed=False,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        assert task.is_overdue is False
