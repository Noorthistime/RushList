// ============================================================
// DELETE /api/auth/delete — Delete user account
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, createLogoutCookieHeader } from "@/lib/auth";
import { updateJSON } from "@/lib/db";
import { UsersData, TodosData } from "@/types";

export async function DELETE(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { userId } = auth;

    // Delete user from users.json (which empties/releases the taken username)
    await updateJSON<UsersData>("users.json", (data) => {
      data.users = data.users.filter((u) => u.id !== userId);
      return data;
    });

    // Delete user's lists and tasks from todos.json
    await updateJSON<TodosData>("todos.json", (data) => {
      data.todos = data.todos.filter((t) => t.userId !== userId);
      return data;
    });

    // Clear the auth cookie to log the user out
    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", createLogoutCookieHeader());

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
