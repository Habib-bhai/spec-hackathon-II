# Tasks: Backend Implementation

**Input**: Design documents from `/specs/003-backend-implementation/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/openapi.yaml ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Exact file paths included in descriptions

## Skills Applied (Mandatory per Constitution)

| Skill | Application |
|-------|-------------|
| `fastapi-backend` | Project structure, API patterns, service layer, error handling |
| `better-auth` | JWT/JWKS verification pattern, session management |
| `testing` | Test structure, fixtures, mocking patterns |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure per plan.md

**Package Manager**: UV (mandatory) - use `uv add <package>` for dependencies

- [x] T001 [P] Create `backend/` directory structure per plan.md (`app/api/v1/`, `app/core/`, `app/models/`, `app/schemas/`, `app/services/`, `tests/`, `alembic/`)
- [x] T002 Initialize UV project with `uv init .` in `backend/`
- [x] T003 Create UV virtual environment with `uv venv` in `backend/`
- [x] T004 Add production dependencies with UV:
  ```bash
  uv add fastapi uvicorn[standard] sqlmodel asyncpg alembic pydantic-settings httpx slowapi python-dotenv
  ```
- [x] T005 Add development dependencies with UV:
  ```bash
  uv add --dev pytest pytest-asyncio pytest-cov ruff mypy
  ```
- [x] T006 [P] Create `backend/.env.example` with environment variable templates
- [x] T007 [P] Configure ruff linting in `backend/pyproject.toml`
- [x] T008 [P] Configure mypy strict mode in `backend/pyproject.toml`
- [x] T009 Create `backend/alembic.ini` and `backend/alembic/env.py` for async migrations

**Checkpoint**: Project structure ready, UV virtual environment active, dependencies installed via `uv.lock`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Note**: Auth (JWT/JWKS verification) is deferred to a later phase. This phase focuses on core backend infrastructure.

### Core Infrastructure

- [x] T010 Create `backend/app/core/config.py` with Settings class (DATABASE_URL, CORS_ORIGINS, RATE_LIMIT)
- [x] T011 Create `backend/app/core/database.py` with async SQLModel engine and session management
- [x] T012 [P] Create `backend/app/core/exceptions.py` with custom exception classes (ResourceNotFound, ValidationError)
- [x] T013 [P] Create `backend/app/schemas/common.py` with Pagination, SuccessResponse, ErrorResponse schemas

### User Model (Basic - Auth Deferred)

- [x] T014 Create `backend/app/models/user.py` with User SQLModel (id, email, display_name, created_at) - no auth fields yet

### Application Entry Point

- [x] T015 Create `backend/app/main.py` with FastAPI app, lifespan, CORS middleware, and rate limiting
- [x] T016 Create `backend/app/api/v1/router.py` to aggregate all v1 routes
- [x] T017 Create `backend/app/api/v1/__init__.py` with router exports
- [x] T018 Create initial Alembic migration in `backend/alembic/versions/` for User table

### Test Infrastructure

- [x] T019 Create `backend/tests/conftest.py` with pytest fixtures (async client, test db)
- [x] T020 [P] Create `backend/tests/__init__.py` package marker

**Checkpoint**: Foundation ready - user story implementation can now begin (auth to be added later)

---

## Phase 3: User Story 1 - Task CRUD Operations (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can create, read, update, and delete tasks with full attribute support

**Independent Test**: Authenticate → Create task → Get task → Update task → Delete task → Verify 404

### Models & Schemas for US1

- [x] T021 [P] [US1] Create `backend/app/models/task.py` with Task SQLModel and Priority enum per data-model.md
- [x] T022 [P] [US1] Create `backend/app/schemas/task.py` with TaskCreate, TaskUpdate, TaskResponse, TaskListResponse

### Service Layer for US1

- [x] T023 [US1] Create `backend/app/services/task_service.py` with TaskService class (create, get, get_all, update, delete, toggle_complete)

### API Endpoints for US1

- [x] T024 [US1] Create `backend/app/api/v1/tasks.py` with CRUD endpoints per openapi.yaml:
  - POST /tasks (create task)
  - GET /tasks (list tasks with pagination)
  - GET /tasks/{task_id} (get single task)
  - PATCH /tasks/{task_id} (update task)
  - DELETE /tasks/{task_id} (delete task)
  - PATCH /tasks/{task_id}/complete (toggle completion)
- [x] T025 [US1] Wire tasks router in `backend/app/api/v1/router.py`

### Migration for US1

- [x] T026 [US1] Create Alembic migration for Task table with indexes (user_id, deadline, priority, is_completed)

### Tests for US1 (per testing skill)

- [x] T027 [P] [US1] Create `backend/tests/unit/test_task_service.py` with unit tests for TaskService
- [x] T028 [P] [US1] Create `backend/tests/integration/test_tasks_api.py` with integration tests for task endpoints

**Checkpoint**: Task CRUD fully functional - can create/read/update/delete tasks independently

---

## Phase 4: User Endpoints & Health Check (Priority: P1)

**Goal**: Basic user profile endpoint and health checks (auth deferred)

**Note**: Full authentication (US2) is deferred to a later implementation phase. This phase provides basic user and health endpoints.

### User Endpoints

- [x] T029 Create `backend/app/api/v1/users.py` with user profile endpoint:
  - GET /users/me (get current user profile) - temporarily without auth
- [x] T030 Create `backend/app/schemas/user.py` with UserResponse schema
- [x] T031 Wire users router in `backend/app/api/v1/router.py`

### Health Check

- [x] T032 [P] Add health check endpoint in `backend/app/api/v1/health.py`:
  - GET /health (basic health check)
  - GET /health/db (database connectivity check)
- [x] T033 Wire health router in `backend/app/api/v1/router.py`

### Tests

- [x] T034 [P] Create `backend/tests/integration/test_health.py` with health endpoint tests
- [x] T035 [P] Create `backend/tests/integration/test_users_api.py` with user endpoint tests

**Checkpoint**: Basic user and health endpoints working (auth to be added in future phase)

---

## Phase 5: User Story 3 - Project Organization (Priority: P2)

**Goal**: Users can create projects to organize tasks into logical groups

**Independent Test**: Create project → Assign task to project → Filter tasks by project → Delete project (tasks become inbox)

### Models & Schemas for US3

- [x] T036 [P] [US3] Create `backend/app/models/project.py` with Project SQLModel per data-model.md
- [x] T037 [P] [US3] Create `backend/app/schemas/project.py` with ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse

### Service Layer for US3

- [x] T038 [US3] Create `backend/app/services/project_service.py` with ProjectService class (create, get, get_all, update, delete with cascade)

### API Endpoints for US3

- [x] T039 [US3] Create `backend/app/api/v1/projects.py` with CRUD endpoints per openapi.yaml:
  - POST /projects (create project)
  - GET /projects (list projects with task counts)
  - GET /projects/{project_id} (get single project)
  - PATCH /projects/{project_id} (update project)
  - DELETE /projects/{project_id} (delete project, tasks → inbox)
- [x] T040 [US3] Wire projects router in `backend/app/api/v1/router.py`

### Migration for US3

- [x] T041 [US3] Create Alembic migration for Project table and Task.project_id FK

### Task-Project Integration for US3

- [x] T042 [US3] Update `backend/app/services/task_service.py` to support project_id filtering
- [x] T043 [US3] Update `backend/app/api/v1/tasks.py` to accept project_id query parameter

### Tests for US3

- [x] T044 [P] [US3] Create `backend/tests/unit/test_project_service.py` with unit tests for ProjectService
- [x] T045 [P] [US3] Create `backend/tests/integration/test_projects_api.py` with integration tests for project endpoints

**Checkpoint**: Project organization working - tasks can be grouped into projects

---

## Phase 6: User Story 4 - Tag Management (Priority: P2)

**Goal**: Users can create tags and apply them to tasks for flexible categorization

**Independent Test**: Create tag → Apply to task → Filter tasks by tag → Remove tag → Delete tag (removed from tasks)

### Models & Schemas for US4

- [x] T046 [P] [US4] Create `backend/app/models/tag.py` with Tag and TaskTag SQLModels per data-model.md
- [x] T047 [P] [US4] Create `backend/app/schemas/tag.py` with TagCreate, TagUpdate, TagResponse, TagListResponse

### Service Layer for US4

- [x] T048 [US4] Create `backend/app/services/tag_service.py` with TagService class (create, get, get_all, update, delete with cascade)

### API Endpoints for US4

- [x] T049 [US4] Create `backend/app/api/v1/tags.py` with CRUD endpoints per openapi.yaml:
  - POST /tags (create tag)
  - GET /tags (list tags)
  - GET /tags/{tag_id} (get single tag)
  - PATCH /tags/{tag_id} (update tag)
  - DELETE /tags/{tag_id} (delete tag, remove from all tasks)
- [x] T050 [US4] Wire tags router in `backend/app/api/v1/router.py`

### Migration for US4

- [x] T051 [US4] Create Alembic migration for Tag and TaskTag tables with unique constraint (user_id, label)

### Task-Tag Integration for US4

- [x] T052 [US4] Add tag management endpoints to `backend/app/api/v1/tasks.py`:
  - POST /tasks/{task_id}/tags (add tags to task)
  - DELETE /tasks/{task_id}/tags/{tag_id} (remove tag from task)
- [x] T053 [US4] Update `backend/app/services/task_service.py` to support tag_ids filtering
- [x] T054 [US4] Update `backend/app/api/v1/tasks.py` to accept tag_ids query parameter

### Tests for US4

- [x] T055 [P] [US4] Create `backend/tests/unit/test_tag_service.py` with unit tests for TagService
- [x] T056 [P] [US4] Create `backend/tests/integration/test_tags_api.py` with integration tests for tag endpoints

**Checkpoint**: Tag management working - tasks can be categorized with multiple tags

---

## Phase 7: User Story 5 - Task Search and Filtering (Priority: P3)

**Goal**: Users can search and filter tasks with various criteria for quick task discovery

**Independent Test**: Create varied tasks → Filter by status/priority/deadline/project/tag/keywords → Verify results

### Advanced Filtering for US5

- [x] T057 [US5] Enhance `backend/app/services/task_service.py` with comprehensive filtering:
  - Filter by is_completed (status)
  - Filter by priority level
  - Filter by deadline range (before/after dates)
  - Filter by project_id
  - Filter by tag_ids (multiple)
- [x] T058 [US5] Implement text search in `backend/app/services/task_service.py` on title and description fields
- [x] T059 [US5] Implement sorting in `backend/app/services/task_service.py` (created_at, deadline, priority)

### API Updates for US5

- [x] T060 [US5] Update `backend/app/api/v1/tasks.py` GET /tasks to accept all filter parameters per openapi.yaml:
  - status (active/completed)
  - priority
  - deadline_before, deadline_after
  - project_id
  - tag_ids[]
  - search (keyword search)
  - sort_by, sort_order
  - offset, limit

### Tests for US5

- [x] T061 [P] [US5] Create `backend/tests/integration/test_task_filtering.py` with comprehensive filter combination tests

**Checkpoint**: Full search and filtering working - users can quickly find any task

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Error Handling & Logging

- [x] T062 [P] Enhance error handling in `backend/app/main.py` with global exception handlers
- [x] T063 [P] Add structured logging throughout services

### Documentation & Validation

- [x] T064 [P] Verify OpenAPI docs at /docs match openapi.yaml contract
- [x] T065 Validate quickstart.md instructions work end-to-end

### Model Exports

- [x] T066 [P] Create `backend/app/models/__init__.py` to export all models
- [x] T067 [P] Create `backend/app/schemas/__init__.py` to export all schemas
- [x] T068 [P] Create `backend/app/services/__init__.py` to export all services

### Final Integration Tests

- [x] T069 Create `backend/tests/integration/test_full_workflow.py` with end-to-end user workflow test

---

## Phase 9: Authentication (Deferred - Future Implementation)

**Purpose**: Add Better Auth JWT/JWKS verification when auth is implemented on frontend

**Note**: This phase is intentionally deferred. Implement when Better Auth is configured on the frontend.

### Auth Dependencies

- [ ] T070 Add auth dependencies with UV:
  ```bash
  uv add PyJWT python-jose[cryptography]
  ```

### Auth Implementation

- [ ] T071 Create `backend/app/core/security.py` with JWT/JWKS verification using PyJWKClient
- [ ] T072 Implement `get_current_user` dependency that verifies JWT and auto-creates user on first auth
- [ ] T073 Add `BETTER_AUTH_URL` to `backend/app/core/config.py` Settings
- [ ] T074 Protect all user-specific endpoints with auth dependency

### Auth Tests

- [ ] T075 [P] Create `backend/tests/unit/test_security.py` with JWT verification unit tests
- [ ] T076 [P] Create `backend/tests/integration/test_auth.py` with auth flow integration tests

**Checkpoint**: Full authentication working - users can authenticate via Better Auth and access their own resources only

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup (UV) ────────────┐
                                ▼
Phase 2: Foundational ──────────┬──────────────────────────────────┐
                                │                                  │
            ┌───────────────────┼───────────────────┐              │
            ▼                   ▼                   ▼              │
Phase 3: US1 (P1)     Phase 4: Health/User   Phase 5: US3 (P2)    │
   Task CRUD              Endpoints             Projects           │
            │                   │                   │              │
            │                   │                   ▼              │
            │                   │           Phase 6: US4 (P2)      │
            │                   │              Tags                │
            │                   │                   │              │
            └───────────────────┴───────────────────┤              │
                                                    ▼              │
                                            Phase 7: US5 (P3)      │
                                               Filtering           │
                                                    │              │
                                                    ▼              │
                                            Phase 8: Polish ◄──────┘
                                                    │
                                                    ▼
                                            Phase 9: Auth (DEFERRED)
```

