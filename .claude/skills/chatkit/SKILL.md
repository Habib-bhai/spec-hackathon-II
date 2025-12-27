---
name: chatkit
description: This skill should be used when designing, implementing, or refactoring AI-powered chat interfaces using OpenAI ChatKit. It specializes in UI customization, response streaming, tool integration, and production-ready chat experiences.
---

# ChatKit UI/UX Master Skill

Expert-level guidance for building high-quality, AI-powered chat experiences with OpenAI ChatKit.

## Installation

```bash
# React (recommended)
npm install @openai/chatkit-react

# Vanilla JavaScript
npm install @openai/chatkit-js

# TypeScript types included
npm install @openai/chatkit-react
```

## Quick Start - React

```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

function MyChat({ clientToken }: { clientToken: string }) {
  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        return data.client_secret;
      }
    }
  });

  return <ChatKit control={control} className="h-[600px] w-[320px]" />;
}
```

## Quick Start - Vanilla JavaScript

```js
function InitChatkit({ clientToken }) {
  const chatkit = document.createElement('openai-chatkit');
  chatkit.setOptions({
    api: {
      clientToken,
      getClientSecret: async () => {
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        return data.client_secret;
      }
    }
  });
  chatkit.classList.add('h-[600px]', 'w-[320px]');
  document.body.appendChild(chatkit);
}
```

## Core Concepts

**ChatKit**: Production-ready UI component for AI chat experiences
**useChatKit**: React hook providing control object and configuration
**control**: Object managing chat state, messages, and interactions
**clientToken**: Authentication token for OpenAI API
**clientSecret**: Backend-generated secret for secure API calls
**Composer**: Text input area with tool selection and attachments
**Tools**: Custom actions available in the composer (client-side functions)
**Streaming**: Real-time message display as AI generates responses

## Theme & UI Customization

### Basic Theme Setup

```tsx
const { control } = useChatKit({
  theme: {
    colorScheme: "dark",
    color: {
      accent: {
        primary: "#2D8CFF",
        level: 2
      }
    },
    radius: "round",
    density: "compact",
    typography: { fontFamily: "'Inter', sans-serif" }
  },
});
```

### Custom Composer Tools

```tsx
const { control } = useChatKit({
  composer: {
    placeholder: 'What would you like to do?',
    tools: [
      {
        id: 'add-note',
        label: 'Add Note',
        icon: 'write',
        pinned: true
      },
      {
        id: 'code-review',
        label: 'Code Review',
        icon: 'square-code',
        pinned: true
      },
      {
        id: 'search-docs',
        label: 'Search Docs',
        icon: 'search',
        pinned: false
      }
    ]
  }
});
```

### Custom Header Actions

```tsx
const { control } = useChatKit({
  header: {
    leftAction: {
      icon: "settings-cog",
      onClick: () => alert("Settings"),
    },
    rightAction: {
      icon: "user",
      onClick: () => navigateToProfile(),
    }
  }
});
```

### Custom Start Screen

```tsx
const { control } = useChatKit({
  startScreen: {
    greeting: "Welcome to DevBot!",
    prompts: [
      {
        name: "Debug Code",
        prompt: "Help me debug this code:",
        icon: "bug"
      },
      {
        name: "Review PR",
        prompt: "Review this pull request:",
        icon: "git-pull"
      },
      {
        name: "Explain Function",
        prompt: "Explain this function:",
        icon: "code"
      }
    ]
  },
});
```

## Client Tools Integration

### Basic Client Tool Handler

```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import type { ChatKitOptions } from '@openai/chatkit';

type ClientToolCall =
  | { name: 'send_email'; params: { email_id: string } }
  | { name: 'open_url'; params: { url: string } }
  | { name: 'get_user_info'; params: {} };

export function ChatWithClientTools({ clientToken }: { clientToken: string }) {
  const { control } = useChatKit({
    api: { clientToken },
    onClientTool: async (toolCall) => {
      const { name, params } = toolCall as ClientToolCall;

      switch (name) {
        case 'send_email':
          const result = await sendEmail(params.email_id);
          return { success: result.ok, id: result.id };

        case 'open_url':
          window.open(params.url, '_blank', 'noopener');
          return { opened: true };

        case 'get_user_info':
          const userInfo = await fetchUserInfo();
          return { user: userInfo };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    },
  } satisfies ChatKitOptions);

  return <ChatKit control={control} className="h-[600px] w-[320px]" />;
}
```

### Client Tools with State Management

