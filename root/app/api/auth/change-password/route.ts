import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("careable_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { message: "Please login to change your password." },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Your session is invalid. Please login again." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { currentPassword, newPassword, repeatPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
      repeatPassword?: string;
    };

    if (!currentPassword || !newPassword || !repeatPassword) {
      return NextResponse.json(
        { message: "All password fields are required." },
        { status: 400 }
      );
    }

    if (!verifyPassword(currentPassword, session.user.passwordHash)) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 400 }
      );
    }

    if (newPassword !== repeatPassword) {
      return NextResponse.json(
        { message: "New passwords do not match." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          message: "New password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          passwordHash: hashPassword(newPassword),
        },
      }),

      prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          NOT: {
            id: sessionId,
          },
        },
      }),

      prisma.passwordResetToken.deleteMany({
        where: {
          userId: session.user.id,
          usedAt: null,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { message: "Something went wrong changing your password." },
      { status: 500 }
    );
  }
}