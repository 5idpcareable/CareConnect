import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/auth";
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
        { message: "Only super admins can view admin access requests." },
        { status: 403 }
      );
    }

    const requests = await prisma.adminAccessRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      requests: requests.map((request) => ({
        id: request.id,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        dateOfBirth: request.dateOfBirth,
        postcode: request.postcode,
        status: request.status,
        reviewedAt: request.reviewedAt,
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin access request list error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading admin access requests." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
      termsAccepted,
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

    if (!termsAccepted) {
      return NextResponse.json(
        { message: "You must accept the terms of service and privacy policy." },
        { status: 400 }
      );
    }

    if (password !== repeatPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An active account with this email already exists." },
        { status: 409 }
      );
    }

    const existingRequest = await prisma.adminAccessRequest.findUnique({
      where: {
        email,
      },
    });

    if (existingRequest?.status === "PENDING") {
      return NextResponse.json(
        { message: "An admin access request is already pending for this email." },
        { status: 409 }
      );
    }

    if (existingRequest?.status === "APPROVED") {
      return NextResponse.json(
        {
          message:
            "This admin access request has already been approved. Please login.",
        },
        { status: 409 }
      );
    }

    if (existingRequest?.status === "REJECTED") {
      await prisma.adminAccessRequest.update({
        where: {
          email,
        },
        data: {
          firstName,
          lastName,
          phone,
          dateOfBirth,
          postcode,
          passwordHash: hashPassword(password),
          status: "PENDING",
          reviewedAt: null,
        },
      });

      return NextResponse.json({
        message: "Admin access request resubmitted successfully.",
      });
    }

    await prisma.adminAccessRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        postcode,
        passwordHash: hashPassword(password),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      message: "Admin access request submitted successfully.",
    });
  } catch (error) {
    console.error("Admin access request error:", error);

    return NextResponse.json(
      { message: "Something went wrong submitting your admin access request." },
      { status: 500 }
    );
  }
}
