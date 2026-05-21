import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      companyName,
      contactName,
      email,
      phone,
      postcode,
      password,
      repeatPassword,
    } = body as {
      companyName?: string;
      contactName?: string;
      email?: string;
      phone?: string;
      postcode?: string;
      password?: string;
      repeatPassword?: string;
    };

    if (
      !companyName ||
      !contactName ||
      !email ||
      !phone ||
      !postcode ||
      !password ||
      !repeatPassword
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== repeatPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const normalisedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalisedEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account already exists with this email." },
        { status: 409 }
      );
    }

    const existingRequest = await prisma.employerAccessRequest.findUnique({
      where: {
        email: normalisedEmail,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          message:
            "An employer access request already exists for this email. Please wait for admin approval.",
        },
        { status: 409 }
      );
    }

    const requestRecord = await prisma.employerAccessRequest.create({
      data: {
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: normalisedEmail,
        phone: phone.trim(),
        postcode: postcode.trim(),
        passwordHash: hashPassword(password),
      },
    });

    return NextResponse.json({
      message:
        "Employer access request submitted successfully. Please wait for super admin approval.",
      request: {
        id: requestRecord.id,
        companyName: requestRecord.companyName,
        contactName: requestRecord.contactName,
        email: requestRecord.email,
        status: requestRecord.status,
      },
    });
  } catch (error) {
    console.error("Employer access request error:", error);

    return NextResponse.json(
      { message: "Something went wrong submitting employer request." },
      { status: 500 }
    );
  }
}