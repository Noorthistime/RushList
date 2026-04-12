// ============================================================
// GET /api/lists — Get all lists for the authenticated user
// POST /api/lists — Create a new list
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAuthFromRequest } from "@/lib/auth";
import { readJSON, updateJSON } from "@/lib/db";
import { createListSchema } from "@/lib/validators";
import { TodosData, TodoList } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const todosData = await readJSON<TodosData>("todos.json");
    const userTodos = todosData.todos.find((t) => t.userId === auth.userId);

    return NextResponse.json({
      success: true,
      data: userTodos?.lists || [],
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

    await updateJSON<TodosData>("todos.json", (data) => {
      const userTodos = data.todos.find((t) => t.userId === auth.userId);
      if (userTodos) {
        userTodos.lists.push(newList);
      } else {
        data.todos.push({ userId: auth.userId, lists: [newList] });
      }
      return data;
    });

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
