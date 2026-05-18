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

function calculateProgress(attempt: {
  questionnaire: {
    domains: {
      questions: {
        id: string;
        isRequired: boolean;
      }[];
    }[];
  };
  responses: {
    questionId: string;
    value: string;
  }[];
}) {
  const visibleQuestions = attempt.questionnaire.domains.flatMap(
    (domain) => domain.questions
  );

  const requiredQuestions = visibleQuestions.filter(
    (question) => question.isRequired
  );

  const answeredQuestionIds = new Set(
    attempt.responses
      .filter((response) => String(response.value || "").trim())
      .map((response) => response.questionId)
  );

  const completedRequiredQuestions = requiredQuestions.filter((question) =>
    answeredQuestionIds.has(question.id)
  );

  const progressPercent =
    requiredQuestions.length === 0
      ? 0
      : Math.round(
          (completedRequiredQuestions.length / requiredQuestions.length) * 100
        );

  return {
    completedQuestions: completedRequiredQuestions.length,
    totalQuestions: requiredQuestions.length,
    progressPercent,
  };
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can view assessments." },
        { status: 403 }
      );
    }

    const attempts = await prisma.assessmentAttempt.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: true,
        questionnaire: {
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
        },
        responses: {
          select: {
            questionId: true,
            value: true,
          },
        },
      },
    });

    const assessments = attempts.map((attempt) => {
      const progress = calculateProgress(attempt);

      return {
        id: attempt.id,
        certificateId: attempt.status === "COMPLETED" ? attempt.id : null,
        status: attempt.status,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        updatedAt: attempt.updatedAt,
        carer: {
          id: attempt.user.id,
          name: `${attempt.user.firstName} ${attempt.user.lastName}`,
          email: attempt.user.email,
        },
        questionnaire: {
          id: attempt.questionnaire.id,
          title: attempt.questionnaire.title,
        },
        progress,
      };
    });

    return NextResponse.json({
      assessments,
    });
  } catch (error) {
    console.error("Admin assessments error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading assessments." },
      { status: 500 }
    );
  }
}