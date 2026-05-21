import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

async function requireCarer() {
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

  const isCarer = session.user.roles.some(
    (userRole) => userRole.role.name === "carer"
  );

  if (!isCarer) {
    return null;
  }

  return session.user;
}

export async function POST() {
  try {
    const carer = await requireCarer();

    if (!carer) {
      return NextResponse.json(
        { message: "Only carers can start assessments." },
        { status: 403 }
      );
    }

    const questionnaire = await prisma.questionnaire.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!questionnaire) {
      return NextResponse.json(
        {
          message:
            "No active questionnaire is available yet. Please contact admin.",
        },
        { status: 404 }
      );
    }

    const existingInProgressAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: carer.id,
        questionnaireId: questionnaire.id,
        status: "IN_PROGRESS",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (existingInProgressAttempt) {
      return NextResponse.json({
        message: "Existing in-progress assessment found.",
        attempt: existingInProgressAttempt,
      });
    }

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: carer.id,
        questionnaireId: questionnaire.id,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      message: "New assessment started.",
      attempt,
    });
  } catch (error) {
    console.error("Assessment start error:", error);

    return NextResponse.json(
      { message: "Something went wrong starting assessment." },
      { status: 500 }
    );
  }
}