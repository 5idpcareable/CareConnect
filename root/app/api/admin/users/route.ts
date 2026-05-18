import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("careable_session")?.value;

  if (!sessionId) {
    return null;
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

  if (!session?.user) {
    return null;
  }

  const canAccessAdmin = session.user.roles.some((userRole) =>
    ["admin", "super_admin"].includes(userRole.role.name)
  );

  if (!canAccessAdmin) {
    return null;
  }

  return session.user;
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can view users." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        postcode: user.postcode,
        createdAt: user.createdAt,
        roles: user.roles.map((userRole) => userRole.role.name),
      })),
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading users." },
      { status: 500 }
    );
  }
}