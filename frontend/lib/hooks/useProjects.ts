/**
 * Custom React Query hooks for project operations
 */

import { useProjects as useProjectsQuery, useCreateProject, useUpdateProject, useDeleteProject } from '../api/projects';
import type { Project } from '../types';

/**
 * Hook for fetching projects with mutations
 */
export function useProjects() {
  const { data: projects = [], isLoading, error, refetch } = useProjectsQuery();

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject: useCreateProject(),
    updateProject: useUpdateProject(),
    deleteProject: useDeleteProject(),
  };
}
