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
        { message: "Only carers can view assessment status." },
        { status: 403 }
      );
    }

    const completedCertificateAttempt = await prisma.assessmentAttempt.findFirst(
      {
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
      }
    );

    const certificate = completedCertificateAttempt
      ? {
          available: true,
          certificateId: completedCertificateAttempt.id,
          assessmentTitle: completedCertificateAttempt.questionnaire.title,
          completedAt: completedCertificateAttempt.completedAt,
        }
      : {
          available: false,
          certificateId: null,
          assessmentTitle: null,
          completedAt: null,
        };

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

    if (!questionnaire) {
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

    const visibleDomains = questionnaire.domains.filter(
      (domain) => domain.questions.length > 0
    );

    const totalSections = visibleDomains.length;
    const totalQuestions = visibleDomains.reduce(
      (total, domain) => total + domain.questions.length,
      0
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

    if (!attempt) {
      return NextResponse.json({
        status: "NOT_STARTED",
        label: "Not Started",
        completedSections: 0,
        totalSections,
        completedQuestions: 0,
        totalQuestions,
        progressPercent: 0,
        certificate,
      });
    }

    const answeredQuestionIds = new Set(
      attempt.responses.map((response) => response.questionId)
    );

    const completedSections = visibleDomains.filter((domain) =>
      domain.questions.every((question) => answeredQuestionIds.has(question.id))
    ).length;

    const completedQuestions = visibleDomains.reduce(
      (total, domain) =>
        total +
        domain.questions.filter((question) =>
          answeredQuestionIds.has(question.id)
        ).length,
      0
    );

    const progressPercent =
      totalQuestions > 0
        ? Math.round((completedQuestions / totalQuestions) * 100)
        : 0;

    const status =
      completedSections === totalSections && totalSections > 0
        ? "COMPLETED"
        : "IN_PROGRESS";

    return NextResponse.json({
      status,
      label: status === "COMPLETED" ? "Completed" : "In Progress",
      completedSections,
      totalSections,
      completedQuestions,
      totalQuestions,
      progressPercent,
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