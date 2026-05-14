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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can activate questionnaires." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: {
        id,
      },
      include: {
        domains: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!questionnaire) {
      return NextResponse.json(
        { message: "Questionnaire not found." },
        { status: 404 }
      );
    }

    if (questionnaire.domains.length === 0) {
      return NextResponse.json(
        { message: "Add at least one domain before activating." },
        { status: 400 }
      );
    }

    const hasVisibleQuestion = questionnaire.domains.some((domain) =>
      domain.questions.some(
        (question) => question.isVisible && !question.deletedAt
      )
    );

    if (!hasVisibleQuestion) {
      return NextResponse.json(
        {
          message:
            "Make at least one question visible before activating this questionnaire.",
        },
        { status: 400 }
      );
    }

    const hasDomainWithoutVisibleQuestions = questionnaire.domains.some(
      (domain) =>
        !domain.questions.some(
          (question) => question.isVisible && !question.deletedAt
        )
    );

    if (hasDomainWithoutVisibleQuestions) {
      return NextResponse.json(
        {
          message:
            "Every domain must have at least one visible question before activating.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.questionnaire.updateMany({
        data: {
          isActive: false,
        },
      }),
      prisma.questionnaire.update({
        where: {
          id,
        },
        data: {
          isActive: true,
          updatedById: admin.id,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Questionnaire activated successfully.",
    });
  } catch (error) {
    console.error("Questionnaire activate error:", error);

    return NextResponse.json(
      { message: "Something went wrong activating questionnaire." },
      { status: 500 }
    );
  }
}
