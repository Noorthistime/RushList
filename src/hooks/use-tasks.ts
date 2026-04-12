"use client";

// ============================================================
// useTasks hook — CRUD operations for tasks within lists
// ============================================================

import { useState, useCallback } from "react";
import { Task } from "@/types";

export function useTasks(onUpdate?: () => void) {
  const [loading, setLoading] = useState(false);

  const createTask = useCallback(
    async (listId: string, title: string, reminderTime?: string | null) => {
      setLoading(true);
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listId, title, reminderTime: reminderTime || null }),
        });
        const data = await res.json();
        if (data.success && onUpdate) onUpdate();
        return data;
      } finally {
        setLoading(false);
      }
    },
    [onUpdate]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Pick<Task, "title" | "completed" | "reminderTime" | "order">>) => {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (data.success && onUpdate) onUpdate();
        return data;
      } catch (err) {
        console.error("Failed to update task:", err);
        return { success: false };
      }
    },
    [onUpdate]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success && onUpdate) onUpdate();
        return data;
      } catch (err) {
        console.error("Failed to delete task:", err);
        return { success: false };
      }
    },
    [onUpdate]
  );

  const toggleTask = useCallback(
    async (id: string, currentCompleted: boolean) => {
      return updateTask(id, { completed: !currentCompleted });
    },
    [updateTask]
  );

  return { loading, createTask, updateTask, deleteTask, toggleTask };
}
