import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type DomainAnalytics = {
  domainId: string;
  domainTitle: string;
  averageScore: number;
  completedCarers: number;
  strengthCount: number;
  growthCount: number;
  supportCount: number;
  strengthPercent: number;
  growthPercent: number;
  supportPercent: number;
};

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

function capabilityBucket(score: number) {
  if (score >= 4) {
    return "strength";
  }

  if (score >= 3) {
    return "growth";
  }

  return "support";
}

function percent(part: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can view analytics." },
        { status: 403 }
      );
    }

    const carers = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: "carer",
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    const completedAttempts = await prisma.assessmentAttempt.findMany({
      where: {
        status: "COMPLETED",
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
                },
              },
            },
          },
        },
        responses: true,
      },
    });

    const domainMap = new Map<
      string,
      {
        domainId: string;
        domainTitle: string;
        scores: number[];
      }
    >();

    completedAttempts.forEach((attempt) => {
      const responseMap = new Map(
        attempt.responses.map((response) => [
          response.questionId,
          response.value,
        ])
      );

      attempt.questionnaire.domains.forEach((domain) => {
        const numericResponses = domain.questions
          .map((question) => Number(responseMap.get(question.id)))
          .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

        if (numericResponses.length === 0) {
          return;
        }

        const domainAverage =
          numericResponses.reduce((total, value) => total + value, 0) /
          numericResponses.length;

        const current = domainMap.get(domain.id) || {
          domainId: domain.id,
          domainTitle: domain.title,
          scores: [],
        };

        current.scores.push(Number(domainAverage.toFixed(1)));
        domainMap.set(domain.id, current);
      });
    });

    const domainAnalytics: DomainAnalytics[] = Array.from(domainMap.values())
      .map((domain) => {
        const completedCarers = domain.scores.length;
        const strengthCount = domain.scores.filter(
          (score) => capabilityBucket(score) === "strength"
        ).length;
        const growthCount = domain.scores.filter(
          (score) => capabilityBucket(score) === "growth"
        ).length;
        const supportCount = domain.scores.filter(
          (score) => capabilityBucket(score) === "support"
        ).length;

        const averageScore =
          domain.scores.length === 0
            ? 0
            : domain.scores.reduce((total, score) => total + score, 0) /
              domain.scores.length;

        return {
          domainId: domain.domainId,
          domainTitle: domain.domainTitle,
          averageScore: Number(averageScore.toFixed(1)),
          completedCarers,
          strengthCount,
          growthCount,
          supportCount,
          strengthPercent: percent(strengthCount, completedCarers),
          growthPercent: percent(growthCount, completedCarers),
          supportPercent: percent(supportCount, completedCarers),
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore);

    const totalCompletedAttempts = completedAttempts.length;
    const uniqueCompletedCarers = new Set(
      completedAttempts.map((attempt) => attempt.userId)
    ).size;

    const allDomainScores = domainAnalytics.flatMap((domain) =>
      Array(domain.completedCarers).fill(domain.averageScore)
    );

    const overallAverage =
      domainAnalytics.length === 0
        ? 0
        : domainAnalytics.reduce(
            (total, domain) => total + domain.averageScore,
            0
          ) / domainAnalytics.length;

    const topDomain = domainAnalytics[0] || null;
    const supportDomain =
      [...domainAnalytics].sort(
        (a, b) => b.supportPercent - a.supportPercent
      )[0] || null;

    const totalStrength = domainAnalytics.reduce(
      (total, domain) => total + domain.strengthCount,
      0
    );
    const totalGrowth = domainAnalytics.reduce(
      (total, domain) => total + domain.growthCount,
      0
    );
    const totalSupport = domainAnalytics.reduce(
      (total, domain) => total + domain.supportCount,
      0
    );
    const totalBuckets = totalStrength + totalGrowth + totalSupport;

    return NextResponse.json({
      summary: {
        totalCarers: carers.length,
        completedAssessments: totalCompletedAttempts,
        carersWithCompletedAssessments: uniqueCompletedCarers,
        overallAverageScore: Number(overallAverage.toFixed(1)),
        topDomain,
        supportDomain,
        strengthPercent: percent(totalStrength, totalBuckets),
        growthPercent: percent(totalGrowth, totalBuckets),
        supportPercent: percent(totalSupport, totalBuckets),
      },
      domainAnalytics,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading analytics." },
      { status: 500 }
    );
  }
}