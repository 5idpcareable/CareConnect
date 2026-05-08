import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("careable_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
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
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { firstName, lastName, phone, dateOfBirth, postcode } = body;

    if (!firstName || !lastName || !phone || !dateOfBirth || !postcode) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        postcode,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const primaryRole = updatedUser.roles[0];

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        roleId: primaryRole ? String(primaryRole.roleId) : "1",
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        postcode: updatedUser.postcode,
        roles: updatedUser.roles.map((userRole) => userRole.role.name),
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { message: "Something went wrong updating your profile." },
      { status: 500 }
    );
  }
}
