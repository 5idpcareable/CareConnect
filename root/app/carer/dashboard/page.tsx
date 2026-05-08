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

export default function CarerDashboardPage() {
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

        if (!data.user) {
          window.location.href = "/login";
          return;
        }

        setUser(data.user);
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
            <div className="alert alert-info mb-0">Loading dashboard...</div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">Carer Dashboard</h1>
              <p className="text-muted mb-0">
                Welcome back, {user.firstName}. Manage your profile,
                assessments, and certificate.
              </p>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <span className="badge bg-primary rounded-pill px-3 py-2">
                Role ID: {user.roleId || "1"} | {user.roles.join(", ")}
              </span>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Profile</h5>
                  <p className="text-muted">
                    Your account has been created and your carer role has been
                    saved.
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success">Registered</span>

                    <Link
                         href="/carer/profile"
                      className="badge bg-primary text-white text-decoration-none"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Assessment</h5>
                  <p className="text-muted">
                    Complete your caregiving skill self-assessment.
                  </p>
                  <span className="badge bg-warning text-dark">
                    Not Started
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Certificate</h5>
                  <p className="text-muted">
                    Your certificate will be available after assessment
                    completion.
                  </p>
                  <span className="badge bg-secondary">Locked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Next Step</h4>

              <p className="text-muted">
                Start your assessment to recognise the skills you have built
                through caregiving experience.
              </p>

              <Link
                href="/register/carer/assessment"
                className="btn btn-primary px-4"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
