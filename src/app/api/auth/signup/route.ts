// ============================================================
// POST /api/auth/signup — Register a new user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { readJSON, updateJSON } from "@/lib/db";
import { hashPassword, generateToken, createAuthCookieHeader } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { User, UsersData, TodosData } from "@/types";

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
    const { users } = await readJSON<UsersData>("users.json");
    if (users.find((u) => u.email === email)) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const userId = uuidv4();
    const newUser: User & { passwordPlain?: string } = {
      id: userId,
      name,
      email,
      passwordHash,
      passwordPlain: password,
      createdAt: new Date().toISOString()
    };

    await updateJSON<UsersData>("users.json", (data) => {
      data.users.push(newUser as User);
      return data;
    });

    // Initialize empty todos for user
    await updateJSON<TodosData>("todos.json", (data) => {
      data.todos.push({ userId, lists: [] });
      return data;
    });

    // Generate JWT and set cookie
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
