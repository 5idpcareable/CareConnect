import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findSession, findUserById } from "@/app/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("careable_session")?.value;

  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const session = await findSession(sessionId);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await findUserById(session.userId);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      roleId: user.roleId || "1",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      postcode: user.postcode,
      roles: user.roles,
    },
  });
}