### User Story Dependencies

| Story | Depends On | Can Run Parallel With |
|-------|------------|----------------------|
| US1 (Tasks) | Phase 2 only | Phase 4, US3, US4 |
| Phase 4 (Health/User) | Phase 2 only | US1, US3, US4 |
| US3 (Projects) | Phase 2, needs Task model | US1, Phase 4 |
| US4 (Tags) | Phase 2, needs Task model | US1, Phase 4, US3 |
| US5 (Filtering) | US1, US3, US4 (needs all models) | None |
| Auth (Phase 9) | All phases (deferred) | None |

### Within Each User Story

1. Models → Services → API Endpoints → Integration → Tests
2. [P] marked tasks can run in parallel
3. Commit after each logical group

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US1 (Task CRUD)
4. Complete Phase 4: US2 (Auth refinements)
5. **STOP and VALIDATE**: Test task CRUD with auth independently
6. Deploy if ready

### Full Feature Set

1. After MVP validation, continue to:
2. Phase 5: US3 (Projects)
3. Phase 6: US4 (Tags)
4. Phase 7: US5 (Filtering)
5. Phase 8: Polish

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- All paths relative to `backend/` directory
- **Package Manager**: UV is mandatory - use `uv add <package>` for all dependencies
- **Auth Deferred**: Phase 9 (Authentication) is intentionally deferred until frontend Better Auth is ready
- Follow fastapi-backend skill patterns for project structure
- Follow testing skill patterns for test organization
- Verify tests before implementing (TDD approach)
- Commit after each task or logical group
- **Total Tasks**: 76 (T001-T076), with T070-T076 deferred to Phase 9
