// ============================================================
// Type definitions for the Todo List application
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  reminderTime: string | null;
  createdAt: string;
  order: number;
}

export interface TodoList {
  id: string;
  title: string;
  theme: ThemeColor;
  tasks: Task[];
  createdAt: string;
}

export interface UserTodos {
  userId: string;
  lists: TodoList[];
}

export interface UsersData {
  users: User[];
}

export interface TodosData {
  todos: UserTodos[];
}

export type ThemeColor =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "pink"
  | "cyan"
  | "amber";

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
