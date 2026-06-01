import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const SESSION_IDLE_MINUTES = 20;

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("careable_session")?.value;

  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!session || !session.user) {
    const response = NextResponse.json({ user: null }, { status: 401 });

    response.cookies.delete("careable_session");

    return response;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });

    const response = NextResponse.json(
      { user: null, message: "Session expired." },
      { status: 401 }
    );

    response.cookies.delete("careable_session");

    return response;
  }

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * SESSION_IDLE_MINUTES),
    },
  });

  const primaryRole = session.user.roles[0];

  return NextResponse.json({
    user: {
      id: session.user.id,
      roleId: primaryRole ? String(primaryRole.roleId) : "1",
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      phone: session.user.phone,
      dateOfBirth: session.user.dateOfBirth,
      postcode: session.user.postcode,
      roles: session.user.roles.map((userRole) => userRole.role.name),
    },
  });
}