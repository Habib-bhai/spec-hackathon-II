---
name: openai-agents
description: This skill should be used when designing, implementing, or refactoring agentic systems using OpenAI Agents SDK. It specializes in multi-agent orchestration, handoffs, guardrails, sessions, and tracing for production-grade AI systems.
---

# OpenAI Agents Master Skill

Senior-level expertise for building scalable, multi-agent AI systems using OpenAI Agents SDK.

## Installation

```bash
# Python (recommended)
pip install openai-agents

# TypeScript/JavaScript
npm install @openai/agents

# Initialize project
openai-agents init my-agent-system
```

## Quick Start - Python

```python
from agents import Agent, Runner

agent = Agent(
    name="Customer Support",
    instructions="You are a customer support agent."
)

result = await Runner.run(agent, "How can I help you?")
print(result.final_output)
```

## Quick Start - TypeScript

```typescript
import { Agent, run } from '@openai/agents';

const agent = new Agent({
  name: 'Customer Support',
  instructions: 'You are a customer support agent.'
});

const result = await run(agent, 'How can I help you?');
console.log(result.finalOutput);
```

## Core Concepts

**Agent**: Autonomous entity with instructions, tools, optional handoffs/guardrails
**Handoff**: Delegation mechanism where agent transfers conversation to specialized sub-agent
**Guardrail**: Input/output validation that can block/tripwire requests
**Session**: Persistent conversation state across interactions (memory, history)
**Tracing**: Built-in observability for debugging and monitoring
**Runner**: Executes agent with conversation history, context management

## Multi-Agent Patterns

### Pattern 1: Triage with Handoffs
```python
from agents import Agent, handoff

math_agent = Agent(name="Math Tutor", handoff_description="Math specialist")
history_agent = Agent(name="History Tutor", handoff_description="History specialist")

triage_agent = Agent(
    name="Triage",
    instructions="Route user queries to appropriate specialist",
    handoffs=[math_agent, history_agent]
)
```

### Pattern 2: Manager-Agent (Centralized)
```python
from agents import Agent

booking_agent = Agent(name="Booking", tools=[book_tool])
refund_agent = Agent(name="Refund", tools=[refund_tool])

manager = Agent(
    name="Manager",
    instructions="Orchestrate booking and refund operations",
    tools=[booking_agent, refund_agent]  # Treat agents as tools
)
```

### Pattern 3: Swarm (Decentralized Handoffs)
```python
from agents import Agent

specialist_1 = Agent(name="Research Specialist")
specialist_2 = Agent(name="Analysis Specialist")
specialist_3 = Agent(name="Reporting Specialist")

# Each specialist can handoff to others
swarm_agent = Agent(
    name="Coordinator",
    handoffs=[specialist_1, specialist_2, specialist_3]
)
```

## Handoffs (Agent Delegation)

### Basic Handoff
```python
from agents import Agent, handoff

billing_agent = Agent(name="Billing")
refund_agent = Agent(name="Refund")

main_agent = Agent(
    name="Main",
    instructions="Route to billing or refund agent",
    handoffs=[billing_agent, refund_agent]
)
```

### Custom Handoff Properties (TypeScript)
```typescript
import { Agent, handoff } from '@openai/agents';

const specialist = new Agent({ name: 'Specialist', ... });

const main = new Agent({
  name: 'Main',
  tools: [
    handoff({
      agent: specialist,
      toolNameOverride: 'delegate_task',
      toolDescriptionOverride: 'Delegate to specialist agent',
      onHandoff: async (ctx, input) => {
        console.log('Handoff initiated:', input);
      },
      inputType: z.object({
        task: z.string().describe('Task description')
      })
    })
  ]
});
```

### Handoff with Input Filter
```python
from agents import Agent, handoff
from agents.extensions import handoff_filters

agent = Agent(
    name="Clean Agent",
    handoffs=[specialist],
    input_filter=handoff_filters.remove_all_tools  # (1)
)
```

### Recommended Handoff Prompt
```python
from agents import Agent
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX

agent = Agent(
    name="Specialist",
    instructions=f"{RECOMMENDED_PROMPT_PREFIX}\nYou are a specialist agent..."
)
```

## Guardrails (Input/Output Validation)

### Input Guardrail
```python
from agents import Agent, InputGuardrail, OutputGuardrail
from pydantic import BaseModel

class MathOutput(BaseModel):
    is_math: bool
    reasoning: str

guardrail_agent = Agent(
    name="Guardrail",
    instructions="Check if user is asking for math homework",
    output_type=MathOutput
)

async def math_guardrail(ctx, agent, output):
    result = await Runner.run(guardrail_agent, output, context=ctx.context)
    final = result.final_output_as(MathOutput)
    return OutputGuardrail(
        output_info=final,
        tripwire_triggered=not final.is_math
    )

agent = Agent(
    name="Customer Support",
    instructions="Help customers",
    input_guardrails=[math_guardrail]
)
```

