// ============================================================
// POST /api/tasks — Create a new task in a list
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAuthFromRequest } from "@/lib/auth";
import { updateJSON } from "@/lib/db";
import { createTaskSchema } from "@/lib/validators";
import { TodosData, Task } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { listId, title, reminderTime } = parsed.data;
    let newTask: Task | null = null;

    await updateJSON<TodosData>("todos.json", (data) => {
      const userTodos = data.todos.find((t) => t.userId === auth.userId);
      if (!userTodos) return data;

      const list = userTodos.lists.find((l) => l.id === listId);
      if (!list) return data;

      newTask = {
        id: uuidv4(),
        title,
        completed: false,
        reminderTime: reminderTime || null,
        createdAt: new Date().toISOString(),
        order: list.tasks.length,
      };

      list.tasks.push(newTask);
      return data;
    });

    if (!newTask) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
