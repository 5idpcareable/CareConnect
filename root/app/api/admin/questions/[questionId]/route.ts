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

async function syncQuestionnaireActiveStatus(
  questionnaireId: string,
  adminId: string
) {
  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: questionnaireId,
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
    return {
      isActive: false,
      changed: false,
      reason: "Questionnaire not found.",
    };
  }

  const canBeActive =
    questionnaire.domains.length > 0 &&
    questionnaire.domains.every((domain) =>
      domain.questions.some(
        (question) => question.isVisible && !question.deletedAt
      )
    );

  if (canBeActive) {
    await prisma.$transaction([
      prisma.questionnaire.updateMany({
        where: {
          id: {
            not: questionnaireId,
          },
        },
        data: {
          isActive: false,
        },
      }),
      prisma.questionnaire.update({
        where: {
          id: questionnaireId,
        },
        data: {
          isActive: true,
          updatedById: adminId,
        },
      }),
    ]);

    return {
      isActive: true,
      changed: !questionnaire.isActive,
      reason: "Questionnaire is active.",
    };
  }

  if (questionnaire.isActive) {
    await prisma.questionnaire.update({
      where: {
        id: questionnaireId,
      },
      data: {
        isActive: false,
        updatedById: adminId,
      },
    });

    return {
      isActive: false,
      changed: true,
      reason:
        "Questionnaire was deactivated because every domain needs at least one visible question.",
    };
  }

  return {
    isActive: false,
    changed: false,
    reason:
      "Questionnaire is not active yet. Every domain needs at least one visible question.",
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ questionId: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can update questions." },
        { status: 403 }
      );
    }

    const { questionId } = await context.params;
    const body = await request.json();

    const { action } = body;

    const question = await prisma.assessmentQuestion.findUnique({
      where: {
        id: questionId,
      },
      include: {
        domain: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found." },
        { status: 404 }
      );
    }

    const isSuperAdmin = admin.roles.some(
      (userRole) => userRole.role.name === "super_admin"
    );

    const isCreator = question.createdById === admin.id;

    if (!isSuperAdmin && !isCreator) {
      return NextResponse.json(
        {
          message:
            "Only the question creator or super admin can update this question.",
        },
        { status: 403 }
      );
    }

    if (action === "toggle-visibility") {
      if (question.deletedAt) {
        return NextResponse.json(
          { message: "Deleted questions cannot be made visible." },
          { status: 400 }
        );
      }

      const updatedQuestion = await prisma.assessmentQuestion.update({
        where: {
          id: questionId,
        },
        data: {
          isVisible: !question.isVisible,
          updatedById: admin.id,
        },
      });

      const status = await syncQuestionnaireActiveStatus(
        question.domain.questionnaireId,
        admin.id
      );

      return NextResponse.json({
        message: updatedQuestion.isVisible
          ? `Question is now visible to carers. ${status.reason}`
          : `Question is now hidden from carers. ${status.reason}`,
        question: updatedQuestion,
        questionnaireStatus: status,
      });
    }

    if (action === "soft-delete") {
      const updatedQuestion = await prisma.assessmentQuestion.update({
        where: {
          id: questionId,
        },
        data: {
          isVisible: false,
          deletedAt: new Date(),
          updatedById: admin.id,
        },
      });

      const status = await syncQuestionnaireActiveStatus(
        question.domain.questionnaireId,
        admin.id
      );

      return NextResponse.json({
        message: `Question deleted from active view. ${status.reason}`,
        question: updatedQuestion,
        questionnaireStatus: status,
      });
    }

    return NextResponse.json(
      { message: "Invalid question action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Question action error:", error);

    return NextResponse.json(
      { message: "Something went wrong updating the question." },
      { status: 500 }
    );
  }
}
