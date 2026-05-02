// ============================================================
// PUT /api/lists/[id] — Update a list
// DELETE /api/lists/[id] — Delete a list
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { updateListSchema } from "@/lib/validators";

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

    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    const lists = res.rows[0]?.lists || [];
    const listIndex = lists.findIndex((l: any) => l.id === id);

    if (listIndex === -1) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    if (parsed.data.title !== undefined) lists[listIndex].title = parsed.data.title;
    if (parsed.data.theme !== undefined) lists[listIndex].theme = parsed.data.theme;

    await query("UPDATE todos SET lists = $1 WHERE user_id = $2", [JSON.stringify(lists), auth.userId]);

    return NextResponse.json({ success: true, data: lists[listIndex] });
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

    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    const lists = res.rows[0]?.lists || [];
    const index = lists.findIndex((l: any) => l.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    lists.splice(index, 1);

    await query("UPDATE todos SET lists = $1 WHERE user_id = $2", [JSON.stringify(lists), auth.userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/lists/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
