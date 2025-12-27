---
name: mcp
description: This skill should be used when designing, implementing, or refactoring MCP (Model Context Protocol) servers, clients, or integrations. It specializes in using FastMCP framework as MCP master/architect, covering servers, clients, tools, resources, authentication, and production deployment.
---

# MCP Master/Architect Skill

Senior-level MCP expertise using FastMCP framework for building scalable, secure MCP servers and clients.

## MCP Fundamentals

**Model Context Protocol (MCP)**: Open protocol standardizing how AI models connect to tools, data sources, and services. Like "USB-C for AI" - universal connection layer.

**Core Concepts**:
- **Server**: Exposes tools, resources, prompts via stdio or HTTP/SSE
- **Client**: Consumes MCP servers, calls tools, reads resources
- **Transport**: stdio (local/CLI) or HTTP/SSE (remote/networked)
- **Tools**: Executable capabilities (functions)
- **Resources**: Data sources (static files, dynamic content)
- **Prompts**: Dynamic content templates
- **JSON-RPC 2.0**: Communication protocol

## FastMCP Framework

### Installation
```bash
# Python (recommended)
pip install fastmcp[cli]

# TypeScript
npm install @gofastmcp/server

# Create new server
fastmcp create my-server
```

### Quick Start - Server

```python
from fastmcp.server import Server
from fastmcp.tools import tool
from fastmcp.resources import resource
from fastmcp.templates import template

class MyServer(Server):
    @tool
    def add(self, a: int, b: int) -> int:
        return a + b

    @resource
    def get_config(self) -> dict:
        return {"api_url": "https://api.example.com"}

    @template
    def greet(self, name: str) -> str:
        return f"Hello, {name}!"

if __name__ == "__main__":
    import asyncio
    server = MyServer()
    asyncio.run(server.run())
```

### Quick Start - Client

```python
from fastmcp import Client

async with Client("http://localhost:8000/mcp") as client:
    # List all tools
    tools = await client.list_tools()
    print(f"Available tools: {tools}")

    # Call a tool
    result = await client.call_tool("add", {"a": 5, "b": 3})
    print(f"Result: {result}")

    # Read a resource
    data = await client.read_resource("resource://config")
    print(f"Config: {data}")
```

## Server Architecture

### Transport Layers

**stdio** (Default for local/CLI):
```python
from fastmcp.server import Server

server = MyServer()
asyncio.run(server.run())  # Uses stdio by default
```

**HTTP/SSE** (For networked/distributed):
```python
from fastmcp.server import Server
from fastmcp.transports import SSETransport

transport = SSETransport(host="0.0.0.0", port=8000)
server = MyServer(transport=transport)
asyncio.run(server.run())
```

### Authentication Strategies

**No Auth** (Local/Trusted):
```python
# Default - no authentication required
server = MyServer()
```

**Bearer Token** (API Key):
```python
from fastmcp import Client

async with Client(
    "https://api.example.com/mcp",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
) as client:
    result = await client.call_tool("protected_tool", {})
```

**OAuth 2.1** (Production/Third-Party):
```python
from fastmcp import Client

# Opens browser for user authorization
async with Client(
    "https://api.example.com/mcp",
    auth="oauth"
) as client:
    tools = await client.list_tools()
```

**JWT Claims** (Stateless/Auth):
```python
from fastmcp.auth import JWTClaims

@tool(jwt_claims=["user:read", "data:write"])
def sensitive_operation(self) -> str:
    return "Access granted with claims"
```

## Tools (Executable Capabilities)

### Basic Tool
```python
from fastmcp.tools import tool

@tool
def calculate_area(self, width: float, height: float) -> float:
    return width * height
```

### Tool with Schema Validation
```python
from fastmcp.tools import tool
from pydantic import BaseModel

class Rectangle(BaseModel):
    width: float
    height: float

@tool
def rectangle_area(self, rect: Rectangle) -> float:
    return rect.width * rect.height
```

### Async Tool
```python
from fastmcp.tools import tool

@tool
async def fetch_weather(self, city: str) -> dict:
    # Async operations supported
    await asyncio.sleep(1)
    return {"city": city, "temp": "72°F", "conditions": "Sunny"}
```

### Tool with Progress/Streaming
```python
from fastmcp.tools import tool, Progress

@tool
async def download_file(self, url: str) -> str:
    async with Progress() as progress:
        progress.report(0, 100, "Downloading...")
        # Simulate download
        for i in range(0, 100, 10):
            await asyncio.sleep(0.1)
            progress.update(i)
        progress.complete("Download complete!")
        return f"Downloaded: {url}"
```

## Resources (Data Sources)

### Static Resource
```python
from fastmcp.resources import resource

@resource
def get_documentation(self) -> dict:
    return {
        "uri": "resource://docs/README",
        "name": "Documentation",
        "description": "Main documentation",
        "mimeType": "text/markdown",
        "text": "# API Docs\n\n..."
    }
```

### Dynamic Resource (Generated Content)
```python
from fastmcp.resources import resource, DynamicContent

@resource
async def generate_report(self, date: str) -> DynamicContent:
    report = f"# Report for {date}\n\nGenerated at {datetime.now()}"
    return DynamicContent(
        text=report,
        mimeType="text/markdown"
    )
```

### Resource with Notifications
```python
from fastmcp.resources import resource

@resource(subscribe=True)
def live_metrics(self) -> dict:
    return {
        "uri": "resource://metrics/live",
        "name": "Live Metrics",
        "subscribe": True  # Server will push updates
    }
```

## Prompts (Content Templates)

