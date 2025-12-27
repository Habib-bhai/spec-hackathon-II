---
name: git-workflow
description: This skill should be used when working with Git operations, version control, commit management, branch strategies, merge conflicts, pull requests, and repository workflows. It optimizes Git usage for efficient development.
---

# Git Workflow Master Skill

Expert-level guidance for Git operations, version control, and repository workflows optimized for developer productivity.

## Quick Start

```bash
# Initialize repository
git init

# Clone repository
git clone <repository-url>

# Check status
git status

# Stage changes
git add <file>

# Commit changes
git commit -m "descriptive message"

# Push to remote
git push
```

## Core Concepts

**Commit**: Snapshot of changes with descriptive message
**Branch**: Independent line of development
**Merge**: Combining branches
**Rebase**: Moving branch tip to new base
**Stash**: Temporary save of uncommitted changes
**Remote**: Shared repository (GitHub, GitLab, etc.)

## Commit Message Best Practices

### Format: Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding/updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Examples

```
feat(dashboard): add task filtering by priority

Fixes #123

- Added filter buttons for Critical, High, Medium, Low
- Added filter by status (active/completed)
- Added reset filters button
```

```
fix(auth): resolve session expiration on page refresh

Fixes #456

- Added session refresh check on mount
- Auto-redirect to login when session invalid
- Added user notification for session expiry
```

```
docs(readme): update installation instructions

Updated documentation for new dependencies

- Added npm install steps
- Updated environment variables section
- Added troubleshooting FAQ
```

## Branching Strategies

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/task-management

# Work on feature...
git add .
git commit -m "feat(tasks): add CRUD operations"

# Push and create PR
git push -u origin feature/task-management
```

### Git Flow Workflow

```bash
# Create develop branch if not exists
git checkout -b develop

# Feature branches from develop
git checkout -b feature/new-feature develop

# Release branches from develop
git checkout -b release/v1.0.0 develop

# Hotfix branches from main
git checkout -b hotfix/critical-bug main
```

### Trunk-Based Development

```bash
# Always work on short-lived feature branches
git checkout -b feat/add-user-auth

# Rebase frequently to keep up-to-date
git fetch origin
git rebase origin/main

# Delete branch after merge
git branch -d feat/add-user-auth
```

## Common Operations

### Stashing Changes

```bash
# Stash current work
git stash save "work in progress"

# List stashes
git stash list

# Apply specific stash
git stash apply stash@{0}

# Drop stash
git stash drop stash@{0}

# Pop most recent stash
git stash pop
```

### Cherry-Picking

```bash
# Pick specific commit from another branch
git cherry-pick <commit-hash>

# Pick multiple commits
git cherry-pick <commit-hash-1>..<commit-hash-2>

# Edit during cherry-pick
git cherry-pick --edit <commit-hash>
```

### Interactive Rebase

```bash
# Squash last 3 commits
git rebase -i HEAD~3

# Rebase onto specific branch
git rebase -i origin/main

# Autosquash fix commits
git rebase --autosquash origin/main
```

## Solving Merge Conflicts

### Standard Conflict Resolution

```bash
# Rebase with conflicts
git rebase origin/main

# Resolve conflicts in files
# <edit conflicting files>

# Mark as resolved
git add <resolved-files>

# Continue rebase
git rebase --continue

# Abort rebase if needed
git rebase --abort
```

### Using Merge Tools

```bash
# Use merge tool for 3-way merge
git mergetool

# Configure merge tool
git config --global merge.tool opendiff

# Use specific merge strategy
git merge -X theirs feature-branch
git merge -X ours feature-branch
```

### Resetting After Bad Merge

```bash
# Soft reset (keep changes)
git reset --soft HEAD~1

# Mixed reset (keep index)
git reset --mixed HEAD~1

# Hard reset (discard all)
git reset --hard HEAD~1

# Reset to specific commit
git reset --hard <commit-hash>
```

## Remote Operations

### Managing Remotes

```bash
# List remotes
git remote -v

