---
name: code-review
description: This skill should be used when performing code reviews, analyzing pull requests, checking code quality, identifying bugs, assessing security vulnerabilities, and providing constructive feedback. It optimizes code review efficiency and thoroughness.
---

# Code Review Master Skill

Expert-level guidance for thorough, efficient, and constructive code reviews.

## Quick Start

```bash
# Review checklist items
- Code follows project conventions
- No security vulnerabilities
- No performance issues
- Tests are adequate
- Documentation is updated
- Edge cases handled
```

## Core Concepts

**Code Review**: Systematic examination of code changes for quality
**PR Review**: Reviewing pull requests before merge
**Static Analysis**: Automated code quality checks
**Security Review**: Identifying vulnerabilities and risks
**Performance Review**: Analyzing efficiency and resource usage

## Review Framework

### 1. Understanding Context

```markdown
- [ ] Read PR description thoroughly
- [ ] Understand the problem being solved
- [ ] Review related tickets/issues
- [ ] Check if there's design document
- [ ] Understand constraints and requirements
```

### 2. Code Quality Assessment

```markdown
#### Structure & Organization
- [ ] Code follows project conventions
- [ ] Functions/classes have single responsibility
- [ ] Appropriate abstraction level
- [ ] No code duplication
- [ ] Clear naming conventions
- [ ] Logical file organization

#### Correctness
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Error handling is proper
- [ ] Null/undefined checks in place
- [ ] Type safety maintained
- [ ] No off-by-one errors

#### Maintainability
- [ ] Code is readable and clear
- [ ] Complex logic is commented
- [ ] Magic numbers avoided or explained
- [ ] No hard-to-understand constructs
- [ ] Dead code removed, not commented out
```

### 3. Security Review

```markdown
#### Input Validation
- [ ] All user inputs are validated
- [ ] Sanitization of user input
- [ ] Protection against injection attacks
- [ ] No eval() on user input
- [ ] Length limits enforced

#### Output Handling
- [ ] No sensitive data leaked in logs/errors
- [ ] XSS prevention (escaped output)
- [ ] Safe handling of user content
- [ ] Error messages don't expose internals

#### Authentication & Authorization
- [ ] Proper auth checks on endpoints
- [ ] Authorization verified for actions
- [ ] Session management is secure
- [ ] No hardcoded credentials

#### Dependencies
- [ ] Dependencies are up-to-date
- [ ] No known vulnerable packages
- [ ] License compatibility verified
- [ ] Minimal dependencies used
```

### 4. Performance Review

```markdown
#### Efficiency
- [ ] Algorithm complexity is appropriate
- [ ] No nested loops that can be optimized
- [ ] Proper caching strategy
- [ ] Efficient data structures used
- [ ] Pagination/lazy loading for large datasets

#### Resource Usage
- [ ] No memory leaks
- [ ] File handles/connections properly closed
- [ ] No unnecessary recomputation
- [ ] Efficient database queries (indexed, not N+1)
- [ ] Appropriate use of async/await
```

### 5. Testing Review

```markdown
#### Test Coverage
- [ ] Unit tests added for new code
- [ ] Integration tests cover flows
- [ ] Edge cases tested
- [ ] Tests are readable and maintainable
- [ ] No skipped tests without reason

#### Test Quality
- [ ] Tests are deterministic
- [ ] Proper setup/teardown
- [ ] Test data is realistic
- [ ] Error scenarios tested
- [ ] Mocks are appropriate
```

### 6. Documentation Review

```markdown
- [ ] Code is self-documenting (good names)
- [ ] Complex logic has comments
- [ ] API endpoints documented
- [ ] README updated if needed
- [ ] Breaking changes noted
- [ ] Environment variables documented
```

## Constructive Feedback Guidelines

### Feedback Format

```markdown
### Issue: [Brief description of problem]

**Location**: `file:line`

**Impact**: [Low/Medium/High]

**Suggestion**: [Specific actionable recommendation]

**Example**:
```typescript
// Bad - unclear variable name
const d = data.map(x => x * 2);

// Good - descriptive name
const doubledValues = data.map(x => x * 2);
```

**Rationale**: [Why this change is important]
```

### Common Issues & Suggestions

```markdown
#### Code Duplication
**Issue**: `src/utils/validation.ts:45-48` duplicates logic from `src/helpers/parser.ts:12-15`

**Suggestion**: Extract to shared utility function `parseAndValidate()` and import in both locations

**Impact**: Medium

**Rationale**: Reduces maintenance burden and ensures consistent validation logic across codebase
```

#### Magic Numbers
**Issue**: `src/config.ts:23` uses undefined constant `86400`

**Suggestion**: Define as named constant `const SECONDS_IN_DAY = 86400`

**Impact**: Low

**Rationale**: Improves code readability and makes intent explicit
```

#### Large Functions
**Issue**: `src/services/user.ts:150-280` function is 80 lines with nested logic

**Suggestion**: Split into smaller functions: `validateUser()`, `updateUser()`, `sendNotification()`

**Impact**: Medium

**Rationale**: Improves testability, reusability, and cognitive load for reviewers
```

#### Missing Error Handling
**Issue**: `src/api/client.ts:67` async call has no try-catch

**Suggestion**: Wrap in try-catch and handle errors appropriately