### Output Guardrail
```python
from agents import Agent, OutputGuardrail

@output_guardrail
async def safety_check(ctx, agent, output):
    result = await Runner.run(safety_agent, output, context=ctx.context)
    final = result.final_output
    if final.contains_harmful_content():
        return OutputGuardrail(
            output_info="Refused: Harmful content",
            tripwire_triggered=True
        )
    return OutputGuardrail(output_info=final, tripwire_triggered=False)

agent = Agent(
    name="Safe Agent",
    instructions="Be helpful and safe",
    output_guardrails=[safety_check]
)
```

## Tools (External Function Calling)

### Tool Definition (Python)
```python
from agents import tool

@tool
def calculate_area(self, width: float, height: float) -> float:
    return width * height

agent = Agent(
    name="Calculator",
    tools=[calculate_area]
)
```

### Tool Definition (TypeScript)
```typescript
import { Agent, tool } from '@openai/agents';

const weatherTool = tool({
  name: 'get_weather',
  description: 'Get weather for a city',
  parameters: z.object({
    city: z.string().describe('City name')
  }),
  execute: async (input) => {
    return `Weather in ${input.city} is 72°F`;
  }
});

const agent = new Agent({
  name: 'Weather Agent',
  tools: [weatherTool]
});
```

## Sessions (Persistent State)

### SQLAlchemy Session
```python
from agents.sessions import SQLAlchemySession

session = SQLAlchemySession.from_url(
    database_url="postgresql://user:pass@localhost:5432/db",
    create_tables=True
)

agent = Agent(session=session)
```

### Custom Session Provider
```python
from agents import Agent, Session
from sqlalchemy import create_engine

class CustomSession(Session):
    def save_state(self, session_id, data):
        # Custom storage logic
        pass

agent = Agent(session=CustomSession())
```

## Tracing (Observability)

### Realtime Tracing
```python
from agents import Agent
from agents.tracing import trace

@trace
async def process_request(self, user_input: str):
    # Auto-traced execution
    result = await some_async_operation()
    return result

agent = Agent(
    name="Traced Agent",
    instructions="Process with tracing enabled"
)
```

### Batch Trace Processor
```python
from agents.tracing.processors import BatchTraceProcessor

processor = BatchTraceProcessor()

# Tracing with thread management
processor._ensure_thread_started()
```

## Best Practices

### Design Principles
1. **Single Responsibility**: Each agent has one clear purpose
2. **Clear Handoffs**: Explicit description for when to delegate
3. **Guardrail Safety**: Always validate before/during execution
4. **Session Persistence**: Maintain conversation context
5. **Error Handling**: Graceful degradation when services fail
6. **Type Safety**: Use Pydantic (Python) / Zod (TypeScript)
7. **Async First**: Use async for all I/O operations
8. **Observability**: Enable tracing for production debugging

### Security Checklist
- [ ] Guardrails on all external inputs
- [ ] Output validation for harmful content
- [ ] Session encryption
- [ ] Tool parameter validation
- [ ] Handoff authentication
- [ ] No secrets in logs/traces
- [ ] Rate limiting on tools

### Performance Checklist
- [ ] Async/await for I/O
- [ ] Connection pooling for sessions
- [ ] Caching for tool results
- [ ] Streaming for long operations
- [ ] Lazy session loading
- [ ] Trace sampling (avoid 100%)
- [ ] Batch processing for traces

## Advanced Patterns

### Multi-Tool Agent with Streaming
```python
from agents import Agent, Tool

@tool
async def search_files(self, query: str):
    async for file in find_files(query):
        yield {"file": file}  # Streaming results

agent = Agent(
    name="File Searcher",
    tools=[search_files]
)
```

### Stateful Agent with Memory
```python
from agents import Agent, Session

agent = Agent(
    name="Knowledge Agent",
    session=MemorySession()  # Custom persistent session
    instructions="Remember important information"
)
```

### Recursive Agent (Self-Correction)
```python
from agents import Agent

@tool
async def verify_result(self, result: str) -> dict:
    # Self-correction tool
    return {"valid": self._verify(result), "confidence": 0.9}

agent = Agent(
    name="Verification Agent",
    instructions="Verify all outputs before finalizing",
    tools=[verify_result]
)
```

## Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "-m", "agents", "run"]
```

### Environment Configuration
```python
import os
from agents import Agent

agent = Agent(
    name="Production Agent",
    instructions=os.getenv("AGENT_INSTRUCTIONS", "Default instructions"),
    model=os.getenv("OPENAI_MODEL", "gpt-4o")
)
```

### Health Monitoring
```python
from agents import Agent

@tool
async def health_check(self) -> dict:
    return {
        "status": "healthy",
        "agents_count": len(self.handoffs),
        "active_sessions": self.session.count()
    }

agent = Agent(
    name="Monitor",
    tools=[health_check]
)
```

---

**Goal**: Build production-grade, multi-agent systems with clear handoffs, robust guardrails, persistent sessions, and full observability.
