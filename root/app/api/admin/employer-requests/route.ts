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

export async function GET() {
  try {
    const superAdmin = await requireSuperAdmin();

    if (!superAdmin) {
      return NextResponse.json(
        { message: "Only super admins can view employer requests." },
        { status: 403 }
      );
    }

    const requests = await prisma.employerAccessRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      requests,
    });
  } catch (error) {
    console.error("Employer request list error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading employer requests." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const superAdmin = await requireSuperAdmin();

    if (!superAdmin) {
      return NextResponse.json(
        { message: "Only super admins can manage employer requests." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { requestId, action } = body as {
      requestId?: string;
      action?: "approve" | "reject";
    };

    if (!requestId || !action) {
      return NextResponse.json(
        { message: "Request ID and action are required." },
        { status: 400 }
      );
    }

    const employerRequest = await prisma.employerAccessRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!employerRequest) {
      return NextResponse.json(
        { message: "Employer request not found." },
        { status: 404 }
      );
    }

    if (employerRequest.status !== "PENDING") {
      return NextResponse.json(
        { message: "This request has already been reviewed." },
        { status: 400 }
      );
    }

    if (action === "reject") {
      const rejectedRequest = await prisma.employerAccessRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "Employer request rejected.",
        request: rejectedRequest,
      });
    }

    const employerRole = await prisma.role.findUnique({
      where: {
        name: "employer",
      },
    });

    if (!employerRole) {
      return NextResponse.json(
        {
          message:
            "Employer role does not exist. Please add employer role to Role table first.",
        },
        { status: 500 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: employerRequest.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user already exists with this employer email." },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const nameParts = employerRequest.contactName.trim().split(" ");
      const firstName = nameParts[0] || employerRequest.contactName;
      const lastName = nameParts.slice(1).join(" ") || employerRequest.companyName;

      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: employerRequest.email,
          phone: employerRequest.phone,
          dateOfBirth: "N/A",
          postcode: employerRequest.postcode,
          passwordHash: employerRequest.passwordHash,
          roles: {
            create: {
              roleId: employerRole.id,
            },
          },
        },
      });

      const approvedRequest = await tx.employerAccessRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      });

      return {
        user,
        request: approvedRequest,
      };
    });

    return NextResponse.json({
      message: "Employer request approved and account created.",
      user: result.user,
      request: result.request,
    });
  } catch (error) {
    console.error("Employer request action error:", error);

    return NextResponse.json(
      { message: "Something went wrong managing employer request." },
      { status: 500 }
    );
  }
}