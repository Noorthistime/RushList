// ============================================================
// POST /api/auth/login — Authenticate user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/lib/db";
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
    const usersData = await readJSON<UsersData>("users.json");
    const user = usersData.users.find((u) => u.email === email);

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

    // Generate JWT and set cookie
    const token = generateToken(user);
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
