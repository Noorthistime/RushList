// ============================================================
// POST /api/tasks — Create a new task in a list
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAuthFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { createTaskSchema } from "@/lib/validators";
import { Task } from "@/types";

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

    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    const todos = res.rows[0]?.lists || [];
    const list = todos.find((l: any) => l.id === listId);

    if (!list) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      reminderTime: reminderTime || null,
      createdAt: new Date().toISOString(),
      order: list.tasks.length,
    };

    list.tasks.push(newTask);

    await query("UPDATE todos SET lists = $1 WHERE user_id = $2", [JSON.stringify(todos), auth.userId]);

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
