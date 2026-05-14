import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

async function requireSuperAdmin() {
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

  const isSuperAdmin = session.user.roles.some(
    (userRole) => userRole.role.name === "super_admin"
  );

  if (!isSuperAdmin) {
    return null;
  }

  return session.user;
}

export async function POST(request: Request) {
  try {
    const superAdmin = await requireSuperAdmin();

    if (!superAdmin) {
      return NextResponse.json(
        { message: "Only super admins can review admin access requests." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { requestId, action } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { message: "Request ID and action are required." },
        { status: 400 }
      );
    }

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { message: "Invalid review action." },
        { status: 400 }
      );
    }

    const adminRequest = await prisma.adminAccessRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!adminRequest) {
      return NextResponse.json(
        { message: "Admin access request not found." },
        { status: 404 }
      );
    }

    if (adminRequest.status !== "PENDING") {
      return NextResponse.json(
        { message: "This request has already been reviewed." },
        { status: 409 }
      );
    }

    if (action === "REJECT") {
      await prisma.adminAccessRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "Admin access request rejected.",
      });
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: adminRequest.firstName,
          lastName: adminRequest.lastName,
          email: adminRequest.email,
          phone: adminRequest.phone,
          dateOfBirth: adminRequest.dateOfBirth,
          postcode: adminRequest.postcode,
          passwordHash: adminRequest.passwordHash,
          roles: {
            create: {
              roleId: 2,
            },
          },
        },
      });

      await tx.adminAccessRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      });

      return user;
    });

    return NextResponse.json({
      message: "Admin access request approved. Admin account created.",
    });
  } catch (error) {
    console.error("Admin access review error:", error);

    return NextResponse.json(
      { message: "Something went wrong reviewing admin access request." },
      { status: 500 }
    );
  }
}
