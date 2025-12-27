---
id: 003
title: Create OpenAI Agents master skill
stage: general
date: 2024-12-23
surface: agent
model: claude-sonnet-4.5-20250929
feature: none
branch: master
user: Habib
command: now create one architect level skill for openai agents sdk, use context7 to fetch the docs, and create it, so i can make my agent a master of creating agentic systems using openai agents sdk.
labels: ["openai-agents","agentic-ai","multi-agent","handoffs","guardrails"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/openai-agents/SKILL.md
tests: []

---

## Prompt

now create one architect level skill for openai agents sdk, use context7 to fetch the docs, and create it, so i can make my agent a master of creating agentic systems using openai agents sdk.

## Response snapshot

Created comprehensive OpenAI Agents master skill at `.claude/skills/openai-agents/SKILL.md` with:

**Skill Metadata:**
- name: openai-agents
- description: This skill should be used when designing, implementing, or refactoring agentic systems using OpenAI Agents SDK. It specializes in multi-agent orchestration, handoffs, guardrails, sessions, and tracing for production-grade AI systems.

**Key Sections:**

1. Installation & Quick Start
   - Python: pip install, basic agent/runner examples
   - TypeScript: npm install, Agent.create/run patterns
   - Initialization: openai-agents init

2. Core Concepts
   - Agent, Handoff, Guardrail, Session, Tracing, Runner
   - Multi-agent patterns explained

3. Multi-Agent Patterns
   - Pattern 1: Triage with handoffs (route to specialists)
   - Pattern 2: Manager-Agent (centralized orchestration)
   - Pattern 3: Swarm (decentralized handoffs)

4. Handoffs (Agent Delegation)
   - Basic handoff with direct agent passing
   - Custom handoff properties (toolNameOverride, toolDescriptionOverride, onHandoff)
   - Handoff with input filter (conversation history control)
   - Recommended prompt prefix (RECOMMENDED_PROMPT_PREFIX)

5. Guardrails (Input/Output Validation)
   - Input guardrail with Pydantic models
   - Output guardrail with tripwire triggers
   - Agent with input guardrails parameter

6. Tools (External Function Calling)
   - Tool definition in Python (@tool decorator)
   - Tool definition in TypeScript (Tool interface)
   - Agent with tools configuration

7. Sessions (Persistent State)
   - SQLAlchemy session with database URL
   - Custom session provider
   - Session for agent

8. Tracing (Observability)
   - Realtime tracing with @trace decorator
   - Batch trace processor with thread management
   - Background worker patterns

9. Best Practices
   - Design principles: single responsibility, clear handoffs, guardrail safety
   - Security checklist: guardrails, validation, encryption, rate limiting
   - Performance checklist: async, connection pooling, caching, streaming, trace sampling

10. Advanced Patterns
   - Multi-tool agent with streaming
   - Stateful agent with memory
   - Recursive agent (self-correction)

11. Production Deployment
   - Docker deployment
   - Environment configuration
   - Health monitoring

**Key Patterns Documented:**
- Triage with Handoffs: Route user queries to specialist agents
- Manager-Agent Pattern: Central orchestration treating agents as tools
- Swarm Pattern: Decentralized specialist coordination
- Handoff Patterns: Direct delegation, custom properties, input filtering, prompt prefixes
- Guardrail Patterns: Input validation (Pydantic), output validation (tripwire), agent-level guardrails
- Tool Patterns: Python decorators, TypeScript Tool interface, agent configuration
- Session Patterns: SQLAlchemy database, custom providers
- Tracing Patterns: Realtime decorators, batch processors with thread management

**Code Examples Provided:**
- Basic agent creation (Python/TypeScript)
- Multi-agent triage with handoffs
- Custom handoff with callbacks and input filters
- Input guardrail with Pydantic validation
- Output guardrail with tripwire handling
- Tool definition and agent integration
- SQLAlchemy session configuration
- Custom session provider
- Realtime tracing decorator
- Batch trace processor
- Multi-tool streaming agent
- Recursive self-correcting agent
- Docker deployment
- Health check tool

## Outcome

- Impact: High - New skill transforms agent into OpenAI Agents master capable of building production-grade, multi-agent AI systems
- Tests: N/A (skill creation)
- Files: Created .claude/skills/openai-agents/SKILL.md
- Next prompts: None
- Reflection: Successfully created comprehensive OpenAI Agents master skill covering multi-agent patterns, handoffs, guardrails, sessions, tracing, tools, and production deployment. Skill provides architect-level guidance for building scalable agentic systems.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill by using it to build an actual multi-agent system with handoffs and guardrails