# Add remote
git remote add origin <repository-url>

# Remove remote
git remote remove origin

# Fetch all remotes
git remote update --prune

# Fetch specific branch
git fetch origin feature-branch
```

### Force Push (Careful!)

```bash
# Force push current branch
git push -f origin feature-branch

# Force push with lease
git push --force-with-lease origin feature-branch
```

## History Operations

### Viewing History

```bash
# Show commit history with decoration
git log --oneline --decorate --graph

# Show changes in commit
git show <commit-hash>

# Show file history
git log --follow <file>

# Show blame (who changed each line)
git blame <file>

# Search commit messages
git log --grep="keyword"

# Search by author
git log --author="name"
```

### Bisecting for Bug Finding

```bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark known good commit
git bisect good <commit-hash>

# Continue bisect manually
git bisect bad  # or git bisect good

# Reset after bisect
git bisect reset
```

## Working with Large Files

### Git LFS Setup

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "*.zip"

# Push LFS objects
git push origin --all
```

### Sparse Checkout

```bash
# Initialize sparse checkout
git sparse-checkout init

# Define directories to include
git sparse-checkout set <dir1> <dir2>

# Checkout with sparse config
git sparse-checkout checkout <branch>
```

## Best Practices

### Commit Hygiene

- [ ] Commit frequently and in small chunks
- [ ] Write descriptive, conventional commit messages
- [ ] Run tests before committing
- [ ] Review changes before committing (`git diff --staged`)
- [ ] Never commit sensitive data (API keys, secrets)
- [ ] Add clear subject line under 72 characters
- [ ] Separate body with blank line
- [ ] Reference issue/ticket numbers in footer

### Branch Management

- [ ] Keep branches short-lived (merge/delete promptly)
- [ ] Use descriptive branch names (feature/, fix/, hotfix/)
- [ ] Keep main/develop branches always stable
- [ ] Delete merged branches locally and remotely
- [ ] Protect important branches (main, develop) in GitHub
- [ ] Use pull requests for code review, never push directly

### Workflow Patterns

- [ ] Feature branches off main (trunk-based development)
- [ ] Require PR reviews before merging
- [ ] Require CI checks to pass before merging
- [ ] Use semantic versioning for releases
- [ ] Tag releases after merging to main
- [ ] Maintain CHANGELOG.md for version history

### Performance

- [ ] Use shallow clones for large repos (`--depth 1`)
- [ ] Use `git fetch --prune` regularly
- [ ] Avoid `git push --all` (push specific branches)
- [ ] Use partial clones for monorepos (`--filter`)
- [ ] Keep `.gitignore` updated to avoid tracking build artifacts

### Security

- [ ] Never commit `.env` files or secrets
- [ ] Use `.gitignore` for sensitive patterns
- [ ] Enable GPG signing for commits
- [ ] Require signed commits for protected branches
- [ ] Use SAML/OAuth for Git authentication, not password
- [ ] Audit commit history for leaked credentials

## Common Issues & Solutions

### Undo Last Commit

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# Create revert commit
git revert HEAD
```

### Fixing Pushed Wrong Branch

```bash
# Delete wrong remote branch
git push origin --delete feature-branch

# Push correct branch
git push -u origin feature-branch
```

### Recover Lost Commit

```bash
# Find dangling commits
git fsck --lost-found

# Recover specific commit
git cherry-pick <lost-commit-hash>
```

## Integration with CI/CD

### Pre-commit Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash
# Run tests
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed, commit aborted"
    exit 1
fi

# Run linter
npm run lint
```

### Commit Message Linting

```bash
# Install commitlint
npm install -g @commitlint/cli @commitlint/config-conventional

# Lint commit message
commitlint -e .git/COMMIT_EDITMSG

# Lint all commits
commitlint --from HEAD~10
```

---

**Goal**: Optimize Git workflow for maximum developer productivity with clean history, efficient branching, and reliable collaboration.