**Impact**: High

**Rationale**: Prevents unhandled promise rejections crashing the application
```

#### Security: Unescaped Output
**Issue**: `src/components/Message.ts:45` renders user content without sanitization

**Suggestion**: Use framework's XSS prevention or manually escape before rendering

**Impact**: Critical

**Rationale**: XSS vulnerability allows malicious script injection
```

#### Performance: N+1 Query
**Issue**: `src/repositories/task.ts:89` queries inside loop without batching

**Suggestion**: Use batch query or preload with `IN` clause

**Impact**: Medium

**Rationale**: Current approach causes O(n) database queries instead of O(1)
```

## Review Templates

### Feature Addition Review

```markdown
## Summary
Overall: ✅ Approve / ⚠️ Request Changes / ❌ Request Changes

## Positive Aspects
- Good code organization
- Clear naming conventions
- Comprehensive tests added

## Areas for Improvement
1. **Security**: Input validation on line 45 needs to handle empty arrays
2. **Performance**: Consider caching API responses for reduced latency
3. **Documentation**: README update needed for new configuration option

## Code Examples

#### Before (Needs Improvement)
```typescript
const result = data.map(item => {
  return process(item)
}).filter(item => item.active)
```

#### After (Suggested)
```typescript
const result = data
  .filter(item => item.active)
  .map(item => process(item));
```

**Rationale**: Filter first to avoid processing inactive items

## Questions
- Is there a specific reason for the chosen data structure?
- Have you considered error handling for the network call?
```

### Bug Fix Review

```markdown
## Summary
Overall: ✅ Approve / ⚠️ Request Changes / ❌ Request Changes

## Bug Analysis
**Root Cause**: The issue was caused by [describe]
**Fix Approach**: [explain the fix]
**Effectiveness**: [Resolves the issue / Partially resolves / Does not resolve]

## Testing
- [ ] Regression tests pass
- [ ] Edge cases tested
- [ ] Error scenarios handled

## Code Quality
- [ ] Fix is minimal and targeted
- [ ] No new issues introduced
- [ ] Related code improved

## Suggestions
1. Consider adding integration test for this edge case
2. Document the error condition in API docs
3. Consider adding monitoring for this failure mode
```

### Refactoring Review

```markdown
## Summary
Overall: ✅ Approve / ⚠️ Request Changes / ❌ Request Changes

## Refactoring Goals
- [ ] Improved code readability
- [ ] Reduced complexity
- [ ] Better separation of concerns
- [ ] Enhanced testability

## Changes Made
### Structural Changes
- Extracted `validate()` to separate utility
- Moved `formatDate()` to shared helpers
- Consolidated API calls into service layer

### Behavioral Changes
- No observable changes in functionality
- Same input-output contracts
- Maintains backward compatibility

## Risk Assessment
- [ ] Low risk: Clear boundaries, well-tested
- [ ] Medium risk: Multiple files changed
- [ ] High risk: Core data structures modified

## Testing
- [ ] All existing tests pass
- [ ] New tests added for refactored code
- [ ] Integration tests verify behavior unchanged

## Suggestions
1. Consider adding deprecation notice for old API
2. Update documentation to reflect new structure
3. Consider adding type guards for better safety
```

## Automated Review Tools

### Static Analysis

```bash
# ESLint for JavaScript/TypeScript
npm run lint

# Prettier for formatting
npm run format:check

# Type checking
npx tsc --noEmit

# Security audit
npm audit

# OWASP dependency check
npm audit --audit-level=moderate
```

### Security Scanners

```bash
# Semgrep for security patterns
semgrep --config=auto --error

# Snyk for vulnerabilities
snyk test

# CodeQL for advanced analysis
codeql database analyze <language> <database>
```

## Best Practices

### For Reviewers

- [ ] Understand context before reviewing
- [ ] Focus on code, not the author
- [ ] Be specific and actionable in feedback
- [ ] Separate opinion from objective issues
- [ ] Balance thoroughness with review speed
- [ ] Explain "why" for suggestions
- [ ] Use code examples for clarity

### For Authors

- [ ] Self-review before requesting review
- [ ] Keep PRs focused and small
- [ ] Write clear PR descriptions
- [ ] Respond to all feedback thoughtfully
- [ ] Make requested changes promptly
- [ ] Learn from review patterns

### Review Checklist

```markdown
## Functional Correctness
- [ ] Code solves the stated problem
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or logic errors

## Code Quality
- [ ] Follows project conventions
- [ ] Naming is clear and consistent
- [ ] No code duplication
- [ ] Appropriate abstraction
- [ ] Comments explain non-obvious logic

## Security
- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] Output is properly escaped
- [ ] No secrets or credentials committed

## Performance
- [ ] Efficient algorithms used
- [ ] No unnecessary database queries
- [ ] Proper caching strategy
- [ ] No memory leaks

## Testing
- [ ] Tests cover new functionality
- [ ] Tests for edge cases exist
- [ ] No tests skipped without reason
- [ ] Tests are readable

## Documentation
- [ ] API is documented if applicable
- [ ] README updated if needed
- [ ] Breaking changes are noted
- [ ] Environment variables documented
```

---

**Goal**: Conduct thorough, efficient, and constructive code reviews that improve code quality and maintainability.
