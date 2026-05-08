import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const publicSignupRoles: Record<string, "carer"> = {
  "1": "carer",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      roleId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      postcode,
      password,
      repeatPassword,
      workStatus,
      lookingForWork,
      appliedRecently,
      interestedIndustry,
      speaksOtherLanguage,
      language,
      referralSource,
      reasonForJoining,
      careRecipient,
      careRecipientAge,
      careCondition,
      careDuration,
      termsAccepted,
      researchConsent,
    } = body;

    const selectedRoleId = Number(roleId || 1);
    const selectedRole = publicSignupRoles[String(selectedRoleId)];

    if (!selectedRole) {
      return NextResponse.json(
        { message: "This role cannot be created from public sign up." },
        { status: 403 }
      );
    }

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
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        postcode,
        passwordHash: hashPassword(password),
        roles: {
          create: {
            roleId: selectedRoleId,
          },
        },
        carerProfile: {
          create: {
            workStatus,
            lookingForWork,
            appliedRecently,
            interestedIndustry,
            speaksOtherLanguage,
            language,
            referralSource,
            reasonForJoining,
            careRecipient,
            careRecipientAge,
            careCondition,
            careDuration,
            termsAccepted,
            researchConsent,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const session = await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    const response = NextResponse.json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        roleId: String(selectedRoleId),
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
    console.error("Signup error:", error);

    return NextResponse.json(
      { message: "Something went wrong during sign up." },
      { status: 500 }
    );
  }
}
