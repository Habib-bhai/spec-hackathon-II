# Research: Backend Implementation

**Feature**: 003-backend-implementation
**Date**: 2025-12-26
**Status**: Complete

## Research Summary

This document consolidates research findings from Context7 MCP for all technology decisions required by the backend implementation.

---

## 1. Better Auth + FastAPI Integration

### Decision
Use Better Auth on the Next.js frontend with JWT/JWKS verification on the FastAPI backend.

### Rationale
- Better Auth is a TypeScript-first framework, designed for JavaScript frameworks
- It provides JWKS endpoints (`/.well-known/jwks.json`) for JWT verification
- FastAPI backend can verify JWTs using PyJWKClient without needing Better Auth directly
- This architecture follows the documented pattern from Context7 research

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Better Auth Python SDK | Does not exist - Better Auth is TypeScript only |
| Custom JWT implementation | Security risk - better to use established library |
| Session cookies shared between services | Complexity with separate frontend/backend domains |

### Implementation Pattern (from Context7)
```python
# JWT verification middleware for FastAPI
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
import jwt

security = HTTPBearer()
jwks_url = f"{BETTER_AUTH_URL}/.well-known/jwks.json"
jwk_client = PyJWKClient(jwks_url)

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    signing_key = jwk_client.get_signing_key_from_jwt(token)
    payload = jwt.decode(token, signing_key.key, algorithms=["EdDSA", "RS256"])
    return {"user_id": payload.get("sub"), "email": payload.get("email")}
```

---

## 2. SQLModel with Neon DB (PostgreSQL)

### Decision
Use SQLModel for ORM with async support via `asyncpg` driver, connecting to Neon DB with connection pooling.

### Rationale
- SQLModel combines SQLAlchemy ORM with Pydantic validation (constitution requirement)
- Neon DB provides managed PostgreSQL with built-in connection pooling via `-pooler` endpoint
- Async operations are essential for FastAPI performance

### Connection String Pattern (from Context7)
```
postgresql+asyncpg://user:pass@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Key Implementation Details
- Use `-pooler` suffix in endpoint for connection pooling
- Set `pool_size=5` and `max_overflow=10` for serverless environments
- Use `pool_pre_ping=True` to handle connection drops
- All timestamps in UTC with ISO8601 format

### Model Pattern (from Context7)
```python
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

class TaskBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = None

class Task(TaskBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 3. Alembic Migrations with Async Support

### Decision
Use Alembic with async template for database migrations, supporting SQLModel models.

### Rationale
- Alembic is the standard migration tool for SQLAlchemy/SQLModel
- Async template available for async database drivers
- Autogenerate feature detects model changes automatically

### Implementation Pattern (from Context7)
```python
# env.py for async migrations
import asyncio
from sqlalchemy.ext.asyncio import async_engine_from_config

async def run_async_migrations():
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

def run_migrations_online():
    asyncio.run(run_async_migrations())
```

---

## 4. FastAPI Dependency Injection Pattern

### Decision
Use FastAPI's `Depends()` with generator functions for database session management.

### Rationale
- Ensures proper session lifecycle (open/close)
- Integrates cleanly with SQLModel
- Supports async operations

### Implementation Pattern (from Context7)
```python
from typing import Annotated, Generator
from fastapi import Depends
from sqlmodel import Session

async def get_session() -> Generator[Session, None, None]:
    async with AsyncSession(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/tasks")
async def get_tasks(session: SessionDep, current_user: dict = Depends(verify_jwt_token)):
    # User isolation: filter by user_id from JWT
    tasks = await session.exec(select(Task).where(Task.user_id == current_user["user_id"]))
    return tasks.all()
```

---

## 5. API Response Format

### Decision
Use consistent JSON response format with success flag and structured errors.

### Rationale
- Frontend can reliably parse responses
- Error responses include actionable codes
- Follows REST best practices

### Response Format
```python
# Success response
{
    "success": True,
    "data": { ... }
}

# Error response
{
    "success": False,
    "error": {
        "code": "RESOURCE_NOT_FOUND",
        "message": "Task with ID xyz not found"
    }
}
```

---

## 6. Project Architecture

### Decision
Follow the FastAPI backend skill structure with domain-driven organization.

### Rationale
- Separates concerns clearly (api, models, services, repositories)
- Aligns with constitution backend structure
- Supports scalability and testability

### Directory Structure
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── tasks/
│   │       ├── projects/
│   │       ├── tags/
│   │       └── auth/
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── project.py
│   │   └── tag.py
│   ├── schemas/
│   │   ├── task.py
│   │   ├── project.py
│   │   └── tag.py
│   ├── services/
│   │   ├── task_service.py
│   │   ├── project_service.py
│   │   └── tag_service.py
│   └── main.py
├── tests/
│   ├── unit/
│   └── integration/
├── alembic/
├── requirements.txt
└── pyproject.toml
```

---

## 7. Rate Limiting

### Decision
Use `slowapi` library for rate limiting with Redis backend (future) or in-memory (initial).

### Rationale
- Simple integration with FastAPI
- Supports per-user rate limiting
- Can be upgraded to Redis for distributed deployments

### Implementation Pattern
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/v1/tasks")
@limiter.limit("100/minute")
async def get_tasks(request: Request):
    ...
```

---

## 8. CORS Configuration

### Decision
Configure CORS to allow frontend origin with credentials support.

### Rationale
- Required for cross-origin API calls
- Must support credentials for session cookies
- Specific origins (not wildcard) for security

### Implementation Pattern
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)
```

---

## Research Sources

All research conducted via Context7 MCP per constitution mandate:

1. **SQLModel**: `/websites/sqlmodel_tiangolo` - relationships, async patterns
2. **Neon DB**: `/llmstxt/neon_tech-llms.txt` - connection pooling, Python integration
3. **FastAPI**: `/fastapi/fastapi` - dependency injection, SQLModel integration
4. **Better Auth + FastAPI**: `/hamza123545/how-to-use-better-auth-with-python-fast-api` - JWT/JWKS integration
5. **Better Auth**: `/better-auth/better-auth` - session management patterns
6. **Alembic**: `/sqlalchemy/alembic` - async migrations with PostgreSQL

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| How does Better Auth work with FastAPI? | Better Auth runs on frontend; backend verifies JWTs via JWKS |
| Sync or async database operations? | Async with `asyncpg` driver for performance |
| How to handle user isolation? | JWT contains user_id; filter all queries by user_id |
| Connection pooling strategy? | Use Neon's built-in pooler via `-pooler` endpoint suffix |
| Migration tool? | Alembic with async template |

---

**Research Complete**: All technical decisions resolved. Ready for Phase 1: Design & Contracts.