```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useState } from 'react';

function ChatWithModals({ clientToken }: { clientToken: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        return (await res.json()).client_secret;
      }
    },
    onClientTool: async ({ name, params }) => {
      switch (name) {
        case 'show_modal':
          setModalContent(params.content as string);
          setIsModalOpen(true);
          return { success: true };

        case 'navigate':
          window.location.href = params.url as string;
          return { success: true };

        case 'copy_to_clipboard':
          try {
            await navigator.clipboard.writeText(params.text as string);
            return { success: true };
          } catch (error) {
            return { error: 'Clipboard access denied' };
          }

        default:
          return { error: `Unknown tool: ${name}` };
      }
    },
  });

  return (
    <>
      <ChatKit control={control} className="h-[600px] w-[400px]" />
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalContent}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

## Entity Integration (Tag Search & Previews)

### Entity Search Configuration

```tsx
const { control } = useChatKit({
  entities: {
    onTagSearch: async (query: string) => {
      const results = await searchEntities(query);
      return [
        { id: "user_123", title: "Jane Doe" },
        { id: "task_456", title: "Fix authentication bug" },
        { id: "doc_789", title: "API Documentation" }
      ];
    },
    onRequestPreview: async (entity: { id: string, title: string }) => {
      const details = await fetchEntityDetails(entity.id);
      return {
        preview: {
          type: "Card",
          children: [
            { type: "Text", value: `Title: ${entity.title}` },
            { type: "Text", value: `Type: ${details.type}` },
            { type: "Text", value: `Status: ${details.status}` }
          ]
        }
      };
    }
  }
  }
});
```

## UI Regions Control

### Disable History & Header

```tsx
const options: Partial<ChatKitOptions> = {
  history: { enabled: false },
  header: { enabled: false }
};
```

## Best Practices

### Design Principles

1. **User-Centric**: Design chat experience around user workflow and mental model
2. **Progressive Disclosure**: Start with simple interface, reveal complexity on demand
3. **Clear Feedback**: Instant visual feedback for all user actions
4. **Accessibility**: Keyboard navigation, screen reader support, focus management
5. **Performance**: Streaming responses, lazy loading, minimal bundle size
6. **Security**: Never expose secrets on frontend, always use clientSecret
7. **Responsive**: Works on desktop, tablet, and mobile devices
8. **Theme Flexibility**: Support light/dark modes and custom branding

### Security Checklist

- [ ] Never hardcode API keys or secrets in frontend code
- [ ] Always fetch clientSecret from your backend
- [ ] Use secure, encrypted connections (HTTPS)
- [ ] Validate all user inputs before sending to AI
- [ ] Sanitize and escape all user-generated content
- [ ] Implement rate limiting on clientSecret endpoint
- [ ] Use short-lived tokens with proper expiration
- [ ] Never log sensitive data (API keys, secrets, PII)

### Performance Checklist

- [ ] Use streaming for AI responses (enabled by default)
- [ ] Lazy load historical messages
- [ ] Virtual scroll for large message lists
- [ ] Optimize images and media
- [ ] Code splitting for ChatKit component
- [ ] Debounce search and filter inputs
- [ ] Cache API responses where appropriate
- [ ] Preload critical resources

### UX Checklist

- [ ] Provide loading states for async operations
- [ ] Handle errors gracefully with clear messages
- [ ] Support keyboard shortcuts (Enter to send, Escape to close)
- [ ] Show typing indicators for AI responses
- [ ] Provide clear affordances for all interactive elements
- [ ] Test on multiple devices and screen sizes
- [ ] Test with screen readers (NVDA, VoiceOver)
- [ ] Test with keyboard-only navigation
- [ ] Respect user motion preferences (prefers-reduced-motion)

## Advanced Patterns

### Multi-Mode Chat Application

```tsx
const { control } = useChatKit({
  composer: {
    tools: [
      {
        id: 'general',
        label: 'General Chat',
        shortLabel: 'Chat',
        icon: 'sparkle',
        placeholderOverride: 'Ask me anything...',
        pinned: true
      },
      {
        id: 'code',
        label: 'Code Assistant',
        shortLabel: 'Code',
        icon: 'square-code',
        placeholderOverride: 'Describe what code you need...',
        pinned: true
      },
      {
        id: 'debug',
        label: 'Debugging Helper',
        shortLabel: 'Debug',
        icon: 'bug',
        placeholderOverride: 'Paste error or stack trace...',
        pinned: false
      }
    ]
  }
});
```

### Context-Aware Chat Application

```tsx
function ContextualChat({ documentId, userId, clientToken }) {
  const { control } = useChatKit({
    api: {
      clientToken,
      getClientSecret: async () => {
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          body: JSON.stringify({ documentId, userId }),
          headers: { 'Content-Type': 'application/json' }
        });
        return (await res.json()).client_secret;
      }
    },
    composer: {
      placeholder: `Ask about document #${documentId}...`
    },
    startScreen: {
      prompts: [
        {
          name: "Summarize",
          prompt: `Summarize document #${documentId}`,
          icon: "file-text"
        },
        {
          name: "Find References",
          prompt: `Find references in #${documentId}`,
          icon: "link"
        }
      ]
    }
  });

  return <ChatKit control={control} className="h-[700px] w-[500px]" />;
}
```

## Integration Patterns

### Backend Session Endpoint (Next.js App Router)

```typescript
// app/api/chatkit/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  // Validate user authentication
  const user = await authenticateUser(userId);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Generate client secret for ChatKit
  const clientSecret = await generateChatKitSecret(user.id);

  return NextResponse.json({
    client_secret: clientSecret
  });
}
```

### Backend Session Endpoint (FastAPI)

```python
from fastapi import FastAPI
from pydantic import BaseModel

class SessionRequest(BaseModel):
    userId: str

@app.post("/api/chatkit/session")
async def create_session(request: SessionRequest):
    user = await get_user(request.userId)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    client_secret = await generate_chatkit_secret(user.id)
    return {"client_secret": client_secret}
```

## Production Deployment

### Environment Configuration

```typescript
const chatkitConfig: Partial<ChatKitOptions> = {
  api: {
    clientToken: process.env.NEXT_PUBLIC_OPENAI_CLIENT_TOKEN!,
    getClientSecret: async () => {
      const res = await fetch('/api/chatkit/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const data = await res.json();
      return data.client_secret;
    }
  },
  theme: {
    colorScheme: process.env.NEXT_PUBLIC_THEME || 'system',
    color: {
      accent: {
        primary: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#2D8CFF',
        level: 2
      }
    }
  }
};
```

### Error Handling

```tsx
const { control } = useChatKit({
  onClientTool: async (toolCall) => {
    try {
      const result = await executeTool(toolCall);
      return { success: true, data: result };
    } catch (error) {
      console.error('Tool execution failed:', error);
      return {
        error: 'Failed to execute tool',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
```

---

**Goal**: Build production-ready, visually compelling chat interfaces with seamless AI integration, secure authentication, and excellent user experience.
