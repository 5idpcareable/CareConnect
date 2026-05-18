import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type DomainScore = {
  domainId: string;
  domainTitle: string;
  score: number;
  level: string;
  levelDescription: string;
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

function formatCertificateDate(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCapabilityLevel(score: number) {
  if (score >= 4) {
    return {
      level: "Strength area",
      levelDescription: "High demonstrated capability",
    };
  }

  if (score >= 3) {
    return {
      level: "Growth area",
      levelDescription: "Developing competency",
    };
  }

  return {
    level: "Support area",
    levelDescription: "Targeted learning recommended",
  };
}

function parseLikertValue(value: string) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  if (numericValue < 1 || numericValue > 5) {
    return null;
  }

  return numericValue;
}

export async function GET() {
  try {
    const carer = await requireCarer();

    if (!carer) {
      return NextResponse.json(
        { message: "Only carers can view certificates." },
        { status: 403 }
      );
    }

    const completedAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: carer.id,
        status: "COMPLETED",
      },
      orderBy: {
        completedAt: "desc",
      },
      include: {
        questionnaire: true,
        responses: {
          include: {
            domain: true,
            question: true,
          },
        },
      },
    });

    if (!completedAttempt) {
      return NextResponse.json(
        {
          message: "Certificate is locked until you complete your assessment.",
        },
        { status: 403 }
      );
    }

    const domainValues = new Map<
      string,
      {
        domainTitle: string;
        values: number[];
      }
    >();

    for (const response of completedAttempt.responses) {
      const numericValue = parseLikertValue(response.value);

      if (numericValue === null) {
        continue;
      }

      const currentDomain = domainValues.get(response.domainId) || {
        domainTitle: response.domain.title,
        values: [],
      };

      currentDomain.values.push(numericValue);
      domainValues.set(response.domainId, currentDomain);
    }

    const domainScores: DomainScore[] = Array.from(domainValues.entries())
      .map(([domainId, domain]) => {
        const average =
          domain.values.reduce((total, value) => total + value, 0) /
          domain.values.length;

        const roundedScore = Number(average.toFixed(1));
        const capability = getCapabilityLevel(roundedScore);

        return {
          domainId,
          domainTitle: domain.domainTitle,
          score: roundedScore,
          level: capability.level,
          levelDescription: capability.levelDescription,
        };
      })
      .sort((first, second) => second.score - first.score);

    const topCapabilityAreas = domainScores.filter(
      (domainScore) => domainScore.score >= 4
    );

    return NextResponse.json({
      certificate: {
        certificateId: completedAttempt.id,
        carerName: `${carer.firstName} ${carer.lastName}`,
        email: carer.email,
        assessmentTitle: completedAttempt.questionnaire.title,
        completedAt: completedAttempt.completedAt,
        completedDate: formatCertificateDate(completedAttempt.completedAt),
        status: "Verified",
        domainsCompleted: domainScores.length,
        domainScores,
        topCapabilityAreas,
      },
    });
  } catch (error) {
    console.error("Certificate load error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading certificate." },
      { status: 500 }
    );
  }
}
