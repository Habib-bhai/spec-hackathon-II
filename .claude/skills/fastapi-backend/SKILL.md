---
name: fastapi-backend
description: This skill should be used when designing, implementing, or refactoring FastAPI backends. It specializes in clean, scalable, production-ready architecture with folder structures that are easy to understand and maintain, making enterprise-grade backend development straightforward.
---

# FastAPI Backend Architect Skill

Senior-level expertise for building production-grade FastAPI backends with clear architecture.

## Installation & Quick Start

```bash
# Install FastAPI with dependencies
pip install fastapi uvicorn[standard] sqlalchemy alembic

# Initialize project
fastapi new my-api --name "My API"
```

### Basic Application

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: int
    name: str

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id, "name": "Example User"}

@app.post("/users")
async def create_user(user: User):
    return {"id": 1, "name": user.name}
```

## Project Structure (Clean & Scalable)

### Recommended Architecture

```
my-api/
├── app/                    # Application factory and lifecycle
│   ├── api/              # API route modules (by domain)
│   │   ├── __init__.py  # Route registration
│   │   ├── v1/            # API version 1
│   │   │   ├── users/     # User endpoints
│   │   │   └── posts/      # Post endpoints
│   │   └── v2/            # API version 2 (future)
│   ├── core/             # Core functionality (no dependencies)
│   │   ├── config/        # Configuration management
│   │   ├── security/       # Security utilities
│   │   ├── database/       # Database abstraction layer
│   │   ├── dependencies/    # External service abstractions
│   │   ├── middleware/     # Custom middleware
│   │   └── exceptions/     # Custom exception classes
│   ├── models/           # SQLAlchemy models (one per file)
│   │   ├── schemas/          # Pydantic request/response models
│   │   ├── services/         # Business logic (no framework code)
│   │   ├── repositories/     # Data access layer
│   │   └── utils/           # Shared utilities
│   ├── tests/
│   │   ├── unit/          # Unit tests (pytest)
│   │   ├── integration/    # Integration tests
│   │   └── e2e/           # End-to-end tests
│   ├── scripts/           # Utility and management scripts
│   ├── main.py          # Application entry point
│   ├── pyproject.toml    # Dependencies
│   ├── requirements.txt    # Dependencies
│   ├── alembic/          # Database migrations
│   ├── Dockerfile        # Container configuration
│   └── README.md         # Documentation
```

## Core Layer (Zero Dependencies)

### Configuration Management

```python
# app/core/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "My API"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Config()
```

### Security Utilities

```python
# app/core/security/password.py
import hashlib
from passlib.context import CryptContext

class PasswordHasher:
    """Handle password hashing and verification"""

    @staticmethod
    def hash(password: str) -> str:
        context = CryptContext(["./argon2"])
        return context.hash(password)

    @staticmethod
    def verify(password: str, hash: str) -> bool:
        context = CryptContext(["./argon2"])
        return context.verify(password, hash)
```

### Database Abstraction

```python
# app/core/database/base.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import create_engine, select

class DatabaseManager:
    """Centralized database connection management"""

    def __init__(self, database_url: str):
        self.engine = create_engine(database_url, pool_pre_ping=True, pool_size=20)
        self.session_factory = self._create_session_factory()

    async def _create_session_factory(self):
        async def get_session():
            async with AsyncSession(self.engine) as session:
                yield session
        return get_session
```

## API Layer (Domain-Driven)

### Route Registration Pattern

```python
# app/api/__init__.py
from fastapi import FastAPI
from app.api.v1.users import router as users_router
from app.api.v1.posts import router as posts_router

api_v1 = FastAPI()

api_v1.include_router(users_router, prefix="/users")
api_v1.include_router(posts_router, prefix="/posts")

app = FastAPI()
app.mount("/api/v1", api_v1)
```

### Domain Router (Users)

```python
# app/api/v1/users/router.py
from fastapi import APIRouter
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    new_user = await UserService.create(user)
    return new_user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    return await UserService.get(user_id)
```

## Models (SQLAlchemy)

### Base Model Pattern

```python
# app/models/base.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column

Base = declarative_base()

class TimestampedModel(Base):
    """Common timestamp fields for all models"""
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Domain Model (Users)

```python
# app/models/user.py
from sqlalchemy import String, Boolean
from app.models.base import TimestampedModel

class User(TimestampedModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
```

## Schemas (Pydantic Validation)

### Request/Response Models

```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    created_at: datetime
```

## Services (Business Logic)

### Service Layer Pattern

```python
# app/services/user_service.py
from typing import Optional
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.security.password import PasswordHasher

class UserService:
    """Business logic for user operations"""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
        self.password_hasher = PasswordHasher()

    async def create(self, user_data: dict) -> User:
        """Create user with business logic validation"""
        # Business rule: email unique
        existing = await self.user_repo.get_by_email(user_data["email"])
        if existing:
            raise ValueError("Email already registered")

        # Hash password
        hashed = self.password_hasher.hash(user_data["password"])

        user = User(
            email=user_data["email"],
            username=user_data["username"],
            hashed_password=hashed,
            is_active=True
        )

        return await self.user_repo.create(user)

    async def get(self, user_id: int) -> Optional[User]:
        return await self.user_repo.get_by_id(user_id)
```

## Repositories (Data Access)

### Repository Pattern

```python
# app/repositories/user_repository.py
from sqlalchemy import select
from app.models.user import User
from app.core.database.base import DatabaseManager

class UserRepository(DatabaseManager):
    """Data access layer for users"""

    async def create(self, user: User) -> User:
        async with self.get_session() as session:
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

    async def get_by_id(self, user_id: int) -> Optional[User]:
        async with self.get_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        async with self.get_session() as session:
            result = await session.execute(select(User).where(User.email == email))
            return result.scalar_one_or_none()
```

