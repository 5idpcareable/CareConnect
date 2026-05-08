import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
    return NextResponse.json({ user: null }, { status: 401 });
  }

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
