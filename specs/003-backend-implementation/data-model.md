# Data Model: Backend Implementation

**Feature**: 003-backend-implementation
**Date**: 2025-12-26
**Status**: Complete

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Project   │       │    Tag      │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │       │ id (PK)     │
│ email       │   │   │ name        │       │ label       │
│ display_name│   │   │ description │       │ color       │
│ created_at  │   │   │ user_id (FK)│───────│ user_id (FK)│
└─────────────┘   │   │ created_at  │       │ created_at  │
                  │   │ updated_at  │       └──────┬──────┘
                  │   └──────┬──────┘              │
                  │          │                     │
                  │          │ 0..1                │ 0..*
                  │          ▼                     │
                  │   ┌─────────────┐              │
                  │   │    Task     │              │
                  │   ├─────────────┤              │
                  └───│ user_id (FK)│              │
                      │ id (PK)     │              │
                      │ title       │              │
                      │ description │              │
                      │ priority    │              │
                      │ deadline    │              │
                      │ time_estimate│             │
                      │ is_completed│              │
                      │ project_id  │──────────────┤
                      │ created_at  │              │
                      │ updated_at  │              │
                      └──────┬──────┘              │
                             │                     │
                             │ 0..*           0..* │
                             ▼                     ▼
                      ┌─────────────┐
                      │  TaskTag    │
                      ├─────────────┤
                      │ task_id (FK)│
                      │ tag_id (FK) │
                      │ created_at  │
                      └─────────────┘
```

---

## Entity Definitions

### User

**Purpose**: Represents a registered user authenticated via Better Auth.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier (from Better Auth) |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User's email address |
| display_name | VARCHAR(100) | NOT NULL | User's display name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp (UTC) |

**Relationships**:
- Has many Tasks (1:N)
- Has many Projects (1:N)
- Has many Tags (1:N)

**Notes**:
- User records are created when Better Auth user first accesses the API
- `id` matches Better Auth's `sub` claim in JWT
- No password stored - authentication handled by Better Auth

---

### Task

**Purpose**: Represents a todo item owned by a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| title | VARCHAR(500) | NOT NULL | Task title (max 500 chars) |
| description | TEXT | NULLABLE | Detailed task description |
| priority | ENUM | NOT NULL, DEFAULT 'MEDIUM' | Priority level |
| deadline | TIMESTAMP | NULLABLE | Due date/time (UTC) |
| time_estimate | INTEGER | NULLABLE, CHECK >= 0 | Estimated minutes to complete |
| is_completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| user_id | UUID | FK → User.id, NOT NULL, INDEX | Owner reference |
| project_id | UUID | FK → Project.id, NULLABLE, INDEX | Project assignment (nullable = inbox) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp (UTC) |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp (UTC) |

**Priority Enum Values**:
- `CRITICAL` (0)
- `HIGH` (1)
- `MEDIUM` (2)
- `LOW` (3)

**Relationships**:
- Belongs to one User (N:1)
- Belongs to zero or one Project (N:1, nullable)
- Has many Tags via TaskTag (N:M)

**Computed Fields** (not stored, calculated at runtime):
- `is_overdue`: `deadline IS NOT NULL AND deadline < NOW() AND NOT is_completed`
- `days_until_deadline`: `EXTRACT(DAY FROM deadline - NOW())` when deadline exists

**Indexes**:
- `idx_task_user_id` on (user_id)
- `idx_task_project_id` on (project_id)
- `idx_task_deadline` on (deadline) WHERE deadline IS NOT NULL
- `idx_task_is_completed` on (is_completed)
- `idx_task_priority` on (priority)

---

### Project

**Purpose**: Represents a collection of related tasks for organization.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Project name |
| description | TEXT | NULLABLE | Project description |
| user_id | UUID | FK → User.id, NOT NULL, INDEX | Owner reference |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp (UTC) |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp (UTC) |

**Relationships**:
- Belongs to one User (N:1)
- Has many Tasks (1:N)

**Computed Fields** (not stored, calculated at query time):
- `task_count`: Count of tasks in project
- `completed_task_count`: Count of completed tasks in project

**Indexes**:
- `idx_project_user_id` on (user_id)
- `idx_project_name` on (user_id, name) - for duplicate name check per user

---

### Tag

**Purpose**: Represents a categorization label for flexible task organization.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| label | VARCHAR(50) | NOT NULL | Tag label text |
| color | VARCHAR(7) | NULLABLE, CHECK format | Hex color code (#RRGGBB) |
| user_id | UUID | FK → User.id, NOT NULL, INDEX | Owner reference |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp (UTC) |

**Relationships**:
- Belongs to one User (N:1)
- Applied to many Tasks via TaskTag (N:M)

**Constraints**:
- UNIQUE(user_id, label) - prevents duplicate tag labels per user
- color CHECK: `color ~ '^#[0-9A-Fa-f]{6}$'`

**Indexes**:
- `idx_tag_user_id` on (user_id)
- `idx_tag_user_label` on (user_id, label) UNIQUE

---

### TaskTag (Junction Table)

**Purpose**: Many-to-many relationship between Tasks and Tags.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| task_id | UUID | PK, FK → Task.id, NOT NULL | Task reference |
| tag_id | UUID | PK, FK → Tag.id, NOT NULL | Tag reference |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Association timestamp (UTC) |

**Constraints**:
- PRIMARY KEY(task_id, tag_id)
- ON DELETE CASCADE for both FKs

**Indexes**:
- Primary key index on (task_id, tag_id)
- `idx_tasktag_tag_id` on (tag_id) - for tag-based lookups

---

## SQLModel Definitions

### Priority Enum

```python
from enum import IntEnum

