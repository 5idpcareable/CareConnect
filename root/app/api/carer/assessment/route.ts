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

export async function GET() {
  try {
    const carer = await requireCarer();

    if (!carer) {
      return NextResponse.json(
        { message: "Only carers can access this assessment." },
        { status: 403 }
      );
    }

    const questionnaire = await prisma.questionnaire.findFirst({
      where: {
        isActive: true,
      },
      include: {
        domains: {
          where: {
            isVisible: true,
            deletedAt: null,
          },
          orderBy: {
            order: "asc",
          },
          include: {
            questions: {
              where: {
                isVisible: true,
                deletedAt: null,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
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

    const visibleDomains = questionnaire.domains.filter(
      (domain) => domain.questions.length > 0
    );

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: {
        userId_questionnaireId: {
          userId: carer.id,
          questionnaireId: questionnaire.id,
        },
      },
      include: {
        responses: true,
      },
    });

    const answers: Record<string, string> = {};
    const savedDomains: Record<string, boolean> = {};

    if (attempt) {
      for (const response of attempt.responses) {
        answers[response.questionId] = response.value;
      }

      for (const domain of visibleDomains) {
        const requiredQuestionIds = domain.questions
          .filter((question) => question.isRequired)
          .map((question) => question.id);

        const allRequiredAnswered =
          requiredQuestionIds.length > 0 &&
          requiredQuestionIds.every((questionId) => Boolean(answers[questionId]));

        savedDomains[domain.id] = allRequiredAnswered;
      }
    }

    return NextResponse.json({
      questionnaire: {
        ...questionnaire,
        domains: visibleDomains,
      },
      attempt: attempt
        ? {
            id: attempt.id,
            status: attempt.status,
            startedAt: attempt.startedAt,
            completedAt: attempt.completedAt,
          }
        : null,
      answers,
      savedDomains,
    });
  } catch (error) {
    console.error("Carer assessment load error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading the assessment." },
      { status: 500 }
    );
  }
}