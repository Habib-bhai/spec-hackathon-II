'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task, Priority } from '../../lib/types';
import styles from './EditTaskModal.module.css';

const editTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
  deadline: z.string().optional(),
  timeEstimate: z
    .number()
    .min(1, 'Time estimate must be at least 1 minute')
    .max(480, 'Time estimate must be less than 8 hours')
    .optional()
    .nullable(),
});

type EditTaskFormData = z.infer<typeof editTaskSchema>;

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, data: Partial<Task>) => Promise<void>;
}

export default function EditTaskModal({ task, isOpen, onClose, onSave }: EditTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      timeEstimate: task.timeEstimate || null,
    },
  });

  // Reset form when task changes
  useEffect(() => {
    reset({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      timeEstimate: task.timeEstimate || null,
    });
  }, [task, reset]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const onSubmit = async (data: EditTaskFormData) => {
    try {
      await onSave(task.id, {
        title: data.title,
        description: data.description,
        priority: data.priority as Priority,
        deadline: data.deadline || undefined,
        timeEstimate: data.timeEstimate || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Task</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="edit-title" className={styles.label}>
              Title *
            </label>
            <input
              id="edit-title"
              type="text"
              {...register('title')}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="edit-description" className={styles.label}>
              Description
            </label>
            <textarea
              id="edit-description"
              {...register('description')}
              rows={3}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="edit-priority" className={styles.label}>
                Priority
              </label>
              <select
                id="edit-priority"
                {...register('priority')}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="edit-deadline" className={styles.label}>
                Deadline
              </label>
              <input
                id="edit-deadline"
                type="date"
                {...register('deadline')}
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="edit-timeEstimate" className={styles.label}>
              Time Estimate (minutes)
            </label>
            <input
              id="edit-timeEstimate"
              type="number"
              {...register('timeEstimate', { valueAsNumber: true })}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.saveButton}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
