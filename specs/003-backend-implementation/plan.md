# Implementation Plan: Backend Implementation

**Branch**: `003-backend-implementation` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-backend-implementation/spec.md`

## Summary

Implement a FastAPI backend with Neon DB (PostgreSQL) integration, providing RESTful API endpoints for task management, project organization, and tag functionality. Authentication is handled via JWT verification against Better Auth JWKS endpoint running on the Next.js frontend. The backend uses SQLModel for ORM with async database operations and Alembic for migrations.

## Technical Context

**Language/Version**: Python 3.11+
**Package Manager**: [UV](https://docs.astral.sh/uv/) - Fast Python package manager (`uv add <package>`)
**Primary Dependencies**: FastAPI, SQLModel, asyncpg, Alembic, pydantic-settings, slowapi
**Auth Dependencies**: PyJWT, python-jose (deferred - to be added when auth is implemented)
**Storage**: Neon DB (PostgreSQL) with connection pooling via `-pooler` endpoint
**Testing**: pytest, pytest-asyncio, pytest-cov
**Target Platform**: Linux server / Docker container / Serverless (Vercel/Railway)
**Project Type**: Web application (backend API)
**Performance Goals**: p95 latency < 200ms, 100 concurrent users
**Constraints**: < 200ms response time, connection pooling required for serverless
**Scale/Scope**: Single tenant, 10k+ tasks per user supported

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Type Safety First | ✅ PASS | SQLModel + Pydantic for all models, type hints on all functions |
| II. Context7 MCP Usage | ✅ PASS | Research.md documents all Context7 queries for SQLModel, Neon, FastAPI, Better Auth |
| III. Spec-Driven Development | ✅ PASS | Following SDD workflow: spec → plan → tasks → implement |
| IV. Better Auth | ✅ PASS | JWT/JWKS verification pattern documented in research.md |
| V. Full-Stack Type Consistency | ✅ PASS | OpenAPI contract enables TypeScript type generation for frontend |
| VI. Developer Productivity | ✅ PASS | Clear structure, automated docs, standard patterns |

## Project Structure

### Documentation (this feature)

```text
specs/003-backend-implementation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - setup guide
├── contracts/           # Phase 1 output
│   └── openapi.yaml     # API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py          # API router aggregation
│   │       ├── tasks.py           # Task CRUD endpoints
│   │       ├── projects.py        # Project CRUD endpoints
│   │       └── tags.py            # Tag CRUD endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings from environment
│   │   ├── database.py            # Async database connection
│   │   ├── security.py            # JWT/JWKS verification
│   │   └── exceptions.py          # Custom exception handlers
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User SQLModel
│   │   ├── task.py                # Task SQLModel + Priority enum
│   │   ├── project.py             # Project SQLModel
│   │   └── tag.py                 # Tag + TaskTag SQLModels
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── common.py              # Pagination, Error schemas
│   │   ├── task.py                # TaskCreate, TaskUpdate, TaskResponse
│   │   ├── project.py             # ProjectCreate, ProjectUpdate, ProjectResponse
│   │   └── tag.py                 # TagCreate, TagUpdate, TagResponse
│   └── services/
│       ├── __init__.py
│       ├── task_service.py        # Task business logic
│       ├── project_service.py     # Project business logic
│       └── tag_service.py         # Tag business logic
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Pytest fixtures (test DB, mock JWT)
│   ├── unit/
│   │   ├── test_task_service.py
│   │   ├── test_project_service.py
│   │   └── test_tag_service.py
│   └── integration/
│       ├── test_tasks_api.py
│       ├── test_projects_api.py
│       └── test_tags_api.py
├── alembic/
│   ├── env.py                     # Async migration support
│   └── versions/
├── .env.example
├── alembic.ini
├── pyproject.toml
└── uv.lock                       # UV lock file (auto-generated)
```

**Structure Decision**: Web application structure (Option 2) with backend/ directory. Frontend already exists in frontend/. Backend follows domain-driven organization with clear separation between API routes, business logic (services), data models, and request/response schemas.

## Complexity Tracking

> No constitution violations requiring justification.

| Decision | Rationale |
|----------|-----------|
| Service layer | Separates business logic from API routes for testability |
| Async database | Required for FastAPI performance and Neon DB connection pooling |
| JWT/JWKS auth | Better Auth runs on frontend; backend verifies tokens only |

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | ✅ Complete |
| Data Model | [data-model.md](./data-model.md) | ✅ Complete |
| API Contract | [contracts/openapi.yaml](./contracts/openapi.yaml) | ✅ Complete |
| Quickstart | [quickstart.md](./quickstart.md) | ✅ Complete |

## Key Architecture Decisions

### 1. Authentication Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Better Auth   │     │   FastAPI       │
│   (Next.js)     │────▶│   (on frontend) │     │   Backend       │
└─────────────────┘     └────────┬────────┘     └────────▲────────┘
                                 │                       │
                                 │ JWKS                  │ JWT
                                 ▼                       │
                        /.well-known/jwks.json ─────────┘
```

- Better Auth handles authentication on frontend
- Backend verifies JWTs using JWKS endpoint
- User isolation enforced at API level (filter by user_id from JWT)

### 2. Database Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FastAPI       │────▶│   asyncpg       │────▶│   Neon DB       │
│   Application   │     │   (async)       │     │   (pooler)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- Async operations via `asyncpg` driver
- Connection pooling via Neon's built-in pooler (`-pooler` endpoint)
- SQLModel for ORM with Pydantic validation

### 3. API Response Format

All responses follow consistent structure:

```json
// Success
{
  "success": true,
  "data": { ... },
  "pagination": { "offset": 0, "limit": 50, "total": 100 }
}

// Error
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Task not found"
  }
}
```

## Implementation Phases

### Phase 1: Foundation (P1 - Critical)
- Project setup and dependencies
- Database connection and models
- JWT verification middleware
- Health check endpoint

### Phase 2: Task CRUD (P1 - Critical)
- Task model and schemas
- Task service layer
- Task API endpoints
- Task filtering and pagination

### Phase 3: Projects (P2 - High)
- Project model and schemas
- Project service layer
- Project API endpoints
- Task-Project relationships

### Phase 4: Tags (P2 - High)
- Tag model and schemas
- TaskTag junction table
- Tag service layer
- Tag API endpoints

### Phase 5: Search & Polish (P3 - Medium)
- Text search implementation
- Rate limiting
- Error handling refinement
- Test coverage

---

**Plan Complete**: Ready for `/sp.tasks` to generate implementation task breakdown.
