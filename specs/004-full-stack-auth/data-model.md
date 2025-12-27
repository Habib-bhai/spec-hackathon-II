# Data Model: Full-Stack Authentication

**Feature**: 004-full-stack-auth
**Date**: 2025-12-27
**Source**: spec.md, research.md

## Overview

This document defines the data model for the authentication system, covering both Better Auth managed tables and application-specific tables.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     BETTER AUTH MANAGED TABLES                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐       │
│  │    user      │       │   session    │       │   account    │       │
│  │ (auth core)  │◄──────│ (auth core)  │       │ (auth core)  │       │
│  ├──────────────┤  1:N  ├──────────────┤       ├──────────────┤       │
│  │ id (PK)      │       │ id (PK)      │       │ id (PK)      │       │
│  │ email        │       │ userId (FK)  │       │ userId (FK)──┼──────►│
│  │ name         │       │ token        │       │ providerId   │       │
│  │ image        │◄──────│ expiresAt    │       │ password     │       │
│  │ emailVerified│  1:N  │ ipAddress    │       │ accessToken  │       │
│  │ createdAt    │       │ userAgent    │       └──────────────┘       │
│  │ updatedAt    │       └──────────────┘                               │
│  └──────────────┘                                                       │
│         │                                                               │
│         │ ID Sync (user.id = users.id)                                 │
│         ▼                                                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION TABLES                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐                                                       │
│  │    users     │                                                       │
│  │ (app table)  │                                                       │
│  ├──────────────┤                                                       │
│  │ id (PK/UUID) │──────────────────┬──────────────┬──────────────┐     │
│  │ email        │                  │              │              │     │
│  │ display_name │                  ▼              ▼              ▼     │
│  │ created_at   │           ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  └──────────────┘           │  tasks   │  │ projects │  │   tags   │  │
│                             │          │  │          │  │          │  │
│                             │ user_id  │  │ user_id  │  │ user_id  │  │
│                             │   (FK)   │  │   (FK)   │  │   (FK)   │  │
│                             └──────────┘  └──────────┘  └──────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Better Auth Managed Tables

These tables are created and managed by Better Auth CLI (`npx @better-auth/cli migrate`).

### Table: `user`

Core user identity table managed by Better Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique user identifier (UUID string) |
| email | TEXT | UNIQUE, NOT NULL | User's email address |
| name | TEXT | NULLABLE | User's display name |
| image | TEXT | NULLABLE | Profile image URL |
| emailVerified | BOOLEAN | DEFAULT FALSE | Email verification status |
| createdAt | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

---

### Table: `session`

Active user sessions managed by Better Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique session identifier |
| userId | TEXT | FK → user.id, ON DELETE CASCADE | Owner of this session |
| token | TEXT | UNIQUE, NOT NULL | Session token (in cookie) |
| expiresAt | TIMESTAMP | NOT NULL | Session expiration time |
| ipAddress | TEXT | NULLABLE | Client IP address |
| userAgent | TEXT | NULLABLE | Client user agent |
| createdAt | TIMESTAMP | DEFAULT NOW() | Session creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last activity timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `token`
- INDEX on `userId`
- INDEX on `expiresAt` (for cleanup)

---

### Table: `account`

Links authentication providers to users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique account identifier |
| userId | TEXT | FK → user.id, ON DELETE CASCADE | Owner of this account |
| accountId | TEXT | NOT NULL | Provider-specific account ID |
| providerId | TEXT | NOT NULL | Provider name (email, google, github) |
| accessToken | TEXT | NULLABLE | OAuth access token |
| refreshToken | TEXT | NULLABLE | OAuth refresh token |
| accessTokenExpiresAt | TIMESTAMP | NULLABLE | Access token expiration |
| refreshTokenExpiresAt | TIMESTAMP | NULLABLE | Refresh token expiration |
| scope | TEXT | NULLABLE | OAuth scopes granted |
| idToken | TEXT | NULLABLE | OAuth ID token |
| password | TEXT | NULLABLE | Hashed password (email provider) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Account link timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `userId`
- UNIQUE INDEX on `(providerId, accountId)` - One account per provider per external ID

---

### Table: `verification`

