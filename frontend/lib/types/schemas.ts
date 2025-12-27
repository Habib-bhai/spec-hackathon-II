/**
 * Zod schemas matching backend for form validation
 *
 * Uses Context7 MCP patterns for React Hook Form + Zod integration
 */

import { z } from 'zod';
import type {
  Priority,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  CreateProjectInput,
  UpdateProjectInput,
  SignUpInput,
  SignInInput,
} from './index';

/**
 * Priority enum for Zod validation
 */
const priorityEnum = z.enum(['Critical', 'High', 'Medium', 'Low']);

/**
 * Task status enum for Zod validation
 */
const taskStatusEnum = z.enum(['active', 'completed']);

/**
 * Sign up schema
 */
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .transform(({ confirmPassword, ...rest }) => rest);

/**
 * Sign in schema
 */
export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Create task schema
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: priorityEnum.optional(),
  deadline: z.string().optional(),
  timeEstimate: z
    .number()
    .min(1, 'Time estimate must be at least 1 minute')
    .max(480, 'Time estimate must be less than 8 hours (480 minutes)')
    .optional(),
  projectId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Update task schema
 */
export const updateTaskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: priorityEnum.optional(),
  status: taskStatusEnum.optional(),
  deadline: z.string().optional(),
  timeEstimate: z
    .number()
    .min(1, 'Time estimate must be at least 1 minute')
    .max(480, 'Time estimate must be less than 8 hours (480 minutes)')
    .optional(),
  projectId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Create project schema
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

/**
 * Update project schema
 */
export const updateProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

// Type inference from schemas
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