## Middleware (Request Processing)

### Custom Middleware Pattern

```python
# app/middleware/logging.py
from fastapi import Request
from time import time

async def log_requests(request: Request, call_next):
    start_time = time()
    response = await call_next(request)
    duration = time() - start_time

    # Log to monitoring
    print(f"{request.method} {request.url} - {duration:.3f}s - {response.status_code}")
    return response
```

### Middleware Registration

```python
# main.py
from fastapi import FastAPI
from app.middleware.logging import log_requests
from app.middleware.cors import add_cors_middleware

app = FastAPI()

# Add middleware
app.middleware("http")(log_requests)
app.middleware("http")(add_cors_middleware)
```

## Utilities (Shared Functions)

### Common Utilities

```python
# app/utils/datetime.py
from datetime import datetime, timezone

def utc_now() -> datetime:
    """Return current UTC time"""
    return datetime.now(timezone.utc)

def format_datetime(dt: datetime) -> str:
    """Format datetime for APIs"""
    return dt.isoformat()
```

### Response Utilities

```python
# app/utils/response.py
from fastapi import status
from typing import Any, Optional

class APIResponse:
    """Standardized API responses"""

    @staticmethod
    def success(data: Any, message: str = "Success") -> dict:
        return {
            "success": True,
            "message": message,
            "data": data,
            "status_code": status.HTTP_200_OK
        }

    @staticmethod
    def error(message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> dict:
        return {
            "success": False,
            "message": message,
            "status_code": status_code
        }

    @staticmethod
    def not_found(resource: str) -> dict:
        return APIResponse.error(
            message=f"{resource} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )

    @staticmethod
    def validation_error(errors: list) -> dict:
        return APIResponse.error(
            message="Validation failed",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
```

## Testing Strategy

### Unit Tests (Pytest)

```python
# tests/unit/services/test_user_service.py
import pytest
from app.services.user_service import UserService
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_create_user_success(mock_user_repo):
    mock_repo = AsyncMock()
    mock_repo.get_by_email.return_value = None
    mock_repo.create.return_value = User(id=1, email="test@example.com")

    service = UserService(mock_repo)
    user_data = {"email": "test@example.com", "username": "testuser", "password": "SecurePass123!"}
    result = await service.create(user_data)

    assert result.email == "test@example.com"
    assert result.username == "testuser"
```

### Integration Tests

```python
# tests/integration/test_users_api.py
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/users/",
            json={"email": "test@example.com", "username": "test", "password": "pass"}
        )
    assert response.status_code == 201
        assert response.json()["email"] == "test@example.com"
```

## Performance Optimization

### Database Connection Pooling
```python
# app/core/database/base.py
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

### Async Operations
```python
# Always use async/await for I/O
from sqlalchemy.ext.asyncio import AsyncSession

async with AsyncSession(engine) as session:
    result = await session.execute(select(User).where(User.id == 1))
    user = result.scalar_one()
```

### Caching Strategy

```python
# app/services/cache_service.py
from fastapi_cache2 import FastAPICache
from datetime import timedelta

cache = FastAPICache()

@cache(expire=timedelta(minutes=5))
async def get_user(user_id: int):
    # Check cache first
    cached = await cache.get(f"user:{user_id}")
    if cached:
        return cached

    # Fetch from database if not cached
    user = await user_repository.get(user_id)
    await cache.set(f"user:{user_id}", user, expire=timedelta(minutes=5))
    return user
```

## Security Best Practices

### Input Validation (Pydantic)

```python
from pydantic import BaseModel, Field, validator
from typing import Optional

class CreateUserRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(regex=r"^[^a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$")
    age: int = Field(ge=18, le=120)

    @validator('age')
    def validate_age(cls, v):
        if v < 18:
            raise ValueError("User must be 18 or older")
        return v
```

### Password Hashing

```python
from passlib.context import CryptContext

class PasswordManager:
    def hash_password(self, password: str) -> str:
        context = CryptContext(["./argon2"])
        return context.hash(password)

    def verify_password(self, password: str, hashed: str) -> bool:
        context = CryptContext(["./argon2"])
        try:
            return context.verify(password, hashed)
        except:
            return False
```

### Security Headers

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
    max_age=3600
)
```

## Deployment

### Docker Configuration

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Use uvicorn for production
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
SECRET_KEY=production-secret-key-change-me
ENVIRONMENT=production
LOG_LEVEL=INFO
```

## Best Practices

### Design Principles
1. **Separation of Concerns**
   - Core: No dependencies, reusable utilities
   - API: Routes only, delegates to services
   - Services: Business logic, no DB access
   - Repositories: Data access only
2. **Domain-Driven Design**
   - Routes organized by domain (users, posts, products)
   - Clear naming: UserService, UserRepository, etc.
3. **Dependency Injection**
   - Use FastAPI Depends() for services
   - Pass database session, not engine
4. **Async First**
   - Always use async/await
   - Database: AsyncSession
   - External calls: httpx/aiosession

### Code Quality
1. **Type Safety**: Always type return values
2. **Error Handling**: Never swallow exceptions
3. **Logging**: Use structured logging
4. **Documentation**: Docstrings for all public functions

### Anti-Patterns (Avoid These)
- ❌ Route handlers with business logic
- ❌ Direct database access in services
- ❌ Raw SQL strings (use models/ORM)
- ❌ Global state (pass dependencies)
- ❌ Synchronous I/O operations
- ❌ Passwords in plain text
- ❌ Returning database models
- ❌ Mixed concerns in single file

---

**Goal**: Build clean, maintainable, scalable FastAPI backends with architecture that makes code self-documenting and team-friendly.
