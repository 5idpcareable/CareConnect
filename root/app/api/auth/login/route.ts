import { NextResponse } from "next/server";
import { createSession, findUserByEmail } from "@/app/lib/db";
import { verifyPassword } from "@/app/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 }
    );
  }

  const session = await createSession(user.id);

  const response = NextResponse.json({
    message: "Login successful.",
    user: {
      id: user.id,
      roleId: user.roleId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    },
  });

  response.cookies.set("careable_session", session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
