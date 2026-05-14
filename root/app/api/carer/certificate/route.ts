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
      },
    });

    if (!completedAttempt) {
      return NextResponse.json(
        {
          message:
            "Certificate is locked until you complete your assessment.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      certificate: {
        certificateId: completedAttempt.id,
        carerName: `${carer.firstName} ${carer.lastName}`,
        email: carer.email,
        assessmentTitle: completedAttempt.questionnaire.title,
        completedAt: completedAttempt.completedAt,
        completedDate: formatCertificateDate(completedAttempt.completedAt),
        status: "Verified",
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
