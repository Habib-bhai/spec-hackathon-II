'use client';

import { useState } from 'react';
import type { Task, Tag } from '../../lib/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleStatus?: (taskId: string, status: 'active' | 'completed') => void;
}

/**
 * Task Card Component
 *
 * Visually compelling task display with:
 * - Title, description, priority, status, deadline, tags
 * - Visual priority indicators
 * - Edit and delete actions
 * - Hover states and animations
 * - Responsive design
 */
export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'Critical':
        return styles.priorityCritical;
      case 'High':
        return styles.priorityHigh;
      case 'Medium':
        return styles.priorityMedium;
      case 'Low':
        return styles.priorityLow;
      default:
        return styles.priorityLow;
    }
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'Critical':
        return '⚠️';
      case 'High':
        return '🔴';
      case 'Medium':
        return '🟡';
      case 'Low':
        return '🟢';
      default:
        return '🟢';
    }
  };

  const formatDeadline = () => {
    if (!task.deadline) return null;
    const date = new Date(task.deadline);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isCompleted = task.status === 'completed';
  const deadline = formatDeadline();

  return (
    <div
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
    >
      {/* Priority indicator bar */}
      <div className={`${styles.priorityBar} ${getPriorityColor()}`} />

      {/* Content */}
      <div className={styles.content}>
        {/* Header: title and actions */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>{task.title}</h3>
            <div className={styles.priorityBadge}>
              <span className={styles.priorityIcon}>{getPriorityIcon()}</span>
              <span className={styles.priorityLabel}>{task.priority}</span>
            </div>
          </div>

          {/* Actions */}
          {(isHovered || !isCompleted) && (
            <div className={styles.actions}>
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(task.id, isCompleted ? 'active' : 'completed')}
                  className={styles.actionButton}
                  title={isCompleted ? 'Mark as active' : 'Mark as complete'}
                  aria-label={isCompleted ? 'Mark as active' : 'Mark as complete'}
                >
                  {isCompleted ? '↩️' : '✓'}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className={styles.actionButton}
                  title="Edit task"
                  aria-label="Edit task"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className={styles.deleteButton}
                  title="Delete task"
                  aria-label="Delete task"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        {/* Footer: tags and deadline */}
        <div className={styles.footer}>
          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className={styles.tags}>
              {task.tags.map((tag: Tag) => (
                <span
                  key={tag.id}
                  className={styles.tag}
                  style={
                    tag.color
                      ? { backgroundColor: `${tag.color}20`, borderColor: tag.color }
                      : {}
                  }
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {/* Deadline */}
          {deadline && (
            <div className={`${styles.deadline} ${deadline === 'Overdue' ? styles.overdue : ''}`}>
              <span className={styles.deadlineIcon}>📅</span>
              <span>{deadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Spotlight effect on hover */}
      <div className={styles.spotlight} />
    </div>
  );
}