### Basic Prompt Template
```python
from fastmcp.templates import template

@template
def summary(self, topic: str, tone: str = "professional") -> str:
    return f"""Summary of {topic}

This report provides a {tone} overview of {topic}, covering:
- Key findings
- Recommendations
- Next steps
"""
```

### Prompt with Auto-Completion
```python
from fastmcp.templates import template

@template
def code_review(self, file_path: str) -> str:
    # Template exposes parameters for auto-completion
    return f"""# Code Review: {file_path}

{{file_content}}

## Issues Found
{{issues}}

## Suggestions
{{suggestions}}
"""
```

## Multi-Server Client

### Connecting to Multiple Servers
```python
from fastmcp import Client

async with client:  # Multi-server client
    # Tools prefixed with server name
    weather = await client.call_tool("weather_get_forecast", {"city": "London"})
    calendar = await client.call_tool("calendar_list_events", {"date": "2023-06-01"})

    # Resources use server prefix
    weather_icons = await client.read_resource("weather://weather/icons/sunny")
    docs = await client.read_resource("resource://assistant/docs/mcp")
```

### Server Configuration
```python
from fastmcp import Client

servers = {
    "weather": "https://weather-api.com/mcp",
    "calendar": "https://calendar-api.com/mcp",
    "assistant": "https://assistant-api.com/mcp"
}

async with client:
    await client.configure(servers)
    tools = await client.list_tools()
```

## Capabilities (Server Configuration)

### Expose Capabilities
```python
from fastmcp.server import Server

class MyServer(Server):
    async def initialize(self):
        await self.register_capabilities(
            tools=True,              # Expose tools
            resources=True,           # Expose resources
            templates=True,           # Expose prompts
            listChanged=True,        # Notify on tool/resource changes
            subscribe=True            # Support resource subscriptions
        )
```

### Notifications (Change Management)
```python
from fastmcp.server import Server

class MyServer(Server):
    async def notify_tools_changed(self):
        # Notify all connected clients
        await self.broadcast_notification(
            method="notifications/tools/list_changed",
            params={}
        )

    async def notify_resource_updated(self, uri: str):
        await self.broadcast_notification(
            method="notifications/resources/updated",
            params={"uri": uri}
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
CMD ["python", "-m", "fastmcp", "run", "main:server"]
EXPOSE 8000
```

### Environment Configuration
```python
import os
from fastmcp.server import Server

server = MyServer()

# Runtime configuration
server.config.host = os.getenv("MCP_HOST", "0.0.0.0")
server.config.port = int(os.getenv("MCP_PORT", "8000"))
server.config.log_level = os.getenv("LOG_LEVEL", "INFO")
```

### Health Checks & Monitoring
```python
from fastmcp.server import Server

class MyServer(Server):
    @tool
    def health_check(self) -> dict:
        return {
            "status": "healthy",
            "uptime": str(self.uptime),
            "tools_count": len(self.tools),
            "resources_count": len(self.resources)
        }
```

## Best Practices

### Design Principles
1. **Idempotency**: Tools should return same result for same inputs
2. **Error Handling**: Always return structured errors with context
3. **Async First**: Use async for I/O operations
4. **Type Safety**: Use Pydantic models for validation
5. **Resource Caching**: Cache expensive resource reads
6. **Transport Agnostic**: Design for stdio AND HTTP
7. **Progress Reporting**: Long operations expose progress
8. **Security**: Validate auth on every request

### Security Checklist
- [ ] Input validation on all tool parameters
- [ ] Authentication required for sensitive operations
- [ ] Rate limiting implemented
- [ ] Secrets never logged
- [ ] TLS/HTTPS for HTTP transport
- [ ] JWT claims validated
- [ ] CORS configured for HTTP endpoints

### Performance Checklist
- [ ] Async/await used for I/O
- [ ] Connection pooling for HTTP clients
- [ ] Resource caching configured
- [ ] Streaming for large responses
- [ ] Progress reported for operations > 2s
- [ ] Lazy loading for resource lists

### Error Handling Pattern
```python
from fastmcp.tools import tool

@tool
def robust_operation(self, input: str) -> dict:
    try:
        result = process(input)
        return {"status": "success", "data": result}
    except ValidationError as e:
        return {
            "status": "error",
            "error": "validation_failed",
            "message": str(e),
            "details": {"input": input}
        }
    except Exception as e:
        return {
            "status": "error",
            "error": "internal_error",
            "message": "An unexpected error occurred",
            "details": {"error_type": type(e).__name__}
        }
```

## MCP Protocol Reference

### JSON-RPC 2.0 Pattern
```json
// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {"city": "New York"}
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{"type": "text", "text": "..."}],
    "isError": false
  }
}
```

### Resource URI Scheme
```
resource://[server]/[path]?[query]
Examples:
  - resource://config/database_url
  - resource://docs/readme?format=markdown
  - resource://files/project/src/main.py
```

## Testing

### Unit Test Tools
```python
import pytest
from my_server import MyServer

@pytest.mark.asyncio
async def test_add_tool():
    server = MyServer()
    result = await server.tools["add"](a=2, b=3)
    assert result == 5
```

### Integration Test Client
```python
import pytest
from fastmcp import Client

@pytest.mark.asyncio
async def test_client_tool_call():
    async with Client("http://localhost:8000/mcp") as client:
        result = await client.call_tool("add", {"a": 2, "b": 3})
        assert result.data == 5
```

### Test Authentication Flow
```python
async def test_oauth_flow():
    async with Client("https://api.example.com/mcp", auth="oauth") as client:
        assert await client.ping()
        tools = await client.list_tools()
        assert len(tools) > 0
```

---

**Goal**: Build production-grade MCP servers and clients that scale, secure, and provide seamless AI integrations.
