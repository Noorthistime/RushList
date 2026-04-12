// ============================================================
// PUT /api/lists/[id] — Update a list
// DELETE /api/lists/[id] — Delete a list
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { updateJSON } from "@/lib/db";
import { updateListSchema } from "@/lib/validators";
import { TodosData } from "@/types";

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
    const parsed = updateListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    let updatedList = null;

    await updateJSON<TodosData>("todos.json", (data) => {
      const userTodos = data.todos.find((t) => t.userId === auth.userId);
      if (!userTodos) return data;

      const list = userTodos.lists.find((l) => l.id === id);
      if (!list) return data;

      if (parsed.data.title !== undefined) list.title = parsed.data.title;
      if (parsed.data.theme !== undefined) list.theme = parsed.data.theme;

      updatedList = list;
      return data;
    });

    if (!updatedList) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedList });
  } catch (error) {
    console.error("PUT /api/lists/[id] error:", error);
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
    let found = false;

    await updateJSON<TodosData>("todos.json", (data) => {
      const userTodos = data.todos.find((t) => t.userId === auth.userId);
      if (!userTodos) return data;

      const index = userTodos.lists.findIndex((l) => l.id === id);
      if (index === -1) return data;

      userTodos.lists.splice(index, 1);
      found = true;
      return data;
    });

    if (!found) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/lists/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
