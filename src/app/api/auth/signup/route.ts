// ============================================================
// POST /api/auth/signup — Register a new user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { query } from "@/lib/db";
import { hashPassword, generateToken, createAuthCookieHeader } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { User } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUserRes = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUserRes.rowCount && existingUserRes.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const userId = uuidv4();
    
    await query(
      "INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)",
      [userId, name, email, passwordHash]
    );

    // Initialize empty todos for user
    await query("INSERT INTO todos (user_id, lists) VALUES ($1, $2)", [userId, JSON.stringify([])]);

    // Generate JWT and set cookie
    const newUser: User = { id: userId, name, email, passwordHash, createdAt: new Date().toISOString() };
    const token = generateToken(newUser);
    const response = NextResponse.json(
      {
        success: true,
        data: { id: userId, name, email },
      },
      { status: 201 }
    );

    response.headers.set("Set-Cookie", createAuthCookieHeader(token));
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
