"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  roleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

type AdminModule = {
  title: string;
  description: string;
  href: string;
  action: string;
  shortCode: string;
};

const primaryModules: AdminModule[] = [
  {
    title: "Users",
    description: "Review carers, admins, employers, roles, and account access.",
    href: "/admin/users",
    action: "Manage Users",
    shortCode: "US",
  },
  {
    title: "Questionnaires",
    description: "Build domains, questions, visibility rules, and assessment sets.",
    href: "/admin/questionnaires",
    action: "Open Builder",
    shortCode: "QB",
  },
  {
    title: "Assessments",
    description: "Monitor progress, completed attempts, and carer assessment records.",
    href: "/admin/assessments",
    action: "Review Assessments",
    shortCode: "AS",
  },
  {
    title: "Certificates",
    description: "Look up and validate issued certificate IDs for external checks.",
    href: "/admin/validate",
    action: "Validate IDs",
    shortCode: "CV",
  },
];

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        const currentUser: User | null = data.user;

        if (!currentUser) {
          window.location.href = "/login";
          return;
        }

        const canAccessAdmin =
          currentUser.roles.includes("admin") ||
          currentUser.roles.includes("super_admin");

        if (!canAccessAdmin) {
          window.location.href = "/carer/dashboard";
          return;
        }

        setUser(currentUser);
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading admin dashboard...
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const isSuperAdmin = user.roles.includes("super_admin");

  return (
    <>
      <Navbar />

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #f5f7fb;
        }

        .dashboard-container {
          max-width: 1180px;
        }

        .dashboard-header {
          background: #ffffff;
          border: 1px solid #dde7f5;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
        }

        .section-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #5b6b82;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .role-pill {
          background: #111827;
          color: #ffffff;
          border-radius: 999px;
          padding: 0.45rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .module-card {
          border: 1px solid #e1e8f3;
          border-radius: 10px;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            border-color 0.18s ease;
        }

        .module-card:hover {
          transform: translateY(-3px);
          border-color: rgba(13, 110, 253, 0.35);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
        }

        .module-code {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #edf4ff;
          color: #0d6efd;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .module-action {
          min-width: 150px;
        }

        .wide-panel {
          border: 1px solid #e1e8f3;
          border-radius: 10px;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
        }

        .quick-link {
          border: 1px solid #d7e5ff;
          background: #f7fbff;
          color: #0d6efd;
          border-radius: 999px;
          padding: 0.38rem 0.8rem;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .admin-actions {
          min-width: 210px;
        }

        @media (max-width: 991px) {
          .admin-actions {
            min-width: 100%;
          }

          .module-action {
            width: 100%;
          }
        }
      `}</style>

      <main className="dashboard-page py-4 py-lg-5">
        <div className="container dashboard-container">
          <section className="dashboard-header p-4 p-lg-5 mb-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span className="section-label">CareAble Admin Console</span>
                  <span className="role-pill">
                    {isSuperAdmin ? "Super Admin" : "Admin"}
                  </span>
                </div>

                <h1 className="fw-bold text-primary mb-2">
                  Admin Dashboard
                </h1>

                <p className="text-muted mb-0" style={{ maxWidth: "760px" }}>
                  Welcome back, {user.firstName}. Use this workspace to manage
                  questionnaire content, review assessment activity, validate
                  certificates, and monitor reporting outcomes.
                </p>
              </div>

              <div className="d-grid gap-2 admin-actions align-self-lg-center">
                <Link href="/admin/questionnaires" className="btn btn-primary">
                  Open Questionnaire Builder
                </Link>

                <Link href="/admin/analytics" className="btn btn-outline-primary">
                  View Analytics
                </Link>
              </div>
            </div>
          </section>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="section-label">Core Management</span>
              <h2 className="h4 fw-bold mb-0">Workspace Modules</h2>
            </div>
          </div>

          <div className="row g-3 mb-4">
            {primaryModules.map((module) => (
              <div className="col-md-6 col-xl-3" key={module.href}>
                <div className="module-card h-100 p-4">
                  <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <span className="module-code">{module.shortCode}</span>
                  </div>

                  <h5 className="fw-bold mb-2">{module.title}</h5>

                  <p className="text-muted mb-4">{module.description}</p>

                  <Link
                    href={module.href}
                    className="btn btn-outline-primary btn-sm module-action"
                  >
                    {module.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className={isSuperAdmin ? "col-lg-7" : "col-lg-12"}>
              <section className="wide-panel h-100 p-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
                  <div>
                    <span className="section-label">Insights</span>
                    <h3 className="h4 fw-bold mt-1 mb-2">
                      Analytics & Reporting
                    </h3>

                    <p className="text-muted mb-3">
                      Review domain averages, strength areas, growth areas, and
                      support needs across completed assessments.
                    </p>

                    <div className="d-flex flex-wrap gap-2">
                      <span className="quick-link">Domain trends</span>
                      <span className="quick-link">Capability heatmap</span>
                      <span className="quick-link">Completion tracking</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-lg-center">
                    <Link
                      href="/admin/analytics"
                      className="btn btn-primary px-4 module-action"
                    >
                      View Reporting
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {isSuperAdmin && (
              <div className="col-lg-5">
                <section className="wide-panel h-100 p-4">
                  <span className="section-label">Access Control</span>
                  <h3 className="h4 fw-bold mt-1 mb-2">
                    Super Admin Reviews
                  </h3>

                  <p className="text-muted mb-4">
                    Approve trusted admins and employers before they receive
                    access to protected areas of the platform.
                  </p>

                  <div className="d-grid gap-2">
                    <Link
                      href="/admin/access-requests"
                      className="btn btn-primary"
                    >
                      Review Admin Requests
                    </Link>

                    <Link
                      href="/admin/employer-requests"
                      className="btn btn-outline-primary"
                    >
                      Review Employer Requests
                    </Link>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}