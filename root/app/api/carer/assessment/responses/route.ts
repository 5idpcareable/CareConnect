import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type ResponseInput = {
  questionId: string;
  domainId: string;
  value: string;
};

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

export async function POST(request: Request) {
  try {
    const carer = await requireCarer();

    if (!carer) {
      return NextResponse.json(
        { message: "Only carers can save assessment responses." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { questionnaireId, domainId, responses } = body as {
      questionnaireId?: string;
      domainId?: string;
      responses?: ResponseInput[];
    };

    if (!questionnaireId || !domainId) {
      return NextResponse.json(
        { message: "Questionnaire and domain are required." },
        { status: 400 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { message: "At least one response is required." },
        { status: 400 }
      );
    }

    const questionnaire = await prisma.questionnaire.findFirst({
      where: {
        id: questionnaireId,
        isActive: true,
      },
      include: {
        domains: {
          where: {
            id: domainId,
          },
          include: {
            questions: {
              where: {
                isVisible: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!questionnaire || questionnaire.domains.length === 0) {
      return NextResponse.json(
        { message: "Active assessment section was not found." },
        { status: 404 }
      );
    }

    const domain = questionnaire.domains[0];
    const allowedQuestionIds = new Set(
      domain.questions.map((question) => question.id)
    );

    const invalidResponse = responses.find(
      (response) =>
        response.domainId !== domainId ||
        !allowedQuestionIds.has(response.questionId) ||
        response.value.trim().length === 0
    );

    if (invalidResponse) {
      return NextResponse.json(
        {
          message:
            "Responses must belong to visible questions in this assessment section.",
        },
        { status: 400 }
      );
    }

    const attempt = await prisma.assessmentAttempt.upsert({
      where: {
        userId_questionnaireId: {
          userId: carer.id,
          questionnaireId,
        },
      },
      update: {
        status: "IN_PROGRESS",
      },
      create: {
        userId: carer.id,
        questionnaireId,
        status: "IN_PROGRESS",
      },
    });

    await prisma.$transaction(
      responses.map((response) =>
        prisma.assessmentResponse.upsert({
          where: {
            attemptId_questionId: {
              attemptId: attempt.id,
              questionId: response.questionId,
            },
          },
          update: {
            value: response.value,
            domainId: response.domainId,
          },
          create: {
            attemptId: attempt.id,
            questionId: response.questionId,
            domainId: response.domainId,
            value: response.value,
          },
        })
      )
    );

    const refreshedAttempt = await prisma.assessmentAttempt.findUnique({
      where: {
        id: attempt.id,
      },
      include: {
        responses: true,
        questionnaire: {
          include: {
            domains: {
              include: {
                questions: {
                  where: {
                    isVisible: true,
                    deletedAt: null,
                  },
                },
              },
            },
          },
        },
      },
    });

    const visibleQuestionIds =
      refreshedAttempt?.questionnaire.domains.flatMap((assessmentDomain) =>
        assessmentDomain.questions.map((question) => question.id)
      ) || [];

    const answeredQuestionIds = new Set(
      refreshedAttempt?.responses.map((response) => response.questionId) || []
    );

    const isComplete =
      visibleQuestionIds.length > 0 &&
      visibleQuestionIds.every((questionId) =>
        answeredQuestionIds.has(questionId)
      );

    const updatedAttempt = await prisma.assessmentAttempt.update({
      where: {
        id: attempt.id,
      },
      data: {
        status: isComplete ? "COMPLETED" : "IN_PROGRESS",
        completedAt: isComplete ? new Date() : null,
      },
    });

    return NextResponse.json({
      message: isComplete
        ? "Section saved. Assessment completed."
        : "Section saved successfully.",
      attempt: updatedAttempt,
    });
  } catch (error) {
    console.error("Assessment response save error:", error);

    return NextResponse.json(
      { message: "Something went wrong saving your section." },
      { status: 500 }
    );
  }
}
