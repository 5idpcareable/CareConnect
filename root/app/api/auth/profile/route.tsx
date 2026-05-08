import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findSession, findUserById, updateUserProfile } from "@/app/lib/db";

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

    const session = await findSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const user = await findUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
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

    const updatedUser = await updateUserProfile(user.id, {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      postcode,
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        roleId: updatedUser.roleId,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        postcode: updatedUser.postcode,
        roles: updatedUser.roles,
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
