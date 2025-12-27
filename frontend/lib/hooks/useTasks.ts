/**
 * Custom React Query hooks for task operations
 *
 * Combines task API functions with UI store filters
 * to provide filtered and sorted task data.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '../stores/uiStore';
import * as taskAPI from '../api/tasks';
import type { Task } from '../types';

/**
 * Computed hook that returns filtered and sorted tasks
 */
export function useTasks() {
  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskAPI.fetchTasks,
  });

  const { filters, sortBy } = useUIStore();

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.status && filters.status !== 'all') {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    if (filters.projectId) {
      result = result.filter((task) => task.projectId === filters.projectId);
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((task) =>
        filters.tags!.some((tagId) => task.tags.some((tag) => tag.id === tagId)),
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)),
      );
    }

    if (filters.deadline) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
      const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      result = result.filter((task) => {
        if (!task.deadline) return filters.deadline === 'later';

        const deadline = new Date(task.deadline);

        if (filters.deadline === 'today') {
          return deadline >= todayStart && deadline <= todayEnd;
        }

        if (filters.deadline === 'thisWeek') {
          return deadline >= todayStart && deadline <= weekEnd;
        }

        if (filters.deadline === 'later') {
          return deadline > weekEnd;
        }

        return true;
      });
    }

    result.sort((a, b) => {
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
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filters, sortBy]);

  const { completedTasks, activeTasks } = useMemo(() => {
    return {
      completedTasks: filteredTasks.filter((task) => task.status === 'completed'),
      activeTasks: filteredTasks.filter((task) => task.status === 'active'),
    };
  }, [filteredTasks]);

  return {
    tasks: filteredTasks,
    activeTasks,
    completedTasks,
    isLoading,
    error,
    refetch,
    createTask: taskAPI.useCreateTask(),
    updateTask: taskAPI.useUpdateTask(),
    deleteTask: taskAPI.useDeleteTask(),
    bulkDeleteTasks: taskAPI.useBulkDeleteTasks(),
    bulkUpdateTaskStatus: taskAPI.useBulkUpdateTaskStatus(),
  };
}
