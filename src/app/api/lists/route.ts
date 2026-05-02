// ============================================================
// GET /api/lists — Get all lists for the authenticated user
// POST /api/lists — Create a new list
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAuthFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { createListSchema } from "@/lib/validators";
import { TodoList } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    
    return NextResponse.json({
      success: true,
      data: res.rows[0]?.lists || [],
    });
  } catch (error) {
    console.error("GET /api/lists error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const parsed = createListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const newList: TodoList = {
      id: uuidv4(),
      title: parsed.data.title,
      theme: parsed.data.theme,
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    const res = await query("SELECT lists FROM todos WHERE user_id = $1", [auth.userId]);
    const lists = res.rows[0]?.lists || [];
    lists.push(newList);

    await query("UPDATE todos SET lists = $1 WHERE user_id = $2", [JSON.stringify(lists), auth.userId]);

    return NextResponse.json(
      { success: true, data: newList },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/lists error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