class Priority(IntEnum):
    CRITICAL = 0
    HIGH = 1
    MEDIUM = 2
    LOW = 3
```

### User Model

```python
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(primary_key=True)  # From Better Auth
    email: str = Field(max_length=255, unique=True, index=True)
    display_name: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user")
    projects: List["Project"] = Relationship(back_populates="user")
    tags: List["Tag"] = Relationship(back_populates="user")
```

### Task Model

```python
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=500, index=True)
    description: Optional[str] = None
    priority: Priority = Field(default=Priority.MEDIUM)
    deadline: Optional[datetime] = Field(default=None, index=True)
    time_estimate: Optional[int] = Field(default=None, ge=0)
    is_completed: bool = Field(default=False, index=True)

    user_id: UUID = Field(foreign_key="users.id", index=True)
    project_id: Optional[UUID] = Field(default=None, foreign_key="projects.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    project: Optional["Project"] = Relationship(back_populates="tasks")
    task_tags: List["TaskTag"] = Relationship(back_populates="task")

    @property
    def is_overdue(self) -> bool:
        if self.deadline and not self.is_completed:
            return datetime.utcnow() > self.deadline
        return False

    @property
    def days_until_deadline(self) -> Optional[int]:
        if self.deadline:
            delta = self.deadline - datetime.utcnow()
            return delta.days
        return None
```

### Project Model

```python
class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=100)
    description: Optional[str] = None

    user_id: UUID = Field(foreign_key="users.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="projects")
    tasks: List["Task"] = Relationship(back_populates="project")
```

### Tag Model

```python
class Tag(SQLModel, table=True):
    __tablename__ = "tags"
    __table_args__ = (
        UniqueConstraint("user_id", "label", name="uq_tag_user_label"),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    label: str = Field(max_length=50)
    color: Optional[str] = Field(default=None, max_length=7)  # #RRGGBB

    user_id: UUID = Field(foreign_key="users.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tags")
    task_tags: List["TaskTag"] = Relationship(back_populates="tag")
```

### TaskTag Model

```python
class TaskTag(SQLModel, table=True):
    __tablename__ = "task_tags"

    task_id: UUID = Field(foreign_key="tasks.id", primary_key=True, ondelete="CASCADE")
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True, ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="task_tags")
    tag: "Tag" = Relationship(back_populates="task_tags")
```

---

## Validation Rules

### Task Validation
- `title`: Required, 1-500 characters
- `description`: Optional, no length limit
- `priority`: Must be valid enum value
- `deadline`: Must be valid ISO8601 datetime if provided
- `time_estimate`: Must be positive integer (minutes) if provided
- `project_id`: Must reference user's own project if provided

### Project Validation
- `name`: Required, 1-100 characters
- `description`: Optional, no length limit
- Unique name per user

### Tag Validation
- `label`: Required, 1-50 characters
- `color`: Must match `^#[0-9A-Fa-f]{6}$` if provided
- Unique label per user

---

## State Transitions

### Task States
```
┌──────────────┐     mark_complete()     ┌──────────────┐
│   Active     │ ─────────────────────► │  Completed   │
│ is_completed │                         │ is_completed │
│   = false    │ ◄───────────────────── │   = true     │
└──────────────┘     mark_incomplete()   └──────────────┘
```

### Project Deletion Cascade
```
Project deleted
      │
      ├── Tasks in project → project_id set to NULL (moved to inbox)
      │
      └── Project record deleted
```

### Tag Deletion Cascade
```
Tag deleted
      │
      ├── TaskTag records with tag_id → CASCADE DELETE
      │
      └── Tag record deleted
```

### User Deletion Cascade (if implemented)
```
User deleted
      │
      ├── Tasks → CASCADE DELETE
      ├── Projects → CASCADE DELETE
      ├── Tags → CASCADE DELETE
      └── User record deleted
```

---

## Migration Strategy

1. **Initial Migration**: Create all tables with indexes and constraints
2. **Seed Data**: No seed data required (users created on first auth)
3. **Future Migrations**: Use Alembic autogenerate for model changes

---

**Data Model Complete**: Ready for API contract generation.
