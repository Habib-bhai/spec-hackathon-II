'use client';

import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import TaskCard from '../TaskCard/TaskCard';
import type { Task } from '../../lib/types';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleStatus?: (taskId: string, status: 'active' | 'completed') => void;
  searchQuery?: string;
  filterStatus?: 'all' | 'active' | 'completed';
  filterPriority?: 'all' | 'Critical' | 'High' | 'Medium' | 'Low';
  sortBy?: 'deadline' | 'priority' | 'createdAt';
}

/**
 * Task List Component
 *
 * Virtually-optimized list rendering for 100+ tasks with:
 * - TanStack Virtual for efficient rendering
 * - Filtering, sorting, and searching
 * - Empty state and loading states
 * - Creative, compelling design
 */
export default function TaskList({
  tasks,
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  searchQuery = '',
  filterStatus = 'all',
  filterPriority = 'all',
  sortBy = 'createdAt',
}: TaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)),
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((task) => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      result = result.filter((task) => task.priority === filterPriority);
    }

    // Sort tasks
    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority':
          const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy]);

  // Set up virtualizer
  const virtualizer = useVirtualizer({
    count: filteredTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Estimated height of TaskCard
    overscan: 5,
  });

  // Empty state
  if (!loading && filteredTasks.length === 0) {
    const hasFiltersActive = searchQuery || filterStatus !== 'all' || filterPriority !== 'all';
    const isNoTasksAtAll = tasks.length === 0;

    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>{isNoTasksAtAll ? '✨' : '🔍'}</div>
          <h3 className={styles.emptyTitle}>
            {isNoTasksAtAll ? 'No tasks yet' : 'No tasks found'}
          </h3>
          <p className={styles.emptyMessage}>
            {searchQuery
              ? `No tasks matching "${searchQuery}"`
              : hasFiltersActive
                ? 'No tasks match your current filters'
                : 'There are no tasks. Add your todos to get started!'}
          </p>
          {isNoTasksAtAll && !hasFiltersActive && (
            <p className={styles.emptyHint}>
              Use the form above to create your first task.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonBody} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div ref={parentRef} className={styles.scrollContainer}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const task = filteredTasks[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
