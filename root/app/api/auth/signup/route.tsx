import { NextResponse } from "next/server";
import { createSession, createUser, findUserByEmail } from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    postcode,
    password,
    repeatPassword,
  } = body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dateOfBirth ||
    !postcode ||
    !password ||
    !repeatPassword
  ) {
    return NextResponse.json(
      { message: "Please complete all required fields." },
      { status: 400 }
    );
  }

  if (password !== repeatPassword) {
    return NextResponse.json(
      { message: "Passwords do not match." },
      { status: 400 }
    );
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      { message: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const user = await createUser({
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    postcode,
    passwordHash: hashPassword(password),
    roles: ["carer"],
    createdAt: new Date().toISOString(),
  });

  const session = await createSession(user.id);

  const response = NextResponse.json({
    message: "Account created successfully.",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    },
  });

  response.cookies.set("careable_session", session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
