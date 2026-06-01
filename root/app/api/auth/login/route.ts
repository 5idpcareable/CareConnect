import { NextResponse } from "next/server";
import { verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const SESSION_IDLE_MINUTES  = 20;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      const adminRequest = await prisma.adminAccessRequest.findUnique({
        where: {
          email,
        },
      });

      if (adminRequest?.status === "PENDING") {
        return NextResponse.json(
          {
            message:
              "Your admin access request is still pending super admin approval.",
          },
          { status: 403 }
        );
      }

      if (adminRequest?.status === "REJECTED") {
        return NextResponse.json(
          {
            message:
              "Your admin access request was not approved. Please contact the project owner.",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = verifyPassword(password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * SESSION_IDLE_MINUTES
        ),
      },
    });

    const primaryRole = user.roles[0];

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        roleId: primaryRole ? String(primaryRole.roleId) : "1",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles.map((userRole) => userRole.role.name),
      },
    });

    response.cookies.set("careable_session", session.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Something went wrong during login." },
      { status: 500 }
    );
  }
}