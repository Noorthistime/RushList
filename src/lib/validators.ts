// ============================================================
// Input validation schemas using Zod
// ============================================================

import { z } from "zod";

// Sanitize string - trim and remove HTML tags
const sanitizedString = z
  .string()
  .trim()
  .transform((val) => val.replace(/<[^>]*>/g, ""));

// Auth schemas
export const signupSchema = z.object({
  name: sanitizedString
    .pipe(z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long")),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// List schemas
export const createListSchema = z.object({
  title: sanitizedString
    .pipe(z.string().min(1, "Title is required").max(100, "Title too long")),
  theme: z.enum(["blue", "purple", "green", "orange", "red", "pink", "cyan", "amber"]).default("blue"),
});

export const updateListSchema = z.object({
  title: sanitizedString
    .pipe(z.string().min(1, "Title is required").max(100, "Title too long"))
    .optional(),
  theme: z.enum(["blue", "purple", "green", "orange", "red", "pink", "cyan", "amber"]).optional(),
});

// Task schemas
export const createTaskSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
  title: sanitizedString
    .pipe(z.string().min(1, "Title is required").max(500, "Title too long")),
  reminderTime: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: sanitizedString
    .pipe(z.string().min(1, "Title is required").max(500, "Title too long"))
    .optional(),
  completed: z.boolean().optional(),
  reminderTime: z.string().datetime().nullable().optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderTasksSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
  taskIds: z.array(z.string()).min(1, "Task IDs are required"),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