Stores verification tokens (email, password reset, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique verification identifier |
| identifier | TEXT | NOT NULL | What's being verified (email, phone) |
| value | TEXT | NOT NULL | Verification token/code |
| expiresAt | TIMESTAMP | NOT NULL | Token expiration time |
| createdAt | TIMESTAMP | DEFAULT NOW() | Token creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `identifier`
- INDEX on `expiresAt` (for cleanup)

---

## Application Tables

### Table: `users` (Existing - Modified)

Application user table that syncs with Better Auth's `user` table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | User ID (matches Better Auth user.id) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| display_name | VARCHAR(100) | NOT NULL | Display name for UI |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**Sync Strategy**:
- `id` is copied from Better Auth JWT `sub` claim
- `email` is copied from Better Auth JWT `email` claim
- `display_name` is derived from JWT `name` claim or email prefix
- Auto-created on first authenticated API request

**SQLModel Definition** (existing, no changes needed):
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    display_name: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")
    projects: list["Project"] = Relationship(back_populates="user")
    tags: list["Tag"] = Relationship(back_populates="user")
```

---

## ID Mapping Strategy

### Problem
Better Auth uses TEXT IDs while our application uses UUID.

### Solution
Better Auth generates UUID-compatible strings. The backend converts TEXT to UUID:

```python
from uuid import UUID

# JWT claim
jwt_sub = "550e8400-e29b-41d4-a716-446655440000"  # TEXT

# Convert to UUID for SQLModel
user_id = UUID(jwt_sub)  # UUID
```

### Validation
- Better Auth IDs are valid UUIDv4 strings
- Python's `UUID()` constructor validates format
- Invalid IDs raise `ValueError` → 401 Unauthorized

---

## Migration Strategy

### Phase 1: Better Auth Tables (Frontend)
```bash
cd frontend
npx @better-auth/cli migrate
```

Creates: `user`, `session`, `account`, `verification` tables.

### Phase 2: Application Tables (Backend)
No migration needed - `users` table already exists from 003-backend-implementation.

### Phase 3: User Sync (Runtime)
Backend auto-creates `users` records from JWT claims on first authenticated request.

---

## Data Validation Rules

### User Registration (Better Auth)
| Field | Validation | Error Message |
|-------|------------|---------------|
| email | Valid email format, unique | "Invalid email" / "Email already registered" |
| password | Min 8 characters | "Password must be at least 8 characters" |
| name | Optional, max 255 chars | "Name too long" |

### Backend User Auto-Creation
| Field | Source | Fallback |
|-------|--------|----------|
| id | JWT `sub` claim | N/A (required) |
| email | JWT `email` claim | N/A (required) |
| display_name | JWT `name` claim | Email prefix (before @) |

---

## State Transitions

### Session Lifecycle
```
                 ┌─────────────┐
                 │   Created   │
                 │ (sign-in)   │
                 └──────┬──────┘
                        │
                        ▼
              ┌─────────────────┐
              │     Active      │◄────┐
              │ (authenticated) │     │ Session
              └────────┬────────┘     │ Refresh
                       │              │
           ┌───────────┼───────────┐  │
           │           │           │  │
           ▼           ▼           ▼  │
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  Expired │ │  Revoked │ │ Extended │
    │ (7 days) │ │(sign-out)│ │(activity)├──┘
    └──────────┘ └──────────┘ └──────────┘
```

### User Sync Lifecycle
```
                 ┌─────────────┐
                 │ Better Auth │
                 │Registration │
                 └──────┬──────┘
                        │
                        ▼
              ┌─────────────────┐
              │  JWT Issued     │
              │ (with sub/email)│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ First API Call  │
              │ (with JWT)      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Backend User    │
              │ Auto-Created    │
              └─────────────────┘
```

---

## Security Considerations

1. **Password Storage**: Handled by Better Auth (bcrypt/Argon2)
2. **Session Tokens**: Random, unguessable, stored hashed
3. **OAuth Tokens**: Encrypted at rest by Better Auth
4. **ID Exposure**: UUIDs are safe to expose in URLs
5. **Cascade Deletes**: Session/Account deleted with User

---

## References

- [Better Auth Database Schema](https://www.better-auth.com/docs/concepts/database)
- [003-backend-implementation data-model.md](../003-backend-implementation/data-model.md)
