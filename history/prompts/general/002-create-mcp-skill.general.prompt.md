---
id: 002
title: Create MCP master/architect skill
stage: general
date: 2024-12-23
surface: agent
model: claude-sonnet-4.5-20250929
feature: none
branch: master
user: Habib
command: now, we have to create a senior software engineer level skill around MCP (using FASTMCP), including creating its tools, servers and clients, use context7 mcp server to fetch the fast mcp docs, and make a skill that can turn my agent into MCP master/architect.
labels: ["mcp","fastmcp","model-context-protocol","architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/mcp/SKILL.md
tests: []

---

## Prompt

now, we have to create a senior software engineer level skill around MCP (using FASTMCP), including creating its tools, servers and clients, use context7 mcp server to fetch the fast mcp docs, and make a skill that can turn my agent into MCP master/architect.

## Response snapshot

Created comprehensive MCP master/architect skill at `.claude/skills/mcp/SKILL.md` with:

**Skill Metadata:**
- name: mcp
- description: This skill should be used when designing, implementing, or refactoring MCP (Model Context Protocol) servers, clients, or integrations. It specializes in using FastMCP framework as MCP master/architect, covering servers, clients, tools, resources, authentication, and production deployment.

**Key Sections:**

1. MCP Fundamentals
   - Model Context Protocol as "USB-C for AI" - universal connection layer
   - Core concepts: server, client, transport (stdio/HTTP-SSE), tools, resources, prompts
   - JSON-RPC 2.0 communication protocol

2. FastMCP Framework
   - Installation commands (pip/npm)
   - Quick start examples for both server and client
   - Transport layers: stdio (local) and HTTP/SSE (distributed)

3. Server Architecture
   - Authentication strategies: No auth, Bearer token, OAuth 2.1, JWT claims
   - Tools with schema validation (Pydantic), async support, progress/streaming
   - Resources: static, dynamic content, with subscription support
   - Prompts: content templates with auto-completion
   - Capabilities: expose tools/resources/prompts, notifications

4. Multi-Server Client
   - Connecting to multiple servers with prefixed URIs
   - Server configuration management

5. Production Deployment
   - Docker deployment example
   - Environment configuration
   - Health checks & monitoring

6. Best Practices
   - Design principles: idempotency, error handling, async-first, type safety
   - Security checklist: validation, auth, rate limiting, secrets, TLS/HTTPS
   - Performance checklist: async/await, connection pooling, caching, streaming, progress
   - Error handling pattern with structured responses

7. MCP Protocol Reference
   - JSON-RPC 2.0 request/response patterns
   - Resource URI scheme (resource://[server]/[path])

8. Testing
   - Unit tests for tools
   - Integration tests for clients
   - OAuth flow testing

**Code Examples Provided:**
- Basic server with tool/resource/template
- Tool with Pydantic schema validation
- Async tool with progress reporting
- Client with OAuth authentication
- Multi-server client configuration
- Docker deployment
- Health check tool
- Robust error handling pattern

**Key Patterns Documented:**
- Transport layering (stdio for local, SSE for distributed)
- Authentication strategies (bearer, OAuth, JWT claims)
- Resource types (static, dynamic, with notifications)
- Tool capabilities (sync/async, with streaming/progress)
- Server capabilities registration
- Change notification broadcasting

## Outcome

- Impact: High - New skill transforms agent into MCP specialist capable of building production-grade servers and clients
- Tests: N/A (skill creation)
- Files: Created .claude/skills/mcp/SKILL.md
- Next prompts: None
- Reflection: Successfully created comprehensive MCP master skill covering FastMCP framework, authentication strategies, tools/resources/prompts, production deployment, testing, and best practices. Skill is ready to guide agent in building scalable, secure MCP integrations.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill by using it to build an actual MCP server
