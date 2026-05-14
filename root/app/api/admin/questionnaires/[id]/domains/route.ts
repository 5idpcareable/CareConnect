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

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can add domains." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Domain title is required." },
        { status: 400 }
      );
    }

    const existingDomainCount = await prisma.assessmentDomain.count({
      where: {
        questionnaireId: id,
      },
    });

    const domain = await prisma.assessmentDomain.create({
      data: {
        questionnaireId: id,
        title,
        description,
        order: existingDomainCount + 1,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    await prisma.questionnaire.update({
      where: {
        id,
      },
      data: {
        updatedById: admin.id,
      },
    });

    return NextResponse.json({
      message: "Domain added successfully.",
      domain,
    });
  } catch (error) {
    console.error("Domain create error:", error);

    return NextResponse.json(
      { message: "Something went wrong adding domain." },
      { status: 500 }
    );
  }
}
