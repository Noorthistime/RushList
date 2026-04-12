// ============================================================
// POST /api/auth/signup — Register a new user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { readJSON, writeJSON } from "@/lib/db";
import { hashPassword, generateToken, createAuthCookieHeader } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { UsersData, TodosData, User } from "@/types";

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
    const usersData = await readJSON<UsersData>("users.json");
    const existingUser = usersData.users.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    usersData.users.push(newUser);
    await writeJSON("users.json", usersData);

    // Initialize empty todos for user
    const todosData = await readJSON<TodosData>("todos.json");
    todosData.todos.push({ userId: newUser.id, lists: [] });
    await writeJSON("todos.json", todosData);

    // Generate JWT and set cookie
    const token = generateToken(newUser);
    const response = NextResponse.json(
      {
        success: true,
        data: { id: newUser.id, name: newUser.name, email: newUser.email },
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
