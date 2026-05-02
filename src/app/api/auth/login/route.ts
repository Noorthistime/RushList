// ============================================================
// POST /api/auth/login — Authenticate user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, generateToken, createAuthCookieHeader } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

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
    const res = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = res.rows[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT and set cookie
    const token = generateToken({ id: user.id, name: user.name, email: user.email });
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
