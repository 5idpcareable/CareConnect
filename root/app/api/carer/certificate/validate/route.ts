import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type DomainScore = {
  domainId: string;
  title: string;
  score: number;
  capabilityLevel: string;
  capabilityDescription: string;
};

function getCapability(score: number) {
  if (score >= 4) {
    return {
      capabilityLevel: "Strength area",
      capabilityDescription: "High demonstrated capability",
    };
  }

  if (score >= 3) {
    return {
      capabilityLevel: "Growth area",
      capabilityDescription: "Developing competency",
    };
  }

  return {
    capabilityLevel: "Support area",
    capabilityDescription: "Targeted learning recommended",
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { certificateId } = body as {
      certificateId?: string;
    };

    if (!certificateId || certificateId.trim().length === 0) {
      return NextResponse.json(
        { message: "Certificate ID is required." },
        { status: 400 }
      );
    }

    const completedAttempt = await prisma.assessmentAttempt.findUnique({
      where: {
        id: certificateId.trim(),
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
              orderBy: {
                order: "asc",
              },
              include: {
                questions: {
                  where: {
                    type: "LIKERT_1_5",
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
        },
        responses: true,
      },
    });

    if (!completedAttempt || completedAttempt.status !== "COMPLETED") {
      return NextResponse.json(
        {
          valid: false,
          message: "Certificate ID was not found or is not completed.",
        },
        { status: 404 }
      );
    }

    const responseMap = new Map(
      completedAttempt.responses.map((response) => [
        response.questionId,
        response.value,
      ])
    );

    const domainScores: DomainScore[] = completedAttempt.questionnaire.domains
      .map((domain) => {
        const numericResponses = domain.questions
          .map((question) => Number(responseMap.get(question.id)))
          .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

        if (numericResponses.length === 0) {
          return null;
        }

        const average =
          numericResponses.reduce((total, value) => total + value, 0) /
          numericResponses.length;

        const score = Number(average.toFixed(1));
        const capability = getCapability(score);

        return {
          domainId: domain.id,
          title: domain.title,
          score,
          capabilityLevel: capability.capabilityLevel,
          capabilityDescription: capability.capabilityDescription,
        };
      })
      .filter((domainScore): domainScore is DomainScore => Boolean(domainScore));

    const topCapabilityAreas = domainScores.filter(
      (domainScore) => domainScore.score >= 4
    );

    return NextResponse.json({
      valid: true,
      certificate: {
        id: completedAttempt.id,
        carerName: `${completedAttempt.user.firstName} ${completedAttempt.user.lastName}`,
        assessmentTitle: completedAttempt.questionnaire.title,
        completionDate: completedAttempt.completedAt,
        domainsCompleted: domainScores.length,
        topCapabilityAreas,
        status: "Verified",
      },
    });
  } catch (error) {
    console.error("Certificate validation error:", error);

    return NextResponse.json(
      { message: "Something went wrong validating certificate." },
      { status: 500 }
    );
  }
}