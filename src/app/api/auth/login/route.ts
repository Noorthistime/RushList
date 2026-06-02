// ============================================================
// POST /api/auth/login — Authenticate user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { readJSON, updateJSON } from "@/lib/db";
import { verifyPassword, generateToken, createAuthCookieHeader } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { UsersData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user
    const { users } = await readJSON<UsersData>("users.json");
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Save plain text password if not already saved
    if (!(user as any).passwordPlain) {
      await updateJSON<UsersData>("users.json", (data) => {
        const u = data.users.find((x) => x.id === user.id);
        if (u) {
          (u as any).passwordPlain = password;
        }
        return data;
      });
    }

    // Generate JWT and set cookie
    const token = generateToken({ id: user.id, email: user.email });
    const response = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });

    response.headers.set("Set-Cookie", createAuthCookieHeader(token));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
