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

function calculateProgress(args: {
  domains: {
    id: string;
    questions: {
      id: string;
      isRequired: boolean;
    }[];
  }[];
  responses: {
    questionId: string;
    value: string;
  }[];
}) {
  const requiredQuestions = args.domains
    .flatMap((domain) => domain.questions)
    .filter((question) => question.isRequired);

  const answeredQuestionIds = new Set(
    args.responses
      .filter((response) => String(response.value || "").trim())
      .map((response) => response.questionId)
  );

  const completedRequiredQuestions = requiredQuestions.filter((question) =>
    answeredQuestionIds.has(question.id)
  );

  const completedSections = args.domains.filter((domain) => {
    const domainRequiredQuestions = domain.questions.filter(
      (question) => question.isRequired
    );

    return (
      domainRequiredQuestions.length > 0 &&
      domainRequiredQuestions.every((question) =>
        answeredQuestionIds.has(question.id)
      )
    );
  }).length;

  const progressPercent =
    requiredQuestions.length === 0
      ? 0
      : Math.round(
          (completedRequiredQuestions.length / requiredQuestions.length) * 100
        );

  return {
    completedSections,
    totalSections: args.domains.length,
    completedQuestions: completedRequiredQuestions.length,
    totalQuestions: requiredQuestions.length,
    progressPercent,
  };
}

export async function GET() {
  try {
    const carer = await requireCarer();

    if (!carer) {
      return NextResponse.json(
        { message: "Only carers can view assessment status." },
        { status: 403 }
      );
    }

    const activeQuestionnaire = await prisma.questionnaire.findFirst({
      where: {
        isActive: true,
      },
      include: {
        domains: {
          where: {
            isVisible: true,
            deletedAt: null,
          },
          include: {
            questions: {
              where: {
                isVisible: true,
                deletedAt: null,
              },
              select: {
                id: true,
                isRequired: true,
              },
            },
          },
        },
      },
    });

    const latestCompletedAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: carer.id,
        status: "COMPLETED",
      },
      orderBy: {
        completedAt: "desc",
      },
      include: {
        questionnaire: true,
      },
    });

    const certificate = latestCompletedAttempt
      ? {
          available: true,
          certificateId: latestCompletedAttempt.id,
          assessmentTitle: latestCompletedAttempt.questionnaire.title,
          completedAt: latestCompletedAttempt.completedAt,
        }
      : {
          available: false,
          certificateId: null,
          assessmentTitle: null,
          completedAt: null,
        };

    if (!activeQuestionnaire) {
      return NextResponse.json({
        status: "NOT_AVAILABLE",
        label: "Not Available",
        completedSections: 0,
        totalSections: 0,
        completedQuestions: 0,
        totalQuestions: 0,
        progressPercent: 0,
        certificate,
      });
    }

    const inProgressAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: carer.id,
        questionnaireId: activeQuestionnaire.id,
        status: "IN_PROGRESS",
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        responses: true,
      },
    });

    if (inProgressAttempt) {
      const progress = calculateProgress({
        domains: activeQuestionnaire.domains,
        responses: inProgressAttempt.responses,
      });

      return NextResponse.json({
        status: "IN_PROGRESS",
        label: "In Progress",
        ...progress,
        certificate,
      });
    }

    const completedAttemptForActiveQuestionnaire =
      await prisma.assessmentAttempt.findFirst({
        where: {
          userId: carer.id,
          questionnaireId: activeQuestionnaire.id,
          status: "COMPLETED",
        },
        orderBy: {
          completedAt: "desc",
        },
        include: {
          responses: true,
        },
      });

    if (completedAttemptForActiveQuestionnaire) {
      const progress = calculateProgress({
        domains: activeQuestionnaire.domains,
        responses: completedAttemptForActiveQuestionnaire.responses,
      });

      return NextResponse.json({
        status: "COMPLETED",
        label: "Completed",
        ...progress,
        certificate,
      });
    }

    return NextResponse.json({
      status: "NOT_STARTED",
      label: "Not Started",
      completedSections: 0,
      totalSections: activeQuestionnaire.domains.length,
      completedQuestions: 0,
      totalQuestions: activeQuestionnaire.domains.flatMap(
        (domain) => domain.questions
      ).length,
      progressPercent: 0,
      certificate,
    });
  } catch (error) {
    console.error("Assessment status error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading assessment status." },
      { status: 500 }
    );
  }
}