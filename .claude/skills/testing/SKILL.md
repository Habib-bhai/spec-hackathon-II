---
name: testing
description: This skill should be used when writing tests, designing test suites, implementing test strategies, handling test data, mocking dependencies, and ensuring comprehensive coverage. It optimizes testing practices for reliability and confidence.
---

# Testing Master Skill

Expert-level guidance for comprehensive, efficient, and maintainable testing practices.

## Quick Start

```bash
# Initialize testing environment
npm install --save-dev jest @types/jest ts-jest

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode during development
npm test -- --watch
```

## Core Concepts

**Unit Test**: Tests individual functions/components in isolation
**Integration Test**: Tests interactions between multiple units
**E2E Test**: Tests full user workflows from end-to-end
**Mock**: Simulated dependency for isolation
**Fixture**: Reusable test data setup
**Coverage**: Measure of code tested by test suite

## Test Organization

### Structure

```typescript
// src/features/dashboard/__tests__/Dashboard.test.ts
// src/components/Button/__tests__/Button.test.ts
// src/services/auth/__tests__/auth.test.ts
// src/api/users/__tests__/users.test.ts
```

### Naming Conventions

```typescript
// Test for Dashboard component
describe('Dashboard', () => {

  // Test specific functionality
  describe('task creation', () => {
    it('should create a task when form is submitted', () => {
      // test implementation
    });
  });
});
```

## Unit Testing

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('returns user when authenticated', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('user', 'pass');
    });
    expect(result.current.user).toEqual({ id: 1, name: 'user' });
  });

  it('returns null when not authenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
});
```

### Service/Utility Testing

```typescript
import { formatDate } from './dateUtils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-12-24');
    expect(formatDate(date)).toBe('December 24, 2025');
  });

  it('handles null gracefully', () => {
    expect(formatDate(null)).toBe('');
  });

  it('handles invalid date', () => {
    const date = new Date('invalid');
    expect(formatDate(date)).toBe('Invalid Date');
  });
});
```

## Integration Testing

### API Endpoint Testing

```typescript
import { setupServer, teardownServer } from '../test-server';
import { apiClient } from './apiClient';

describe('User API', () => {
  beforeAll(async () => {
    await setupServer();
  });

  afterAll(async () => {
    await teardownServer();
  });

  describe('POST /api/users', () => {
    it('creates user with valid data', async () => {
      const response = await apiClient.post('/api/users', {
        name: 'Test User',
        email: 'test@example.com'
      });

      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        id: expect.any(Number),
        name: 'Test User'
      });
    });

    it('returns 400 for invalid email', async () => {
      const response = await apiClient.post('/api/users', {
        name: 'Test User',
        email: 'invalid-email'
      });

      expect(response.status).toBe(400);
      expect(response.data.error).toContain('Invalid email');
    });
  });
});
```

### Database Integration Testing

```typescript
import { dbClient } from './dbClient';
import { Task } from './models';

describe('Task Repository', () => {
  let testTask: Task;

  beforeEach(async () => {
    testTask = await dbClient.createTask({
      title: 'Test Task',
      userId: 'test-user'
    });
  });

  afterEach(async () => {
    await dbClient.deleteTask(testTask.id);
  });

  describe('getTasks', () => {
    it('returns all tasks for user', async () => {
      const tasks = await dbClient.getTasks('test-user');
      expect(tasks).toContainEqual([testTask]);
    });

    it('does not return tasks from other users', async () => {
      const otherUserTasks = await dbClient.getTasks('other-user');
      expect(otherUserTasks).not.toContain(testTask);
    });
  });
});
```

## E2E Testing

### Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('Task Management Flow', () => {
  test('should create, edit, and delete a task', async ({ page }) => {
    await page.goto('/dashboard');

    // Create task
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="task-input"]', 'Test Task');
    await page.click('[data-testid="save-button"]');

    // Verify task appears
    await expect(page.locator('text=Test Task')).toBeVisible();

    // Edit task
    await page.click('text=Test Task');
    await page.fill('[data-testid="task-input"]', 'Updated Task');
    await page.click('[data-testid="save-button"]');

    // Verify task updated
    await expect(page.locator('text=Updated Task')).toBeVisible();

    // Delete task
    await page.click('[data-testid="delete-task-button"]');
    await page.click('[data-testid="confirm-delete"]');

    // Verify task removed
    await expect(page.locator('text=Updated Task')).not.toBeVisible();
  });
});
```

### Cypress Example

```typescript
describe('User Login Flow', () => {
  it('should login with valid credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });
});
```

## Mocking

### Mocking Functions

