'use client';

import { useState, useRef } from 'react';
import type { Task, Tag } from '../../lib/types';
import styles from './TaskCard.module.css';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/gsap/hooks/useReducedMotion';
import { shadowPresets, durations, animationPresets } from '@/lib/gsap/animations';

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
 * - T028-T032: Entrance animation (staggered in virtualized list via mount timing)
 */
export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // GSAP refs for hover animation (T016-T018) and entrance animation (T028-T032)
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: cardRef });

  // T028-T032: Entrance animation when card mounts (works with virtualized lists)
  useGSAP(() => {
    if (!cardRef.current) return;

    // T032: Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
      gsap.set(cardRef.current, { opacity: 1, y: 0 });
      return;
    }

    // T029-T031: Fade-in and slide-up entrance animation
    // 50ms stagger effect achieved naturally through virtualization mount timing
    gsap.from(cardRef.current, {
      ...animationPresets.fadeInUp,
      duration: 0.4, // Slightly faster for snappy feel
      ease: 'power2.out',
    });
  }, { scope: cardRef, dependencies: [prefersReducedMotion] });

  // GSAP hover animation handlers
  const onMouseEnterGSAP = contextSafe(() => {
    if (prefersReducedMotion) return;
    gsap.to(cardRef.current, {
      y: -4,
      boxShadow: shadowPresets.cardHoverGlow,
      duration: durations.fast,
      ease: 'power2.out',
    });
  });

  const onMouseLeaveGSAP = contextSafe(() => {
    if (prefersReducedMotion) return;
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: shadowPresets.cardRest,
      duration: durations.instant,
      ease: 'power2.in',
    });
  });

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
      ref={cardRef} onMouseEnter={() => { setIsHovered(true); onMouseEnterGSAP(); }}
      onMouseLeave={() => { setIsHovered(false); onMouseLeaveGSAP(); }}
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
