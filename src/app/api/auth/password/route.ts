// ============================================================
// POST /api/auth/password — Change user password
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, verifyPassword, hashPassword } from "@/lib/auth";
import { readJSON, updateJSON } from "@/lib/db";
import { UsersData } from "@/types";

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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { users } = await readJSON<UsersData>("users.json");
    const user = users.find((u) => u.id === auth.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password" },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update in database
    await updateJSON<UsersData>("users.json", (data) => {
      const u = data.users.find((x) => x.id === user.id);
      if (u) {
        u.passwordHash = newPasswordHash;
        (u as any).passwordPlain = newPassword;
      }
      return data;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
