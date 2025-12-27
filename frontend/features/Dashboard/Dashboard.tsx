'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TaskList from '../../Components/TaskList/TaskList';
import EditTaskModal from '../../Components/EditTaskModal/EditTaskModal';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../lib/api/tasks';
import { createTaskSchema, type CreateTaskSchema } from '../../lib/types/schemas';
import type { Task, Priority, TaskStatus } from '../../lib/types';
import styles from './Dashboard.module.css';

/**
 * Dashboard Component
 *
 * Visually compelling task management dashboard with:
 * - Task creation form with React Hook Form + Zod validation
 * - Filtering, sorting, searching
 * - Responsive layout (sidebar on desktop, collapsible on mobile)
 * - Integration with TaskList for virtualized rendering
 */
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'createdAt'>('createdAt');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      tags: [],
    },
  });

  // Fetch tasks using the API hook
  const { data: tasks = [], isLoading, error } = useTasks();

  // Mutation hooks
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Handle form submission
  const onSubmit = async (data: CreateTaskSchema) => {
    try {
      await createTask.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveEdit = async (taskId: string, data: Partial<Task>) => {
    await updateTask.mutateAsync({ id: taskId, ...data });
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleToggleStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ id: taskId, status });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background effects */}
      <div className={styles.background} />

      <div className={styles.content}>
        {/* Mobile header */}
        <header className={styles.mobileHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>
                {tasks && `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={styles.menuButton}
              aria-label="Toggle filters"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className={styles.mainContent}>
          {/* Task creation form */}
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <h2 className={styles.formTitle}>Create New Task</h2>

              <div className={styles.formField}>
                <label htmlFor="title" className={styles.label}>
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  placeholder="What needs to be done?"
                  className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <span className={styles.errorText}>{errors.title.message}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Add details (optional)"
                  rows={3}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="priority" className={styles.label}>
                    Priority
                  </label>
                  <select
                    id="priority"
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

                <div className={styles.formField}>
                  <label htmlFor="deadline" className={styles.label}>
                    Deadline
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    {...register('deadline')}
                    className={styles.input}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="timeEstimate" className={styles.label}>
                  Time Estimate (minutes)
                </label>
                <input
                  id="timeEstimate"
                  type="number"
                  {...register('timeEstimate', { valueAsNumber: true })}
                  placeholder="e.g., 30"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Creating...' : 'Add Task'}
              </button>
            </form>
          </div>

          {/* Task list */}
          <div className={styles.listSection}>
            {/* Search bar */}
            <div className={styles.searchBar}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className={styles.searchInput}
              />
            </div>

            {/* Mobile filters */}
            <div className={`${styles.filtersMobile} ${isSidebarOpen ? styles.open : ''}`}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Status:</label>
                <div className={styles.filterButtons}>
                  {(['all', 'active', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`${styles.filterButton} ${filterStatus === status ? styles.active : ''}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Priority:</label>
                <div className={styles.filterButtons}>
                  {(['all', 'Critical', 'High', 'Medium', 'Low'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setFilterPriority(priority)}
                      className={`${styles.filterButton} ${filterPriority === priority ? styles.active : ''}`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Sort by:</label>
                <div className={styles.filterButtons}>
                  {(['deadline', 'priority', 'createdAt'] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`${styles.filterButton} ${sortBy === sort ? styles.active : ''}`}
                    >
                      {sort === 'deadline' && 'Deadline'}
                      {sort === 'priority' && 'Priority'}
                      {sort === 'createdAt' && 'Created'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Task list */}
            {error ? (
              <div className={styles.errorMessage}>
                Failed to load tasks. Please refresh page.
              </div>
            ) : (
              <TaskList
                tasks={tasks || []}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                searchQuery={searchQuery}
                filterStatus={filterStatus}
                filterPriority={filterPriority}
                sortBy={sortBy}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
