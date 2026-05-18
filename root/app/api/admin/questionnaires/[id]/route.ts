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

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can view questionnaires." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: {
        id,
      },
      include: {
        createdBy: true,
        updatedBy: true,
        domains: {
          orderBy: {
            order: "asc",
          },
          include: {
            createdBy: true,
            updatedBy: true,
            questions: {
              orderBy: {
                order: "asc",
              },
              include: {
                createdBy: true,
                updatedBy: true,
              },
            },
          },
        },
      },
    });

    if (!questionnaire) {
      return NextResponse.json(
        { message: "Questionnaire not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      questionnaire,
    });
  } catch (error) {
    console.error("Questionnaire detail error:", error);

    return NextResponse.json(
      { message: "Something went wrong loading questionnaire." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can update questionnaires." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Questionnaire title is required." },
        { status: 400 }
      );
    }

    const questionnaire = await prisma.questionnaire.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        updatedById: admin.id,
      },
    });

    return NextResponse.json({
      message: "Questionnaire updated successfully.",
      questionnaire,
    });
  } catch (error) {
    console.error("Questionnaire update error:", error);

    return NextResponse.json(
      { message: "Something went wrong updating questionnaire." },
      { status: 500 }
    );
  }
}