---
name: documentation
description: This skill should be used when writing documentation, creating README files, generating API docs, maintaining changelogs, documenting code architecture, and creating guides. It optimizes documentation practices for clarity and maintainability.
---

# Documentation Master Skill

Expert-level guidance for comprehensive, clear, and maintainable documentation practices.

## Quick Start

```markdown
# README.md Structure
- [ ] Project title and description
- [ ] Installation instructions
- [ ] Usage examples
- [ ] API reference (if applicable)
- [ ] Configuration options
- [ ] Contributing guidelines
- [ ] License information
```

## Core Concepts

**README**: Project overview and quick start guide
**API Docs**: Reference for all endpoints/functions
**CHANGELOG**: Version history and changes
**Architecture Docs**: System design and patterns
**Inline Comments**: Code-level documentation

## README Template

```markdown
# Project Name

Brief description of what the project does and who it's for.

## Installation

\`\`\`bash
npm install project-name

# or
yarn add project-name

# or
git clone https://github.com/user/project
cd project
npm install
\`\`\`

## Usage

\`\`\`typescript
import { feature } from 'project-name';

const result = feature({
  option: 'value'
});

console.log(result);
\`\`\`

## Configuration

\`\`\`typescript
import { config } from 'project-name';

config.set({
  apiKey: process.env.API_KEY,
  timeout: 5000
});
\`\`\`

## API Reference

### Method: featureName

Performs a specific operation with given parameters.

\`\`\`typescript
featureName(options: {
  required: string;
  optional?: number;
}): Promise<Result>
\`\`\`

**Parameters**:
- `required` (string, required): Description of required parameter
- `optional` (number, optional): Description of optional parameter. Default: 100

**Returns**: Promise resolving to Result object

**Example**:
\`\`\`typescript
const result = await featureName({
  required: 'value',
  optional: 200
});

console.log(result);
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © [Year] [Author]
\`\`\`
```

## API Documentation

### OpenAPI/Swagger

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: API Name
  version: 1.0.0
  description: API Description
paths:
  /api/users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        email:
          type: string
          format: email
    CreateUser:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
          type: string
          format: email
    Error:
      type: object
      properties:
        message:
          type: string
\`\`\`
```

### JSDoc Comments

```typescript
/**
 * Calculates the total price including tax
 *
 * @param basePrice - The base price before tax
 * @param taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @param currency - The currency symbol to use (default: '$')
 * @returns The total price formatted as a string
 *
 * @example
 * ```typescript
 * calculateTotal(100, 0.08);
 * // Returns: "$108.00"
 * ```
 */
export function calculateTotal(
  basePrice: number,
  taxRate: number,
  currency: string = '$'
): string {
  const tax = basePrice * taxRate;
  const total = basePrice + tax;
  return `${currency}${total.toFixed(2)}`;
}
```

### TSDoc for Libraries

```typescript
/**
 * Represents a task in the system
 *
 * @remarks
 * Tasks can be assigned to projects and have optional due dates.
 * The priority levels follow the criticality levels.
 *
 * @public
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;

  /** Title/description of the task */
  title: string;

  /** Detailed description (optional) */
  description?: string;

  /** Priority level: 'critical', 'high', 'medium', 'low' */
  priority: TaskPriority;

  /** Due date for the task (optional) */
  dueDate?: Date;

  /** User who owns this task */
  userId: string;

  /** Current status of the task */
  status: TaskStatus;
}
```

## Architecture Documentation

### System Overview

```markdown
# System Architecture

This document describes the overall architecture of [Project Name], including components, data flow, and key design decisions.

## High-Level Architecture

[Architecture diagram or ASCII diagram showing main components]

## Core Components

1. **Frontend**: Next.js application with TypeScript
2. **Backend**: FastAPI server with SQLModel
3. **Database**: PostgreSQL via Neon DB
4. **Authentication**: Better Auth for session management

## Data Flow

1. User request → Frontend (Next.js)
2. Frontend → Backend API (FastAPI)
3. Backend → Database (PostgreSQL)
4. Database → Backend
5. Backend → Frontend
6. Frontend → User response

## Key Design Decisions

### Why Next.js?
- Server-side rendering for SEO
- API routes for backend integration
- Built-in optimization and code splitting
- Strong TypeScript support

### Why SQLModel?
- Type-safe ORM with Pydantic validation
- SQLAlchemy ORM underneath for battle-tested reliability
- Seamless migration support via Alembic

### Why Better Auth?
- Built-in session management
- Secure by default
- Easy integration with providers
- No need to implement auth from scratch
\`\`\`
```