```typescript
import { formatDate } from './dateUtils';

jest.mock('./dateUtils', () => ({
  formatDate: jest.fn((date: Date) => `formatted: ${date.toISOString()}`)
}));

describe('Component using formatDate', () => {
  it('uses formatDate utility', () => {
    render(<Component date={new Date()} />);
    expect(formatDate).toHaveBeenCalledWith(expect.any(Date));
    expect(screen.getByText('formatted:')).toBeInTheDocument();
  });
});
```

### Mocking API Calls

```typescript
import { fetchTasks } from './api';
import { mockResponse } from '../test-utils';

jest.mock('./api', () => ({
  fetchTasks: jest.fn()
}));

describe('Task List Component', () => {
  beforeEach(() => {
    (fetchTasks as jest.Mock).mockResolvedValue(
      mockResponse([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' }
      ])
    );
  });

  it('displays tasks from API', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
```

### Mocking External Services

```typescript
import { EmailService } from './email';

jest.mock('./email', () => ({
  EmailService: {
    send: jest.fn().mockResolvedValue({ success: true, id: 'email-123' })
  }
}));

describe('Notification System', () => {
  it('sends email notification', async () => {
    await sendNotification('Test Message');

    expect(EmailService.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Notification',
      body: 'Test Message'
    });
  });
});
```

## Test Data Management

### Fixtures

```typescript
// __fixtures__/users.ts
export const mockUsers = {
  authenticated: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  },
  admin: {
    id: 'user-2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
};

// __fixtures__/tasks.ts
export const mockTasks = {
  single: {
    id: 'task-1',
    title: 'Test Task',
    status: 'pending',
    priority: 'high'
  },
  multiple: [
    { id: 'task-1', title: 'Task 1', status: 'pending' },
    { id: 'task-2', title: 'Task 2', status: 'completed' }
  ]
};
```

### Factory Functions

```typescript
// __factories__/taskFactory.ts
export const createTask = (overrides: Partial<Task> = {}) => ({
  id: `task-${Math.random()}`,
  title: 'Default Task',
  status: 'pending',
  priority: 'medium',
  createdAt: new Date(),
  ...overrides
});

// Usage
const highPriorityTask = createTask({ priority: 'high', title: 'Important Task' });
```

## Best Practices

### Test Writing

- [ ] Tests are independent (can run in any order)
- [ ] Tests are deterministic (same result every run)
- [ ] Each test has clear, descriptive name
- [ ] Tests follow Arrange-Act-Assert pattern
- [ ] No test logic in production code
- [ ] Tests are readable and maintainable
- [ ] One assertion per test (when possible)
- [ ] Tests cover happy path and edge cases
- [ ] Tests verify error conditions

### Test Organization

- [ ] Tests are co-located with code being tested
- [ ] Test files mirror source structure
- [ ] Shared test utilities in common location
- [ ] Fixtures are in dedicated directory
- [ ] Test suites grouped by functionality

### Mocking

- [ ] Mock only what's necessary for the test
- [ ] Mock at the appropriate level (unit vs integration)
- [ ] Clear mock behavior is defined
- [ ] Mocks are reset between tests
- [ ] Use factory functions for test data
- [ ] Avoid over-mocking (prefer partial mocks)

### Coverage

- [ ] Aim for >80% coverage baseline
- [ ] Critical paths have >90% coverage
- [ ] Track coverage over time (improvement trend)
- [ ] Review uncovered code regularly
- [ ] Don't chase coverage at expense of test quality
- [ ] Exclude generated code from coverage

### Performance

- [ ] Tests run quickly (unit tests <5s)
- [ ] No unnecessary setup/teardown overhead
- [ ] Parallelize independent tests
- [ ] Use test database for consistency
- [ ] Clean up resources after tests

## Coverage Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: ['src'],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/types/'
  ]
};
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '*.config.ts'
      ]
    }
  }
});
```

## Test Checklist

### Before Committing

```markdown
- [ ] All new tests pass
- [ ] No skipped tests without documentation
- [ ] Coverage hasn't decreased
- [ ] No console errors or warnings in tests
- [ ] Flaky tests identified and fixed
- [ ] Tests reviewed by peer (if possible)
```

### Test Quality

```markdown
- [ ] Test name describes what is being tested
- [ ] Test follows AAA pattern (Arrange, Act, Assert)
- [ ] Clear expectations are defined
- [ ] Error cases are tested
- [ ] Edge cases are covered
- [ ] No brittle selectors (better data-testids)
- [ ] Tests are isolated from each other
```

---

**Goal**: Write comprehensive, reliable tests that ensure code quality and prevent regressions.
