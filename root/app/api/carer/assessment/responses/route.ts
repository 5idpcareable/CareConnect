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

    if (!questionnaireId || !domainId || !Array.isArray(responses)) {
      return NextResponse.json(
        { message: "Questionnaire, domain, and responses are required." },
        { status: 400 }
      );
    }

    const questionnaire = await prisma.questionnaire.findUnique({
      where: {
        id: questionnaireId,
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
            },
          },
        },
      },
    });

    if (!questionnaire || !questionnaire.isActive) {
      return NextResponse.json(
        { message: "This assessment is not currently active." },
        { status: 400 }
      );
    }

    const domain = questionnaire.domains.find(
      (currentDomain) => currentDomain.id === domainId
    );

    if (!domain) {
      return NextResponse.json(
        { message: "This assessment section is not available." },
        { status: 400 }
      );
    }

    const allowedQuestionIds = new Set(
      domain.questions.map((question) => question.id)
    );

    const invalidResponse = responses.find(
      (response) => !allowedQuestionIds.has(response.questionId)
    );

    if (invalidResponse) {
      return NextResponse.json(
        { message: "One or more responses do not belong to this section." },
        { status: 400 }
      );
    }

    const missingRequiredQuestion = domain.questions.find((question) => {
      if (!question.isRequired) {
        return false;
      }

      const response = responses.find(
        (currentResponse) => currentResponse.questionId === question.id
      );

      return !response || !String(response.value || "").trim();
    });

    if (missingRequiredQuestion) {
      return NextResponse.json(
        { message: "Please answer all required questions in this section." },
        { status: 400 }
      );
    }

    let attempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: carer.id,
        questionnaireId,
        status: "IN_PROGRESS",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!attempt) {
      attempt = await prisma.assessmentAttempt.create({
        data: {
          userId: carer.id,
          questionnaireId,
          status: "IN_PROGRESS",
        },
      });
    }

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
            value: String(response.value),
            domainId: response.domainId,
          },
          create: {
            attemptId: attempt.id,
            questionId: response.questionId,
            domainId: response.domainId,
            value: String(response.value),
          },
        })
      )
    );

    const visibleDomains = questionnaire.domains;
    const visibleQuestions = visibleDomains.flatMap(
      (currentDomain) => currentDomain.questions
    );

    const savedResponses = await prisma.assessmentResponse.findMany({
      where: {
        attemptId: attempt.id,
        questionId: {
          in: visibleQuestions.map((question) => question.id),
        },
      },
    });

    const answeredQuestionIds = new Set(
      savedResponses
        .filter((response) => String(response.value || "").trim())
        .map((response) => response.questionId)
    );

    const requiredQuestions = visibleQuestions.filter(
      (question) => question.isRequired
    );

    const completedRequiredQuestions = requiredQuestions.filter((question) =>
      answeredQuestionIds.has(question.id)
    );

    const completedDomains = visibleDomains.filter((currentDomain) =>
      currentDomain.questions
        .filter((question) => question.isRequired)
        .every((question) => answeredQuestionIds.has(question.id))
    );

    const isComplete =
      requiredQuestions.length > 0 &&
      completedRequiredQuestions.length === requiredQuestions.length;

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
        ? "Assessment completed. Your certificate is now available."
        : "Section saved successfully.",
      attempt: {
        id: updatedAttempt.id,
        status: updatedAttempt.status,
        completedAt: updatedAttempt.completedAt,
      },
      progress: {
        completedSections: completedDomains.length,
        totalSections: visibleDomains.length,
        completedQuestions: completedRequiredQuestions.length,
        totalQuestions: requiredQuestions.length,
        progressPercent:
          requiredQuestions.length === 0
            ? 0
            : Math.round(
                (completedRequiredQuestions.length / requiredQuestions.length) *
                  100
              ),
      },
    });
  } catch (error) {
    console.error("Assessment response save error:", error);

    return NextResponse.json(
      { message: "Something went wrong saving assessment responses." },
      { status: 500 }
    );
  }
}