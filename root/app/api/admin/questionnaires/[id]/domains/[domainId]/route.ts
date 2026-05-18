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

function canModifyDomain(
  admin: Awaited<ReturnType<typeof requireAdmin>>,
  createdById: string | null
) {
  if (!admin) {
    return false;
  }

  const isSuperAdmin = admin.roles.some(
    (userRole) => userRole.role.name === "super_admin"
  );

  return isSuperAdmin || createdById === admin.id;
}

async function syncQuestionnaireActiveStatus(
  questionnaireId: string,
  adminId: string
) {
  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: questionnaireId,
    },
    include: {
      domains: {
        include: {
          questions: true,
        },
      },
    },
  });

  if (!questionnaire) {
    return {
      isActive: false,
      reason: "Questionnaire not found.",
    };
  }

  const visibleDomains = questionnaire.domains.filter(
    (domain) => domain.isVisible && !domain.deletedAt
  );

  const canBeActive =
    visibleDomains.length > 0 &&
    visibleDomains.every((domain) =>
      domain.questions.some(
        (question) => question.isVisible && !question.deletedAt
      )
    );

  if (canBeActive) {
    await prisma.$transaction([
      prisma.questionnaire.updateMany({
        where: {
          id: {
            not: questionnaireId,
          },
        },
        data: {
          isActive: false,
        },
      }),
      prisma.questionnaire.update({
        where: {
          id: questionnaireId,
        },
        data: {
          isActive: true,
          updatedById: adminId,
        },
      }),
    ]);

    return {
      isActive: true,
      reason: "Questionnaire is active.",
    };
  }

  if (questionnaire.isActive) {
    await prisma.questionnaire.update({
      where: {
        id: questionnaireId,
      },
      data: {
        isActive: false,
        updatedById: adminId,
      },
    });
  }

  return {
    isActive: false,
    reason:
      "Questionnaire is not active. Every visible domain needs at least one visible question.",
  };
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ domainId: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can update domains." },
        { status: 403 }
      );
    }

    const { domainId } = await context.params;
    const body = await request.json();

    const { title, description } = body;

    if (!title || String(title).trim().length === 0) {
      return NextResponse.json(
        { message: "Domain title is required." },
        { status: 400 }
      );
    }

    const domain = await prisma.assessmentDomain.findUnique({
      where: {
        id: domainId,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { message: "Domain not found." },
        { status: 404 }
      );
    }

    if (!canModifyDomain(admin, domain.createdById)) {
      return NextResponse.json(
        {
          message:
            "Only the domain creator or super admin can update this domain.",
        },
        { status: 403 }
      );
    }

    const updatedDomain = await prisma.assessmentDomain.update({
      where: {
        id: domainId,
      },
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        updatedById: admin.id,
      },
    });

    await prisma.questionnaire.update({
      where: {
        id: domain.questionnaireId,
      },
      data: {
        updatedById: admin.id,
      },
    });

    return NextResponse.json({
      message: "Domain updated successfully.",
      domain: updatedDomain,
    });
  } catch (error) {
    console.error("Domain update error:", error);

    return NextResponse.json(
      { message: "Something went wrong updating domain." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ domainId: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can manage domains." },
        { status: 403 }
      );
    }

    const { domainId } = await context.params;
    const body = await request.json();

    const { action } = body as {
      action?: "toggle-visibility" | "soft-delete";
    };

    const domain = await prisma.assessmentDomain.findUnique({
      where: {
        id: domainId,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { message: "Domain not found." },
        { status: 404 }
      );
    }

    if (!canModifyDomain(admin, domain.createdById)) {
      return NextResponse.json(
        {
          message:
            "Only the domain creator or super admin can manage this domain.",
        },
        { status: 403 }
      );
    }

    if (action === "toggle-visibility") {
      if (domain.deletedAt) {
        return NextResponse.json(
          { message: "Deleted domains cannot be made visible." },
          { status: 400 }
        );
      }

      const updatedDomain = await prisma.assessmentDomain.update({
        where: {
          id: domainId,
        },
        data: {
          isVisible: !domain.isVisible,
          updatedById: admin.id,
        },
      });

      const status = await syncQuestionnaireActiveStatus(
        domain.questionnaireId,
        admin.id
      );

      return NextResponse.json({
        message: updatedDomain.isVisible
          ? `Domain is now visible. ${status.reason}`
          : `Domain is now hidden. ${status.reason}`,
        domain: updatedDomain,
      });
    }

    if (action === "soft-delete") {
      const updatedDomain = await prisma.assessmentDomain.update({
        where: {
          id: domainId,
        },
        data: {
          isVisible: false,
          deletedAt: new Date(),
          updatedById: admin.id,
        },
      });

      const status = await syncQuestionnaireActiveStatus(
        domain.questionnaireId,
        admin.id
      );

      return NextResponse.json({
        message: `Domain deleted from active view. ${status.reason}`,
        domain: updatedDomain,
      });
    }

    return NextResponse.json(
      { message: "Invalid domain action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Domain action error:", error);

    return NextResponse.json(
      { message: "Something went wrong managing domain." },
      { status: 500 }
    );
  }
}