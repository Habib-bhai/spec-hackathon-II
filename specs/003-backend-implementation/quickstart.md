# Quickstart: Backend Implementation

**Feature**: 003-backend-implementation
**Date**: 2025-12-26

## Prerequisites

- Python 3.11+
- [UV](https://docs.astral.sh/uv/) - Fast Python package manager (install via `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Neon DB account with a project created

## Environment Setup

### 1. Initialize Project with UV

```bash
cd backend

# Create virtual environment with UV
uv venv

# Activate virtual environment
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

### 2. Install Dependencies with UV

```bash
# Initialize pyproject.toml if not exists
uv init --name full-stack-todo-backend

# Add production dependencies
uv add fastapi uvicorn[standard] sqlmodel asyncpg alembic pydantic-settings httpx slowapi python-dotenv

# Add development dependencies
uv add --dev pytest pytest-asyncio pytest-cov ruff mypy

# Note: Auth dependencies (PyJWT, python-jose) will be added later when auth is implemented
```

**UV Commands Reference:**
- `uv add <package>` - Add a dependency
- `uv add --dev <package>` - Add a development dependency
- `uv remove <package>` - Remove a dependency
- `uv sync` - Sync dependencies from uv.lock
- `uv run <command>` - Run command in virtual environment

### 3. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database (Neon DB with pooler)
DATABASE_URL=postgresql+asyncpg://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require

# API Settings
API_V1_PREFIX=/api/v1
PROJECT_NAME=Full-Stack Todo API
DEBUG=true

# CORS
CORS_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100

# Auth (to be configured later)
# BETTER_AUTH_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial models"

# Apply migrations
alembic upgrade head
```

## Running the Application

### Development Server

```bash
# Using UV run (recommended)
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or if venv is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Access API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py    # API router aggregation
│   │       ├── tasks.py     # Task endpoints
│   │       ├── projects.py  # Project endpoints
│   │       └── tags.py      # Tag endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Settings from environment
│   │   ├── database.py      # Database connection
│   │   └── security.py      # JWT verification
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── project.py
│   │   └── tag.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task.py          # Pydantic request/response models
│   │   ├── project.py
│   │   └── tag.py
│   └── services/
│       ├── __init__.py
│       ├── task_service.py
│       ├── project_service.py
│       └── tag_service.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── unit/
│   └── integration/
├── alembic/
│   ├── env.py
│   └── versions/
├── .env
├── .env.example
├── alembic.ini
├── pyproject.toml
└── uv.lock              # UV lock file (auto-generated)
```

## Core Code Examples

### main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import create_db_and_tables
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_db_and_tables()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
```

### core/config.py

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Full-Stack Todo API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    DATABASE_URL: str

    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    RATE_LIMIT_PER_MINUTE: int = 100

    # Auth settings (to be configured later)
    # BETTER_AUTH_URL: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

> **Note**: Security/auth module (`core/security.py`) will be implemented in a later phase when Better Auth integration is added.

## Testing

### Run Tests

```bash
# All tests (using UV)
uv run pytest

# With coverage
uv run pytest --cov=app --cov-report=html

# Specific test file
uv run pytest tests/unit/test_task_service.py -v
```

### Type Checking

```bash
uv run mypy app --strict
```

### Linting

```bash
uv run ruff check app
uv run ruff format app
```

## Common Tasks

### Create New Migration

```bash
alembic revision --autogenerate -m "Add new field to Task"
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

### Check API Health

```bash
curl http://localhost:8000/api/v1/health
```

### Test Authentication

```bash
# Get JWT from frontend first, then:
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:8000/api/v1/tasks
```

## Troubleshooting

### Connection Issues

1. **Neon DB connection timeout**: Ensure you're using the `-pooler` endpoint
2. **CORS errors**: Check `CORS_ORIGINS` includes your frontend URL
3. **UV not found**: Run `curl -LsSf https://astral.sh/uv/install.sh | sh` to install

### Common Errors

| Error | Solution |
|-------|----------|
| `ssl.SSLError` | Add `?sslmode=require` to DATABASE_URL |
| `PoolTimeout` | Reduce pool_size or increase max_overflow |
| `uv: command not found` | Install UV or add to PATH |
| `ModuleNotFoundError` | Run `uv sync` to install dependencies |

---

**Next Steps**: Run `/sp.implement` to begin implementation.
