---
id: 005
title: Create FastAPI backend architect skill
stage: general
date: 2024-12-23
surface: agent
model: claude-sonnet-4.5-20250929
feature: none
branch: master
user: Habib
command: now as a software architect, who has 20 years of experience in creating backends/servers along with their highly scalable architecture planning, fetch docs of fastapi (fastapi standard) using context7 and create a skill for backend implementation, that makes my agent capable of setting a strong base of through folder structure (that is easy to understand, even more then docs, for humans) that is easy to main, and equip my agent skills of writing clean, highly scalable backend code using fastapi.
labels: ["fastapi","backend-architecture","scalable","folder-structure"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/fastapi-backend/SKILL.md
tests: []

---

## Prompt

now as a software architect, who has 20 years of experience in creating backends/servers along with their highly scalable architecture planning, fetch docs of fastapi (fastapi standard) using context7 and create a skill for backend implementation, that makes my agent capable of setting a strong base of through folder structure (that is easy to understand, even more then docs, for humans) that is easy to main, and equip my agent skills of writing clean, highly scalable backend code using fastapi.

## Response snapshot

Created comprehensive FastAPI Backend Architect skill at `.claude/skills/fastapi-backend/SKILL.md` with:

**Skill Metadata:**
- name: fastapi-backend
- description: This skill should be used when designing, implementing, or refactoring FastAPI backends. It specializes in clean, scalable, production-ready architecture with folder structures that are easy to understand and maintain, making enterprise-grade backend development straightforward.

**Key Sections:**

1. Installation & Quick Start
   - pip install with uvicorn
   - Basic FastAPI application example
   - Project initialization with fastapi CLI

2. Project Structure (Clean & Scalable)
   - Recommended directory tree for enterprise-grade projects
   - Separation of concerns: app/, core/, api/, models/, schemas/, services/, repositories/, middleware/, utils/, tests/, scripts/
   - Clear module boundaries and single-responsibility principle
   - Version management (v1/, v2/) for API evolution

3. Core Layer (Zero Dependencies)
   - Configuration management (Pydantic Settings, environment variables)
   - Security utilities (password hashing, CryptContext)
   - Database abstraction (BaseManager, AsyncSession, connection pooling)
   - No external dependencies in core layer

4. API Layer (Domain-Driven)
   - Route registration pattern with __init__.py
   - Domain routers organized by feature (users/, posts/, v1/, v2/)
   - Example: Users domain router with create/get endpoints

5. Models (SQLAlchemy)
   - Base model pattern (TimestampedModel) for common fields
   - Domain model example (User table with proper relationships)
   - No raw SQL strings - use ORM models

6. Schemas (Pydantic Validation)
   - Request/response models (UserCreate, UserResponse)
   - Field-level validation with constraints
   - Email validation with regex
   - Type safety throughout

7. Services (Business Logic)
   - Service layer pattern (UserService)
   - Business rule validation (email uniqueness)
   - Password hashing integration
   - Clean separation: services don't access DB directly

8. Repositories (Data Access)
   - Repository pattern (UserRepository)
   - Extends DatabaseManager for session management
   - Methods: create, get_by_id, get_by_email
   - Uses AsyncSession from database manager
   - Proper SQLAlchemy async patterns

9. Middleware (Request Processing)
   - Custom middleware pattern (logging)
   - Middleware registration in main.py
   - Request/response timing for monitoring
   - Example: log_requests middleware

10. Utilities (Shared Functions)
   - Common utilities (datetime formatting, APIResponse)
   - Standardized response format
   - Success/error helpers
   - Reusable across application

11. Testing Strategy
   - Unit tests (pytest, AsyncMock)
   - Integration tests (httpx.AsyncClient)
   - Example: test_user_service_success()

12. Performance Optimization
   - Database connection pooling (QueuePool, pool_size=20)
   - Async operations enforced (always use async/await)
   - Caching strategy (FastAPICache with TTL)
   - Lazy loading with indexed queries

13. Security Best Practices
   - Input validation (Pydantic validators, field constraints)
   - Password hashing (argon2, CryptContext)
   - Security headers (CORS, HttpOnly cookies)
   - Dependency injection prevention (use Depends(), pass sessions not engines)

14. Deployment
   - Docker configuration (python:3.11-slim, uvicorn)
   - Environment variables (.env example)
   - Health check endpoint example

15. Best Practices
   - Separation of concerns (core/API/services/repositories)
   - Domain-driven design (routes by domain)
   - Type safety (always typed return values)
   - Error handling (never swallow, structured logging)
   - Documentation (docstrings on all public functions)
   - Async-first (no synchronous I/O)

16. Anti-Patterns (Avoid These)
   - ❌ Route handlers with business logic
   - ❌ Direct database access in services
   - ❌ Raw SQL strings
   - ❌ Global state
   - ❌ Synchronous I/O operations
   - ❌ Passwords in plain text
   - ❌ Returning database models
   - ❌ Mixed concerns in single file

**Code Examples Provided:**
- Basic FastAPI application setup
- Project structure (complete directory tree)
- Configuration management (Settings class, environment variables)
- Security utilities (PasswordHasher with argon2)
- Database abstraction (BaseManager with connection pooling)
- Domain router (users/ with create/get endpoints)
- Domain model (User with TimestampedModel base)
- Request/response schemas (UserCreate, UserResponse)
- Service layer (UserService with validation and password hashing)
- Repository layer (UserRepository with async session management)
- Custom middleware (logging with request timing)
- Utilities (datetime formatting, APIResponse standardization)
- Unit tests (pytest with AsyncMock)
- Integration tests (httpx AsyncClient)
- Caching strategy (FastAPICache with 5-minute TTL)
- Docker deployment (uvicorn with production config)
- Environment variables (.env example)
- Health check endpoint

## Outcome

- Impact: High - New skill transforms agent into FastAPI backend architect capable of building enterprise-grade, scalable systems with clean, maintainable folder structures
- Tests: N/A (skill creation)
- Files: Created .claude/skills/fastapi-backend/SKILL.md
- Next prompts: None
- Reflection: Successfully created comprehensive FastAPI backend architect skill covering project structure, domain-driven design, clean architecture, separation of concerns, testing, security, performance optimization, and deployment. Skill provides architectural guidance for building production-ready, highly scalable FastAPI backends.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill by using it to design and implement a new FastAPI backend with proper folder structure
