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

type CertificateInfo = {
  available: boolean;
  certificateId: string | null;
  assessmentTitle: string | null;
  completedAt: string | null;
};

type AssessmentStatus = {
  status: "NOT_AVAILABLE" | "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  label: string;
  completedSections: number;
  totalSections: number;
  completedQuestions: number;
  totalQuestions: number;
  progressPercent: number;
  certificate?: CertificateInfo;
};

const emptyCertificate: CertificateInfo = {
  available: false,
  certificateId: null,
  assessmentTitle: null,
  completedAt: null,
};

export default function CarerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [assessmentStatus, setAssessmentStatus] =
    useState<AssessmentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
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

        const statusResponse = await fetch("/api/carer/assessment/status", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setAssessmentStatus(statusData);
        }
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function assessmentBadgeClass(status?: AssessmentStatus["status"]) {
    if (status === "COMPLETED") {
      return "bg-success";
    }

    if (status === "IN_PROGRESS") {
      return "bg-primary";
    }

    if (status === "NOT_AVAILABLE") {
      return "bg-secondary";
    }

    return "bg-warning text-dark";
  }

  function assessmentButtonText(status?: AssessmentStatus["status"]) {
    if (status === "COMPLETED") {
      return "View Assessment";
    }

    if (status === "IN_PROGRESS") {
      return "Continue Assessment";
    }

    return "Start Assessment";
  }

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

  const safeAssessmentStatus =
    assessmentStatus ||
    ({
      status: "NOT_AVAILABLE",
      label: "Not Available",
      completedSections: 0,
      totalSections: 0,
      completedQuestions: 0,
      totalQuestions: 0,
      progressPercent: 0,
      certificate: emptyCertificate,
    } as AssessmentStatus);

  const certificateInfo = safeAssessmentStatus.certificate || emptyCertificate;
  const hasCertificate = certificateInfo.available;

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
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <h5 className="fw-bold mb-0">Assessment</h5>

                    <span
                      className={`badge ${assessmentBadgeClass(
                        safeAssessmentStatus.status
                      )}`}
                    >
                      {safeAssessmentStatus.label}
                    </span>
                  </div>

                  <p className="text-muted mb-3">
                    Complete your current caregiving skill self-assessment.
                  </p>

                  <div className="progress mb-2" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${safeAssessmentStatus.progressPercent}%`,
                      }}
                      aria-valuenow={safeAssessmentStatus.progressPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <small className="text-muted d-block mb-3">
                    {safeAssessmentStatus.progressPercent}% completed ·{" "}
                    {safeAssessmentStatus.completedSections} of{" "}
                    {safeAssessmentStatus.totalSections} sections saved
                  </small>

                  <Link
                    href="/carer/assessment"
                    className={`btn btn-sm ${
                      safeAssessmentStatus.status === "NOT_AVAILABLE"
                        ? "btn-outline-secondary disabled"
                        : "btn-primary"
                    }`}
                  >
                    {assessmentButtonText(safeAssessmentStatus.status)}
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Certificate</h5>

                  <p className="text-muted">
                    Your completed assessment certificates remain available even
                    when new assessments are published.
                  </p>

                  <span
                    className={`badge ${
                      hasCertificate ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {hasCertificate ? "Available" : "Locked"}
                  </span>

                  {hasCertificate && certificateInfo.assessmentTitle && (
                    <small className="text-muted d-block mt-2">
                      Latest: {certificateInfo.assessmentTitle}
                    </small>
                  )}

                  <div className="mt-3">
                    <Link
                      href="/carer/certificate"
                      className={`btn btn-sm ${
                        hasCertificate
                          ? "btn-primary"
                          : "btn-outline-secondary disabled"
                      }`}
                    >
                      View Certificate
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Next Step</h4>

              <p className="text-muted">
                Continue your current assessment to recognise the skills you have
                built through caregiving experience.
              </p>

              <Link
                href="/carer/assessment"
                className={`btn px-4 ${
                  safeAssessmentStatus.status === "NOT_AVAILABLE"
                    ? "btn-outline-secondary disabled"
                    : "btn-primary"
                }`}
              >
                {assessmentButtonText(safeAssessmentStatus.status)}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}