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

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">Admin Dashboard</h1>
              <p className="text-muted mb-0">
                Welcome back, {user.firstName}. Manage questionnaires, users,
                assessments, and certificates.
              </p>
            </div>

            <span className="badge bg-dark rounded-pill px-3 py-2">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Users</h5>
                  <p className="text-muted">
                    View carers, admins, and employer accounts.
                  </p>
                  <Link
                    href="/admin/users"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Questionnaires</h5>
                  <p className="text-muted">
                    Create domains, questions, and active assessments.
                  </p>
                  <Link
                    href="/admin/questionnaires"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Manage Questionnaires
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Assessments</h5>
                  <p className="text-muted">
                    Review completed and in-progress carer assessments.
                  </p>
                  <Link
                    href="/admin/assessments"
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Assessments
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Certificates</h5>
                  <p className="text-muted">
                    Validate generated certificate IDs.
                  </p>
                  <Link
                    href="/admin/certificates"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Validate Certificates
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Super Admin Tools</h4>
                <p className="text-muted">
                  Review admin access requests and approve or reject new admin
                  accounts.
                </p>

                <Link href="/admin/access-requests" className="btn btn-primary">
                  Manage Admin Requests
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