## CHANGELOG Template

```markdown
# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a CHANGELOG](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- New feature 1 description
- New feature 2 description

### Changed
- Breaking change: Description and migration guide
- Deprecation notice for old feature

### Fixed
- Bug fix 1 description
- Bug fix 2 description

## [1.2.0] - 2025-12-15

### Added
- Feature addition in v1.2.0
- Another new feature

### Changed
- Backward-compatible change description

### Fixed
- Bug fixed in v1.2.0

## [1.1.0] - 2025-12-01

### Added
- Initial feature set
```

## Code Comments

### When to Comment

```markdown
### Add Comments When:
- Explaining complex algorithms
- Documenting non-obvious business rules
- Clarifying workarounds for technical constraints
- Explaining why a particular approach was chosen
- Providing examples for future developers

### Don't Comment When:
- The code already explains itself (good naming)
- Commenting out old code (use git instead)
- Explaining what the code does (it should be obvious)
- Comments that are out of date
```

### Comment Examples

```typescript
// BAD - What is this doing?
const d = data.map(x => x * 2);

// GOOD - Descriptive name, no comment needed
const doubledValues = data.map(x => x * 2);

// BAD - Comment for every line
const result = fetch(url); // Fetch from API
const data = await result.json(); // Parse JSON
return data; // Return data

// GOOD - Clear, self-documenting code
const apiResponse = await fetch(url);
const data = await apiResponse.json();
return data;

// GOOD - Explaining complex algorithm
// Using Floyd-Warshall to compute transitive closure for shortest path
const shortestPath = computeTransitiveClosure(graph, start, end);

// GOOD - Documenting business rule
// By policy, users can only have up to 100 active tasks
if (activeTasks.length >= 100) {
  throw new Error('Task limit exceeded');
}
```

## Best Practices

### README Quality

- [ ] Clear project description in first paragraph
- [ ] Installation instructions work without modifications
- [ ] Examples are copy-pasteable
- [ ] Screenshots/diagrams for visual components
- [ ] Links to live demo or docs
- [ ] Badge for build status, coverage, etc.
- [ ] Contributing guidelines are clear
- [ ] License specified

### API Documentation

- [ ] All endpoints are documented
- [ ] Request/response schemas are clear
- [ ] Authentication requirements specified
- [ ] Error responses documented
- [ ] Rate limiting information included
- [ ] Code examples in multiple languages
- [ ] Interactive docs (try in browser) available

### Code Documentation

- [ ] Public APIs have JSDoc comments
- [ ] Complex functions have explanatory comments
- [ ] Business rules are documented
- [ ] Edge cases are noted
- [ ] Non-obvious algorithms are explained
- [ ] Performance characteristics noted

### CHANGELOG Maintenance

- [ ] Entries are time-ordered (newest at top)
- [ ] Version numbers follow semantic versioning
- [ ] Categories: Added, Changed, Deprecated, Removed, Fixed
- [ ] Breaking changes are clearly marked
- [ ] Migration guides provided for breaking changes
- [ ] Release dates included

## Documentation Checklist

### Before Release

```markdown
- [ ] README reflects current features
- [ ] API documentation is up to date
- [ ] CHANGELOG updated with new features
- [ ] Breaking changes are documented with migration guide
- [ ] Inline code comments are accurate
- [ ] Examples in documentation are tested
- [ ] Screenshots/diagrams are current
- [ ] Contributing guidelines are clear
```

### Documentation Quality

```markdown
- [ ] Information is accurate and current
- [ ] Explanations are clear to target audience
- [ ] No jargon without explanation
- [ ] Examples are complete and runnable
- [ ] Links work and point to correct sections
- [ ] Code examples follow project conventions
- [ ] Visual formatting helps readability
```

---

**Goal**: Create clear, comprehensive, and maintainable documentation that enables users and developers to understand and use the project effectively.
