# Feature Specification: Backend Implementation

**Feature Branch**: `003-backend-implementation`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "Backend implementation with Neon DB setup and API routes using FastAPI"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Task CRUD Operations (Priority: P1)

An authenticated user can create, read, update, and delete their tasks through the API. Tasks include essential attributes like title, description, priority, deadline, time estimate, and completion status. The API responds quickly and returns consistent, type-safe responses.

**Why this priority**: Task management is the core value proposition of the application. Without reliable task CRUD operations, users cannot accomplish the primary goal of the product. This is the foundation all other features depend on.

**Independent Test**: Can be tested by authenticating and making API calls to create a task, retrieve it, update its fields, and delete it. Delivers immediate value by enabling basic task management.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they send a POST request to create a task with a title, **Then** the task is created and returned with a unique ID and timestamps
2. **Given** an authenticated user with existing tasks, **When** they send a GET request to list tasks, **Then** they receive a paginated list of their tasks only (not other users' tasks)
3. **Given** an authenticated user with a task, **When** they send a PATCH request to update task fields, **Then** the task is updated and the changes are persisted
4. **Given** an authenticated user with a task, **When** they send a DELETE request, **Then** the task is removed from the database
5. **Given** an authenticated user, **When** they request a non-existent task, **Then** they receive a 404 error with a clear message
6. **Given** an unauthenticated user, **When** they attempt any task operation, **Then** they receive a 401 unauthorized error

---

### User Story 2 - User Authentication and Session Management (Priority: P1) ⏸️ DEFERRED

> **Note**: This user story is deferred until Better Auth is implemented on the frontend. The backend will initially operate without authentication, with auth to be added in a later phase.

A user can register for an account, sign in, and maintain their session across requests. The authentication system uses Better Auth for secure session management and protects all user-specific endpoints.

**Why this priority**: Authentication is the security foundation. Without authentication, user data cannot be protected and tasks cannot be associated with specific users. This is equally critical as task CRUD.

**Implementation Note**: Better Auth runs on the Next.js frontend. The backend will verify JWTs via JWKS endpoint when auth is implemented. Registration, sign-in, and sign-out are handled entirely by Better Auth on the frontend.

**Independent Test**: Can be tested by registering a new user (on frontend), obtaining JWT, making authenticated requests to backend, and signing out. Delivers value by securing user data and enabling multi-user support.

**Acceptance Scenarios** (Deferred):

1. **Given** a new visitor, **When** they register on the frontend via Better Auth, **Then** their account is created and they receive a JWT
2. **Given** a registered user, **When** they sign in on the frontend, **Then** they receive a JWT for backend requests
3. **Given** an authenticated user, **When** they include their JWT in backend requests, **Then** they can access protected endpoints
4. **Given** an authenticated user, **When** they sign out on the frontend, **Then** their JWT is invalidated
5. **Given** a user with invalid JWT, **When** they attempt to access protected endpoints, **Then** they receive a 401 error
6. **Given** an expired JWT, **When** a user makes a request, **Then** they receive a 401 error prompting re-authentication

---

### User Story 3 - Project Organization (Priority: P2)

An authenticated user can create projects to organize their tasks. Projects act as containers for related tasks, enabling better workflow management for software engineers working across multiple codebases or initiatives.

**Why this priority**: Project organization significantly enhances usability for the target audience (software engineers) who typically work on multiple projects. This builds on the P1 foundation.

**Independent Test**: Can be tested by creating a project, assigning tasks to it, filtering tasks by project, and deleting a project. Delivers value by enabling contextual task organization.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a project with a name, **Then** the project is created and associated with their account
2. **Given** an authenticated user with projects, **When** they list their projects, **Then** they see all their projects with task counts
3. **Given** an authenticated user with a project, **When** they update the project name, **Then** the change is persisted
4. **Given** an authenticated user, **When** they assign a task to a project, **Then** the task-project relationship is established
5. **Given** an authenticated user, **When** they filter tasks by project, **Then** only tasks in that project are returned
6. **Given** an authenticated user, **When** they delete a project with tasks, **Then** the project is deleted and tasks are moved to "Inbox" (null project)

---

### User Story 4 - Tag Management (Priority: P2)

An authenticated user can create and apply tags to tasks for flexible categorization. Tags provide cross-project organization and enable quick filtering by topic, technology, or any user-defined category.

**Why this priority**: Tags complement projects by providing a secondary, flexible categorization system. Important for productivity but dependent on P1 features being in place.

**Independent Test**: Can be tested by creating tags, applying them to tasks, filtering tasks by tag, and managing tag lifecycle. Delivers value by enabling flexible cross-project task organization.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a tag with a label, **Then** the tag is created and associated with their account
2. **Given** an authenticated user with tags, **When** they apply a tag to a task, **Then** the task-tag relationship is established
3. **Given** an authenticated user, **When** they filter tasks by tag, **Then** only tasks with that tag are returned
4. **Given** an authenticated user, **When** they remove a tag from a task, **Then** the relationship is removed but both entities persist
5. **Given** an authenticated user, **When** they delete a tag, **Then** the tag is removed from all tasks and deleted

---

### User Story 5 - Task Search and Filtering (Priority: P3)

An authenticated user can search and filter their tasks using various criteria including status, priority, deadline range, project, and tags. The API supports efficient queries for large task lists.

**Why this priority**: Search and filtering enhance usability but are not critical for basic task management. Users can manage tasks without advanced filtering, making this a quality-of-life improvement.

**Independent Test**: Can be tested by creating tasks with various attributes and querying with different filter combinations. Delivers value by enabling users to quickly find specific tasks.

**Acceptance Scenarios**:

1. **Given** an authenticated user with tasks, **When** they filter by status (active/completed), **Then** only matching tasks are returned
2. **Given** an authenticated user with tasks, **When** they filter by priority level, **Then** only tasks with that priority are returned
3. **Given** an authenticated user with tasks, **When** they filter by deadline range, **Then** only tasks within that range are returned
4. **Given** an authenticated user with tasks, **When** they search by title/description keywords, **Then** matching tasks are returned
5. **Given** an authenticated user, **When** they combine multiple filters, **Then** all filters are applied with AND logic
6. **Given** an authenticated user with many tasks, **When** they request paginated results, **Then** results are returned with proper pagination metadata

---

### Edge Cases

- What happens when a user creates a task with a very long title (>500 chars)? Validation rejects with clear error message
- What happens when duplicate email registration is attempted? API returns 409 Conflict with appropriate message
- How does the system handle concurrent updates to the same task? Last-write-wins with optimistic locking consideration
- What happens when database connection is temporarily unavailable? API returns 503 Service Unavailable with retry-after header
- How are orphaned tags handled when a user is deleted? Cascade delete removes all user's tags and tasks
- What happens when invalid UUID format is provided for task ID? API returns 422 Validation Error
- How does the API handle timezone-aware deadlines? All deadlines stored and returned in UTC with ISO8601 format
- What happens when a user tries to access another user's resources? API returns 404 (not 403) to avoid resource enumeration

## Requirements *(mandatory)*

### Functional Requirements

#### Database and Infrastructure
- **FR-001**: System MUST connect to Neon DB (PostgreSQL) using connection pooling for optimal performance
- **FR-002**: System MUST use SQLModel for ORM with Pydantic validation
- **FR-003**: System MUST support database migrations using Alembic
- **FR-004**: System MUST use environment variables for all configuration (no hardcoded secrets)
- **FR-005**: System MUST implement connection pooling with appropriate pool size for serverless environment

#### Authentication (Better Auth) ⏸️ DEFERRED

> **Note**: Auth requirements are deferred. Better Auth runs on the frontend; backend only verifies JWTs.

- **FR-006**: ~~System MUST implement user registration~~ → Handled by Better Auth on frontend (DEFERRED)
- **FR-007**: ~~System MUST implement user sign-in~~ → Handled by Better Auth on frontend (DEFERRED)
- **FR-008**: ~~System MUST implement sign-out~~ → Handled by Better Auth on frontend (DEFERRED)
- **FR-009**: ~~System MUST hash passwords~~ → Handled by Better Auth on frontend (DEFERRED)
- **FR-010**: System MUST protect all user-specific endpoints with JWT verification middleware (DEFERRED)
- **FR-011**: System MUST verify JWTs via Better Auth JWKS endpoint (DEFERRED)
- **FR-012**: System MUST return consistent error responses for authentication failures (DEFERRED)

#### User Management
- **FR-013**: System MUST create user records with unique email addresses
- **FR-014**: System MUST store user display names
- **FR-015**: System MUST associate all tasks, projects, and tags with their owning user
- **FR-016**: System MUST prevent users from accessing other users' resources

#### Task CRUD
- **FR-017**: System MUST allow creating tasks with title (required) and optional fields (description, priority, deadline, time_estimate)
- **FR-018**: System MUST support task priorities: Critical, High, Medium, Low (enum)
- **FR-019**: System MUST allow updating any task field
- **FR-020**: System MUST allow marking tasks as complete/incomplete
- **FR-021**: System MUST allow deleting tasks (hard delete)
- **FR-022**: System MUST return tasks with computed fields (is_overdue, days_until_deadline)
- **FR-023**: System MUST auto-generate timestamps (created_at, updated_at)

#### Project Management
- **FR-024**: System MUST allow creating projects with name (required) and optional description
- **FR-025**: System MUST allow updating project details
- **FR-026**: System MUST allow deleting projects (tasks moved to inbox)
- **FR-027**: System MUST return projects with task count statistics

#### Tag Management
- **FR-028**: System MUST allow creating tags with label (required) and optional color
- **FR-029**: System MUST allow applying multiple tags to a task
- **FR-030**: System MUST allow removing tags from tasks
- **FR-031**: System MUST allow deleting tags (removed from all tasks)
- **FR-032**: System MUST prevent duplicate tag labels per user

#### Search and Filtering
- **FR-033**: System MUST support filtering tasks by status (active/completed)
- **FR-034**: System MUST support filtering tasks by priority
- **FR-035**: System MUST support filtering tasks by project
- **FR-036**: System MUST support filtering tasks by tag(s)
- **FR-037**: System MUST support filtering tasks by deadline range
- **FR-038**: System MUST support text search on task title and description
- **FR-039**: System MUST support pagination with offset/limit
- **FR-040**: System MUST support sorting by multiple fields (created_at, deadline, priority)

#### API Standards
- **FR-041**: System MUST follow RESTful conventions for all endpoints
- **FR-042**: System MUST use API versioning (v1 prefix)
- **FR-043**: System MUST return consistent JSON response format
- **FR-044**: System MUST use appropriate HTTP status codes
- **FR-045**: System MUST validate all request inputs using Pydantic models
- **FR-046**: System MUST generate OpenAPI documentation automatically
- **FR-047**: System MUST implement CORS for frontend origin
- **FR-048**: System MUST implement rate limiting per user

#### Error Handling
- **FR-049**: System MUST return structured error responses with error code and message
- **FR-050**: System MUST log all errors with appropriate severity levels
- **FR-051**: System MUST not expose sensitive information in error messages
- **FR-052**: System MUST handle database constraint violations gracefully

### Key Entities

- **User**: Represents a registered user of the application. Key attributes: unique identifier (UUID), email (unique), display_name, created_at. Relationships: owns many Tasks, Projects, and Tags. *(Note: No hashed_password - authentication handled by Better Auth on frontend)*

- **Task**: Represents a todo item. Key attributes: unique identifier (UUID), title, description (optional), priority (enum: Critical, High, Medium, Low), deadline (optional, datetime), time_estimate (optional, integer minutes), is_completed (boolean), created_at, updated_at. Relationships: belongs to one User, belongs to zero or one Project, has zero or more Tags.

- **Project**: Represents a collection of related tasks. Key attributes: unique identifier (UUID), name, description (optional), created_at, updated_at. Relationships: belongs to one User, has zero or more Tasks.

- **Tag**: Represents a categorization label. Key attributes: unique identifier (UUID), label (unique per user), color (optional, hex string), created_at. Relationships: belongs to one User, applied to zero or more Tasks (many-to-many via TaskTag junction table).

- **TaskTag**: Junction table for Task-Tag many-to-many relationship. Key attributes: task_id (FK), tag_id (FK), created_at.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints respond within 200ms for 95% of requests under normal load
- **SC-002**: System supports 100 concurrent users without performance degradation
- **SC-003**: 100% of API endpoints have OpenAPI documentation generated automatically
- **SC-004**: All database operations use parameterized queries (zero SQL injection vulnerabilities)
- **SC-005**: User authentication flow completes in under 500ms end-to-end
- **SC-006**: Task creation to database persistence completes in under 100ms
- **SC-007**: Filtered task queries with 1000+ tasks complete in under 300ms
- **SC-008**: Zero password leakage (passwords never returned in any API response)
- **SC-009**: API error responses include actionable information 100% of the time
- **SC-010**: Database connection pool maintains healthy connections with less than 1% connection failures

## Assumptions

- **Package Manager**: UV is used for all Python dependency management (`uv add <package>`)
- Neon DB (PostgreSQL) is the database provider with connection pooling enabled via the `-pooler` endpoint suffix
- Better Auth library will be used for authentication on the frontend (deferred for backend)
- SQLModel will be used as the ORM, combining SQLAlchemy's power with Pydantic's validation
- The backend will be deployed in a serverless/edge environment requiring connection pooling optimization
- UUIDs will be used for all primary keys for security and distributed system compatibility
- All timestamps will be stored in UTC and returned in ISO8601 format
- The frontend will handle timezone conversion for display
- Rate limiting will use a simple token bucket algorithm initially
- **Authentication is deferred**: Backend will initially operate without auth; JWT verification added when Better Auth is ready on frontend
- Email verification is out of scope for initial implementation
- Password reset flow is out of scope for initial implementation
- OAuth/social login is out of scope for initial implementation
