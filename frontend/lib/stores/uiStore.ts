/**
 * Zustand store for UI state management
 *
 * Manages client-side UI state like command palette,
 * filter states, and other transient UI state.
 */

import { create } from 'zustand';

/**
 * Task filter options
 */
export interface TaskFilters {
  status?: 'active' | 'completed' | 'all';
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  projectId?: string;
  tags?: string[];
  searchQuery?: string;
  deadline?: 'today' | 'thisWeek' | 'later';
}

/**
 * Sort options for tasks
 */
export type TaskSort = 'deadline' | 'priority' | 'createdAt' | 'updatedAt';

/**
 * UI state interface
 */
interface UIState {
  // Command palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (isOpen: boolean) => void;

  // Task filters
  filters: TaskFilters;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;

  // Sort options
  sortBy: TaskSort;
  setSortBy: (sortBy: TaskSort) => void;

  // Selection
  selectedTaskIds: string[];
  toggleTaskSelection: (taskId: string) => void;
  clearTaskSelection: () => void;
  selectAllTasks: (taskIds: string[]) => void;

  // UI preferences
  areCompletedTasksCollapsed: boolean;
  toggleCompletedTasksCollapsed: () => void;
}

/**
 * UI store using Zustand
 */
export const useUIStore = create<UIState>((set) => ({
  // Command palette
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isOpen: boolean) =>
    set({ isCommandPaletteOpen: isOpen }),

  // Task filters
  filters: {
    status: 'active',
  },
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () =>
    set({
      filters: {
        status: 'active',
      },
    }),

  // Sort options
  sortBy: 'deadline',
  setSortBy: (sortBy) => set({ sortBy }),

  // Selection
  selectedTaskIds: [],
  toggleTaskSelection: (taskId) =>
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds.includes(taskId)
        ? state.selectedTaskIds.filter((id) => id !== taskId)
        : [...state.selectedTaskIds, taskId],
    })),
  clearTaskSelection: () => set({ selectedTaskIds: [] }),
  selectAllTasks: (taskIds) => set({ selectedTaskIds: taskIds }),

  // UI preferences
  areCompletedTasksCollapsed: true,
  toggleCompletedTasksCollapsed: () =>
    set((state) => ({
      areCompletedTasksCollapsed: !state.areCompletedTasksCollapsed,
    })),
}));
