/**
 * Virtual scrolling list component using @tanstack/react-virtual
 *
 * Uses Context7 MCP patterns for useVirtualizer hook.
 * Efficiently renders large lists by only showing visible items.
 */

'use client';

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: () => number;
  overscan?: number;
  className?: string;
}

/**
 * Virtual list component for efficiently rendering large item lists
 *
 * @param items - Array of items to render
 * @param renderItem - Function to render each item
 * @param estimateSize - Estimated size of each item in pixels (default: 60px)
 * @param overscan - Number of extra items to render outside viewport (default: 5)
 * @param className - Optional CSS class name for container
 */
export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = () => 60,
  overscan = 5,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Configure virtualizer using Context7 MCP patterns
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '400px',
        overflow: 'auto',
        position: 'relative',
      }}
      className={className}
    >
      {/* Large inner container with absolute positioning */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Only render visible items */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
