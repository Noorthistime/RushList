// ============================================================
// Theme colors and app constants
// ============================================================

import { ThemeColor } from "@/types";

export const THEME_COLORS: Record<
  ThemeColor,
  { name: string; bg: string; accent: string; glow: string; text: string; border: string }
> = {
  blue: {
    name: "Ocean Blue",
    bg: "rgba(59, 130, 246, 0.1)",
    accent: "#3b82f6",
    glow: "0 0 20px rgba(59, 130, 246, 0.3)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.3)",
  },
  purple: {
    name: "Royal Purple",
    bg: "rgba(139, 92, 246, 0.1)",
    accent: "#8b5cf6",
    glow: "0 0 20px rgba(139, 92, 246, 0.3)",
    text: "#a78bfa",
    border: "rgba(139, 92, 246, 0.3)",
  },
  green: {
    name: "Emerald",
    bg: "rgba(16, 185, 129, 0.1)",
    accent: "#10b981",
    glow: "0 0 20px rgba(16, 185, 129, 0.3)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.3)",
  },
  orange: {
    name: "Sunset",
    bg: "rgba(249, 115, 22, 0.1)",
    accent: "#f97316",
    glow: "0 0 20px rgba(249, 115, 22, 0.3)",
    text: "#fb923c",
    border: "rgba(249, 115, 22, 0.3)",
  },
  red: {
    name: "Ruby",
    bg: "rgba(239, 68, 68, 0.1)",
    accent: "#ef4444",
    glow: "0 0 20px rgba(239, 68, 68, 0.3)",
    text: "#f87171",
    border: "rgba(239, 68, 68, 0.3)",
  },
  pink: {
    name: "Rose",
    bg: "rgba(236, 72, 153, 0.1)",
    accent: "#ec4899",
    glow: "0 0 20px rgba(236, 72, 153, 0.3)",
    text: "#f472b6",
    border: "rgba(236, 72, 153, 0.3)",
  },
  cyan: {
    name: "Electric",
    bg: "rgba(6, 182, 212, 0.1)",
    accent: "#06b6d4",
    glow: "0 0 20px rgba(6, 182, 212, 0.3)",
    text: "#22d3ee",
    border: "rgba(6, 182, 212, 0.3)",
  },
  amber: {
    name: "Golden",
    bg: "rgba(245, 158, 11, 0.1)",
    accent: "#f59e0b",
    glow: "0 0 20px rgba(245, 158, 11, 0.3)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.3)",
  },
};

export const DEFAULT_THEME: ThemeColor = "blue";

export const JWT_SECRET = process.env.JWT_SECRET || "todo-app-super-secret-key-change-in-production";
export const JWT_EXPIRY = "7d";
export const COOKIE_NAME = "todo_auth_token";
export const BCRYPT_ROUNDS = 10;
