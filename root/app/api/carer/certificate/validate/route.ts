import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type DomainScore = {
  domainId: string;
  title: string;
  score: number;
  capabilityLevel: string;
  capabilityDescription: string;
};

type Verifier = {
  id: string;
  roles: string[];
};

async function requireAuthenticatedVerifier(): Promise<Verifier | null> {
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

  const roles = session.user.roles.map((userRole) => userRole.role.name);

  const canViewCertificate = roles.some((role) =>
    ["carer", "employer", "admin", "super_admin"].includes(role)
  );

  if (!canViewCertificate) {
    return null;
  }

  return {
    id: session.user.id,
    roles,
  };
}

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
    const verifier = await requireAuthenticatedVerifier();

    if (!verifier) {
      return NextResponse.json(
        {
          valid: false,
          requiresLogin: true,
          message: "Please login to view certificate verification details.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const certificateId =
      typeof body.certificateId === "string"
        ? body.certificateId.trim()
        : "";

    if (!certificateId) {
      return NextResponse.json(
        {
          valid: false,
          message: "Certificate ID is required.",
        },
        { status: 400 }
      );
    }

    const completedAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        id: certificateId,
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

    if (!completedAttempt) {
      return NextResponse.json(
        {
          valid: false,
          message: "Certificate ID was not found or is not completed.",
        },
        { status: 404 }
      );
    }

    const isCarer = verifier.roles.includes("carer");
    const isPrivilegedVerifier = verifier.roles.some((role) =>
      ["employer", "admin", "super_admin"].includes(role)
    );

    if (
      isCarer &&
      !isPrivilegedVerifier &&
      completedAttempt.userId !== verifier.id
    ) {
      return NextResponse.json(
        {
          valid: false,
          message: "You can only view your own certificate details.",
        },
        { status: 403 }
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
      .filter((domainScore): domainScore is DomainScore =>
        Boolean(domainScore)
      );

    const overallScore =
      domainScores.length > 0
        ? Number(
            (
              domainScores.reduce((total, domain) => total + domain.score, 0) /
              domainScores.length
            ).toFixed(1)
          )
        : 0;

    const overallCapability = getCapability(overallScore);

    return NextResponse.json({
      valid: true,
      certificate: {
        id: completedAttempt.id,
        carerName: `${completedAttempt.user.firstName} ${completedAttempt.user.lastName}`,
        assessmentTitle: completedAttempt.questionnaire.title,
        completionDate: completedAttempt.completedAt,
        domainsCompleted: domainScores.length,
        overallScore,
        overallOutcome: overallCapability.capabilityLevel,
        domainScores,
        status: "Verified",
      },
    });
  } catch (error) {
    console.error("Certificate validation error:", error);

    return NextResponse.json(
      {
        valid: false,
        message: "Something went wrong validating certificate.",
      },
      { status: 500 }
    );
  }
}