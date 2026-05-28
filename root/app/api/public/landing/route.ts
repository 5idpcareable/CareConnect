import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      carerCount,
      totalAttempts,
      completedAttempts,
      completedResponses,
      activeQuestionnaire,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          roles: {
            some: {
              role: {
                name: "carer",
              },
            },
          },
        },
      }),

      prisma.assessmentAttempt.count(),

      prisma.assessmentAttempt.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.assessmentResponse.findMany({
        where: {
          attempt: {
            status: "COMPLETED",
          },
          question: {
            type: "LIKERT_1_5",
            isVisible: true,
            deletedAt: null,
          },
        },
        select: {
          value: true,
        },
      }),

      prisma.questionnaire.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          updatedAt: "desc",
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
      }),
    ]);

    const validScores = completedResponses
      .map((response) => Number(response.value))
      .filter((score) => Number.isFinite(score) && score >= 1 && score <= 5);

    const averageScore =
      validScores.length > 0
        ? validScores.reduce((total, score) => total + score, 0) /
          validScores.length
        : 0;

    const completionRate =
      totalAttempts > 0
        ? Math.round((completedAttempts / totalAttempts) * 100)
        : 0;

    const visibleDomains = activeQuestionnaire?.domains || [];

    const visibleQuestionCount = visibleDomains.reduce(
      (total, domain) => total + domain.questions.length,
      0
    );

    const domainPreview = visibleDomains.slice(0, 4).map((domain) => ({
      id: domain.id,
      title: domain.title,
      questionCount: domain.questions.length,
    }));

    return NextResponse.json({
      metrics: {
        registeredCarers: carerCount,
        assessmentCompletionRate: completionRate,
        visibleDomains: visibleDomains.length,
        visibleQuestions: visibleQuestionCount,
        certificatesIssued: completedAttempts,
        averageScore: Number(averageScore.toFixed(1)),
      },

      activeAssessment: activeQuestionnaire
        ? {
            id: activeQuestionnaire.id,
            title: activeQuestionnaire.title,
            description: activeQuestionnaire.description,
            domains: domainPreview,
          }
        : null,
    });
  } catch (error) {
    console.error("Public landing metrics error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong loading platform statistics.",
      },
      { status: 500 }
    );
  }
}