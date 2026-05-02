import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { updateTaskSchema } from "@/lib/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    const lists = res.rows[0]?.lists || [];
    
    let updatedTask = null;
    for (const list of lists) {
      const task = list.tasks.find((t: any) => t.id === id);
      if (task) {
        if (parsed.data.title !== undefined) task.title = parsed.data.title;
        if (parsed.data.completed !== undefined) task.completed = parsed.data.completed;
        if (parsed.data.reminderTime !== undefined) task.reminderTime = parsed.data.reminderTime;
        if (parsed.data.order !== undefined) task.order = parsed.data.order;
        updatedTask = task;
        break;
      }
    }

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    await query("UPDATE todos SET lists = $1 WHERE user_id = $2", [JSON.stringify(lists), auth.userId]);

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    const lists = res.rows[0]?.lists || [];
    let found = false;

    for (const list of lists) {
      const index = list.tasks.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        list.tasks.splice(index, 1);
        list.tasks.forEach((t: any, i: number) => (t.order = i));
        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    await query("UPDATE todos SET lists = $1 WHERE user_id = $2", [JSON.stringify(lists), auth.userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
