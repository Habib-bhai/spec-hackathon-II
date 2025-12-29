# Quickstart: Premium Frontend Redesign

**Feature Branch**: `005-frontend-redesign`
**Date**: 2025-12-28

## Prerequisites

- Node.js 18+
- npm or pnpm
- Existing `full-stack-todo` frontend running

---

## 1. Install Dependencies

```bash
cd frontend
npm install gsap @gsap/react
```

Or with pnpm:
```bash
pnpm add gsap @gsap/react
```

---

## 2. Setup GSAP Module

Create the GSAP registration file:

```typescript
// frontend/lib/gsap/index.ts
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins (browser-only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
```

---

## 3. Add Design Tokens

Import the design tokens in your global styles:

```css
/* frontend/app/globals.css */
@import '../styles/design-tokens.css';

body {
  font-family: var(--font-family-primary);
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}
```

---

## 4. Configure Poppins Font

Update the root layout:

```typescript
// frontend/app/layout.tsx
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 5. Basic Animation Example

### Scroll-Triggered Entrance

```typescript
'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function TaskList({ tasks }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.task-card', {
      y: 30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          {task.title}
        </div>
      ))}
    </div>
  );
}
```

### Hover Animation

```typescript
'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function TaskCard({ task }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: cardRef });

  const onMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, {
      y: -4,
      boxShadow: 'var(--shadow-lg)',
      duration: 0.2,
      ease: 'power2.out',
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: 'var(--shadow-md)',
      duration: 0.15,
      ease: 'power2.in',
    });
  });

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="task-card"
    >
      {task.title}
    </div>
  );
}
```

### Modal Animation

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function Modal({ isOpen, onClose, children }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    tlRef.current = gsap.timeline({ paused: true });
    tlRef.current
      .to(overlayRef.current, { opacity: 1, duration: 0.2 })
      .fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
        '-=0.1'
      );
  }, { scope: overlayRef });

  useEffect(() => {
    if (isOpen) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="modal-overlay" onClick={onClose}>
      <div ref={contentRef} className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

---

## 6. Reduced Motion Support

Always respect user preferences:

```typescript
'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function AnimatedComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip animation, set final state
      gsap.set('.animated-element', { opacity: 1, y: 0 });
      return;
    }

    // Full animation
    gsap.from('.animated-element', {
      y: 30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
    });
  }, { scope: containerRef });

  return <div ref={containerRef}>...</div>;
}
```

---

## 7. Using Animation Presets

Import presets from the shared module:

```typescript
// frontend/lib/gsap/animations.ts
export const animationPresets = {
  fadeInUp: {
    y: 30,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  },
  scaleIn: {
    scale: 0.95,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
  },
  hoverElevate: {
    y: -4,
    duration: 0.2,
    ease: 'power2.out',
  },
  shake: {
    keyframes: {
      x: [-10, 10, -10, 10, 0],
    },
    duration: 0.4,
    ease: 'power2.inOut',
  },
};
```

Usage:
```typescript
import { animationPresets } from '@/lib/gsap/animations';

gsap.from('.element', animationPresets.fadeInUp);
```

---

## 8. Common Patterns

### Staggered List Items
```typescript
gsap.from('.list-item', {
  ...animationPresets.fadeInUp,
  stagger: 0.05,  // 50ms between items
});
```

### Button Click Feedback
```typescript
const onClick = contextSafe(() => {
  gsap.to(buttonRef.current, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
  });
});
```

### Error Shake
```typescript
const showError = contextSafe(() => {
  gsap.to(inputRef.current, animationPresets.shake);
});
```

---

## 9. Debugging Tips

### Enable GSAP DevTools
```typescript
// In development only
if (process.env.NODE_ENV === 'development') {
  gsap.config({ nullTargetWarn: true });
}
```

### Log Animation Progress
```typescript
gsap.to('.element', {
  x: 100,
  onUpdate: function() {
    console.log('Progress:', this.progress());
  },
});
```

### Check ScrollTrigger Status
```typescript
ScrollTrigger.getAll().forEach(st => {
  console.log(st.trigger, st.isActive);
});
```

---

## 10. Testing Animations

For testing, you can skip animations:

```typescript
// In test setup
import { gsap } from 'gsap';

beforeAll(() => {
  gsap.globalTimeline.timeScale(100); // Speed up all animations
});
```

---

## File Structure After Setup

```
frontend/
├── lib/
│   └── gsap/
│       ├── index.ts        # GSAP exports & registration
│       ├── animations.ts   # Animation presets
│       └── hooks/
│           └── useScrollAnimation.ts
├── styles/
│   └── design-tokens.css   # CSS custom properties
├── app/
│   ├── layout.tsx          # Poppins font config
│   └── globals.css         # Import design tokens
└── Components/
    └── [Enhanced components]
```

---

## Need Help?

- [GSAP Docs](https://gsap.com/docs/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [useGSAP React Hook](https://gsap.com/resources/react-basics/)
