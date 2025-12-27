/**
 * TypeScript types matching backend Pydantic models
 *
 * These types ensure full-stack type consistency between frontend and backend.
 */

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'active' | 'completed';

/**
 * User entity - represents a registered user
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tag entity - represents a categorization label for tasks
 */
export interface Tag {
  id: string;
  label: string;
  color?: string;
  userId: string;
  createdAt: string;
}

/**
 * Project entity - represents a collection of related tasks
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task entity - represents a todo item or action item
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  deadline?: string;
  timeEstimate?: number; // in minutes
  projectId?: string;
  tags: Tag[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create task input type
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  deadline?: string;
  timeEstimate?: number;
  projectId?: string;
  tags?: string[]; // tag IDs
}

/**
 * Update task input type
 */
export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  deadline?: string;
  timeEstimate?: number;
  projectId?: string;
  tags?: string[]; // tag IDs
}

/**
 * Create project input type
 */
export interface CreateProjectInput {
  name: string;
  description?: string;
}

/**
 * Update project input type
 */
export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
}

/**
 * Sign up input type
 */
export interface SignUpInput {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Sign in input type
 */
export interface SignInInput {
  email: string;
  password: string;
}

/**
 * Auth session type
 */
export interface AuthSession {
  user: User;
  token: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * API error type
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

/**
 * Backend task response (matches Pydantic schema)
 */
export interface BackendTask {
  id: string;
  title: string;
  description?: string;
  priority: number; // 0=Critical, 1=High, 2=Medium, 3=Low
  is_completed: boolean;
  deadline?: string;
  time_estimate?: number;
  project_id?: string;
  user_id: string;
  tag_ids: string[];
  created_at: string;
  updated_at: string;
  is_overdue: boolean;
  days_until_deadline?: number;
}

/**
 * Map backend priority number to frontend Priority string
 */
export function mapPriority(priority: number): Priority {
  const map: Record<number, Priority> = {
    0: 'Critical',
    1: 'High',
    2: 'Medium',
    3: 'Low',
  };
  return map[priority] ?? 'Medium';
}

/**
 * Map backend task to frontend Task
 */
export function mapBackendTask(backendTask: BackendTask): Task {
  return {
    id: backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    priority: mapPriority(backendTask.priority),
    status: backendTask.is_completed ? 'completed' : 'active',
    deadline: backendTask.deadline,
    timeEstimate: backendTask.time_estimate,
    projectId: backendTask.project_id,
    tags: [], // Tags need to be fetched separately if needed
    userId: backendTask.user_id,
    createdAt: backendTask.created_at,
    updatedAt: backendTask.updated_at,
  };
}
