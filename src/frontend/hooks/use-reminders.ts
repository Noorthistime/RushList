"use client";

// ============================================================
// useReminders hook — Browser notification reminders for tasks
// ============================================================

import { useEffect, useRef, useCallback } from "react";
import { TodoList } from "@/types";

export function useReminders(lists: TodoList[]) {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const permissionRef = useRef<NotificationPermission>("default");

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      permissionRef.current = permission;
    } else {
      permissionRef.current = Notification.permission;
    }
  }, []);

  // Show a notification
  const showNotification = useCallback((title: string, body: string) => {
    if (permissionRef.current !== "granted") return;

    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `reminder-${Date.now()}`,
      });
    } catch (err) {
      console.error("Failed to show notification:", err);
    }
  }, []);

  // Schedule reminders for all tasks
  const scheduleReminders = useCallback(() => {
    // Clear existing timers
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();

    const now = Date.now();

    lists.forEach((list) => {
      list.tasks.forEach((task) => {
        if (task.completed || !task.reminderTime) return;

        const reminderTime = new Date(task.reminderTime).getTime();
        const delay = reminderTime - now;

        if (delay <= 0) return; // Skip past reminders
        if (delay > 24 * 60 * 60 * 1000) return; // Skip reminders more than 24h away

        const timer = setTimeout(() => {
          showNotification(
            `⏰ Reminder: ${task.title}`,
            `From list "${list.title}" — it's time to work on this task!`
          );
          timersRef.current.delete(task.id);
        }, delay);

        timersRef.current.set(task.id, timer);
      });
    });
  }, [lists, showNotification]);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Schedule reminders when lists change
  useEffect(() => {
    scheduleReminders();

    // Fallback: poll every 60s for any missed reminders
    const pollInterval = setInterval(() => {
      scheduleReminders();
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [scheduleReminders]);

  return { requestPermission };
}
