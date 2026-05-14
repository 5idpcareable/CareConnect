import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can view questionnaires." },
        { status: 403 }
      );
    }

    const questionnaires = await prisma.questionnaire.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        domains: {
          include: {
            questions: true,
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });

    return NextResponse.json({
      questionnaires: questionnaires.map((questionnaire) => ({
        id: questionnaire.id,
        title: questionnaire.title,
        description: questionnaire.description,
        isActive: questionnaire.isActive,
        domainCount: questionnaire.domains.length,
        questionCount: questionnaire.domains.reduce(
          (total, domain) =>
            total +
            domain.questions.filter(
              (question) => question.isVisible && !question.deletedAt
            ).length,
          0
        ),
        createdAt: questionnaire.createdAt,
        updatedAt: questionnaire.updatedAt,
        createdBy: questionnaire.createdBy
          ? `${questionnaire.createdBy.firstName} ${questionnaire.createdBy.lastName}`
          : "Unknown",
        updatedBy: questionnaire.updatedBy
          ? `${questionnaire.updatedBy.firstName} ${questionnaire.updatedBy.lastName}`
          : "Unknown",
      })),
    });
  } catch (error) {
    console.error("Questionnaire list error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading questionnaires." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can create questionnaires." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Questionnaire title is required." },
        { status: 400 }
      );
    }

    const questionnaire = await prisma.questionnaire.create({
      data: {
        title,
        description,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    return NextResponse.json({
      message: "Questionnaire created successfully.",
      questionnaire,
    });
  } catch (error) {
    console.error("Questionnaire create error:", error);

    return NextResponse.json(
      { message: "Something went wrong creating questionnaire." },
      { status: 500 }
    );
  }
}
