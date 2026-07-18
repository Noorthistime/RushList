"use client";

// ============================================================
// useLists hook — CRUD operations for todo lists
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { TodoList, ThemeColor } from "@/types";

export function useLists() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data = await res.json();
        setLists(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch lists:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createList = async (title: string, theme: ThemeColor = "blue") => {
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, theme }),
    });
    const data = await res.json();
    if (data.success) {
      setLists((prev) => [...prev, data.data]);
    }
    return data;
  };

  const updateList = async (id: string, updates: { title?: string; theme?: ThemeColor }) => {
    const res = await fetch(`/api/lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) {
      setLists((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...data.data } : l))
      );
    }
    return data;
  };

  const deleteList = async (id: string) => {
    const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setLists((prev) => prev.filter((l) => l.id !== id));
    }
    return data;
  };

  return { lists, loading, fetchLists, createList, updateList, deleteList, setLists };
}
