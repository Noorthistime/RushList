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
  rose_pink: {
    name: "Rose Pink",
    bg: "rgba(244, 63, 94, 0.1)",
    accent: "#f43f5e",
    glow: "0 0 20px rgba(244, 63, 94, 0.3)",
    text: "#fb7185",
    border: "rgba(244, 63, 94, 0.3)",
  },
  warmer_orange: {
    name: "Warmer Orange",
    bg: "rgba(255, 87, 34, 0.1)",
    accent: "#FF5722",
    glow: "0 0 20px rgba(255, 87, 34, 0.3)",
    text: "#ff8a65",
    border: "rgba(255, 87, 34, 0.3)",
  },
  nothing_red: {
    name: "Nothing Red",
    bg: "rgba(255, 0, 49, 0.1)",
    accent: "#FF0031",
    glow: "0 0 20px rgba(255, 0, 49, 0.3)",
    text: "#ff4d6a",
    border: "rgba(255, 0, 49, 0.3)",
  },
  ethereal_blue: {
    name: "Ethereal Blue",
    bg: "rgba(66, 165, 245, 0.1)",
    accent: "#42A5F5",
    glow: "0 0 20px rgba(66, 165, 245, 0.3)",
    text: "#90caf9",
    border: "rgba(66, 165, 245, 0.3)",
  },
  emerald_green: {
    name: "Emerald Green",
    bg: "rgba(46, 125, 50, 0.1)",
    accent: "#2E7D32",
    glow: "0 0 20px rgba(46, 125, 50, 0.3)",
    text: "#81c784",
    border: "rgba(46, 125, 50, 0.3)",
  },
  contrast_grey: {
    name: "Contrast Grey",
    bg: "rgba(117, 117, 117, 0.1)",
    accent: "#757575",
    glow: "0 0 20px rgba(117, 117, 117, 0.3)",
    text: "#b0bec5",
    border: "rgba(117, 117, 117, 0.3)",
  },
  match_accent: {
    name: "Match Accent Theme",
    bg: "color-mix(in srgb, var(--accent-rose-500) 10%, transparent)",
    accent: "var(--accent-rose-500)",
    glow: "0 0 20px color-mix(in srgb, var(--accent-rose-500) 30%, transparent)",
    text: "var(--accent-pink-500)",
    border: "color-mix(in srgb, var(--accent-rose-500) 30%, transparent)",
  },
};

export const DEFAULT_THEME: ThemeColor = "blue";

export const JWT_SECRET = process.env.JWT_SECRET || "todo-app-super-secret-key-change-in-production";
export const JWT_EXPIRY = "7d";
export const COOKIE_NAME = "todo_auth_token";
export const BCRYPT_ROUNDS = 10;
