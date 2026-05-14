import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

async function requireAdmin() {
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

  const canAccessAdmin = session.user.roles.some((userRole) =>
    ["admin", "super_admin"].includes(userRole.role.name)
  );

  if (!canAccessAdmin) {
    return null;
  }

  return session.user;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ domainId: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can add questions." },
        { status: 403 }
      );
    }

    const { domainId } = await context.params;
    const body = await request.json();

    const { prompt, helpText, type, isRequired } = body;

    if (!prompt) {
      return NextResponse.json(
        { message: "Question prompt is required." },
        { status: 400 }
      );
    }

    const domain = await prisma.assessmentDomain.findUnique({
      where: {
        id: domainId,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { message: "Domain not found." },
        { status: 404 }
      );
    }

    const existingQuestionCount = await prisma.assessmentQuestion.count({
      where: {
        domainId,
      },
    });

    const question = await prisma.assessmentQuestion.create({
      data: {
        domainId,
        prompt,
        helpText,
        type: type || "LIKERT_1_5",
        isRequired: isRequired ?? true,

        // New questions start hidden. The creator or super admin can make them visible later.
        isVisible: false,
        deletedAt: null,

        order: existingQuestionCount + 1,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    await prisma.assessmentDomain.update({
      where: {
        id: domainId,
      },
      data: {
        updatedById: admin.id,
      },
    });

    await prisma.questionnaire.update({
      where: {
        id: domain.questionnaireId,
      },
      data: {
        updatedById: admin.id,
      },
    });

    return NextResponse.json({
      message: "Question added successfully. It is hidden until activated.",
      question,
    });
  } catch (error) {
    console.error("Question create error:", error);

    return NextResponse.json(
      { message: "Something went wrong adding question." },
      { status: 500 }
    );
  }
}
