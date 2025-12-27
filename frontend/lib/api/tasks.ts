/**
 * Task API client functions
 *
 * Uses Context7 MCP patterns for useQuery and useMutation.
 * Provides React Query-based API operations for task CRUD.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task, CreateTaskInput, UpdateTaskInput, PaginatedResponse, BackendTask } from '../types';
import { mapBackendTask } from '../types';
import { getJwtToken } from '../auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get authorization headers with JWT token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getJwtToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch all tasks for authenticated user
 */
export async function fetchTasks(): Promise<Task[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  const data: PaginatedResponse<BackendTask> = await response.json();
  return data.items.map(mapBackendTask);
}

/**
 * Map frontend priority to backend priority number
 */
function mapPriorityToBackend(priority?: string): number {
  const map: Record<string, number> = {
    'Critical': 0,
    'High': 1,
    'Medium': 2,
    'Low': 3,
  };
  return map[priority || 'Medium'] ?? 2;
}

/**
 * Create a new task
 */
async function createTask(input: CreateTaskInput): Promise<Task> {
  const backendInput = {
    title: input.title,
    description: input.description,
    priority: mapPriorityToBackend(input.priority),
    deadline: input.deadline,
    time_estimate: input.timeEstimate,
    project_id: input.projectId,
  };

  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(backendInput),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  const data: BackendTask = await response.json();
  return mapBackendTask(data);
}

/**
 * Update an existing task
 */
async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const { id, ...updates } = input;

  // Map frontend fields to backend fields
  const backendUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) backendUpdates.title = updates.title;
  if (updates.description !== undefined) backendUpdates.description = updates.description;
  if (updates.priority !== undefined) backendUpdates.priority = mapPriorityToBackend(updates.priority);
  if (updates.deadline !== undefined) backendUpdates.deadline = updates.deadline;
  if (updates.timeEstimate !== undefined) backendUpdates.time_estimate = updates.timeEstimate;
  if (updates.projectId !== undefined) backendUpdates.project_id = updates.projectId;
  if (updates.status !== undefined) backendUpdates.is_completed = updates.status === 'completed';

  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(backendUpdates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  const data: BackendTask = await response.json();
  return mapBackendTask(data);
}

/**
 * Delete a task
 */
async function deleteTask(taskId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
}

/**
 * Hook for fetching tasks
 */
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
}

/**
 * Hook for creating a task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook for updating a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook for deleting a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook for bulk deleting tasks
 */
export function useBulkDeleteTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      await Promise.all(taskIds.map((id) => deleteTask(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook for bulk updating task status
 */
export function useBulkUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskIds, status }: { taskIds: string[]; status: 'active' | 'completed' }) => {
      await Promise.all(taskIds.map((id) => updateTask({ id, status })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
