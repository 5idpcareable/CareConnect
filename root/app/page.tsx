"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

type User = {
  id: string;
  roleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export default function Home() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function redirectIfLoggedIn() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          setCheckingAuth(false);
          return;
        }

        const data = await response.json();
        const user: User | null = data.user;

        if (!user) {
          setCheckingAuth(false);
          return;
        }

        if (
          user.roles.includes("admin") ||
          user.roles.includes("super_admin")
        ) {
          window.location.href = "/admin/dashboard";
          return;
        }

        if (user.roles.includes("employer")) {
          window.location.href = "/employer/dashboard";
          return;
        }

        if (user.roles.includes("carer")) {
          window.location.href = "/carer/dashboard";
          return;
        }

        setCheckingAuth(false);
      } catch {
        setCheckingAuth(false);
      }
    }

    redirectIfLoggedIn();
  }, []);

  if (checkingAuth) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading...</div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main>
        <section className="py-5 bg-light">
          <div className="container py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <span className="badge bg-primary rounded-pill px-3 py-2 mb-3">
                  CareAble
                </span>

                <h1 className="display-4 fw-bold mb-4">
                  Supporting Hidden Carers Through Skill Recognition
                </h1>

                <p className="lead text-muted mb-4">
                  CareAble helps unpaid carers recognise their caregiving
                  skills, complete self-assessments, and receive meaningful
                  digital certification.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3">
                  <Link href="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>

                  <a href="#about" className="btn btn-outline-primary btn-lg">
                    Learn More
                  </a>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="bg-white rounded-4 shadow p-4 p-lg-5">
                  <h3 className="fw-bold text-primary mb-3">
                    Skill Recognition for Carers
                  </h3>

                  <div className="d-grid gap-3">
                    <div className="border rounded-4 p-3">
                      <h6 className="fw-bold mb-1">Self-Assessment</h6>
                      <p className="text-muted mb-0">
                        Carers complete domain-based questions at their own
                        pace.
                      </p>
                    </div>

                    <div className="border rounded-4 p-3">
                      <h6 className="fw-bold mb-1">Capability Scores</h6>
                      <p className="text-muted mb-0">
                        Responses are grouped into strength, growth, and support
                        areas.
                      </p>
                    </div>

                    <div className="border rounded-4 p-3">
                      <h6 className="fw-bold mb-1">Digital Certificate</h6>
                      <p className="text-muted mb-0">
                        Completed assessments generate a verifiable CareAble
                        certificate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-5 bg-white">
          <div className="container py-4">
            <div className="row align-items-center g-4">
              <div className="col-lg-5">
                <h2 className="fw-bold text-primary mb-3">About CareAble</h2>
                <p className="text-muted mb-0">
                  CareAble is a mobile-friendly platform designed to support
                  unpaid carers by recognising the real skills they build through
                  caregiving. It connects informal care experience with
                  structured skill domains, assessment records, and certificate
                  validation.
                </p>
              </div>

              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="bg-light rounded-4 p-4 h-100">
                      <h5 className="fw-bold">Carers</h5>
                      <p className="text-muted mb-0">
                        Register, complete assessments, track progress, and view
                        certificates.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="bg-light rounded-4 p-4 h-100">
                      <h5 className="fw-bold">Admins</h5>
                      <p className="text-muted mb-0">
                        Manage questionnaires, review assessment data, and view
                        analytics.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="bg-light rounded-4 p-4 h-100">
                      <h5 className="fw-bold">Employers</h5>
                      <p className="text-muted mb-0">
                        Validate certificate authenticity using a certificate
                        ID.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-5 bg-light">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-primary mb-2">Platform Features</h2>
              <p className="text-muted mb-0">
                Everything needed for the core CareAble assessment workflow.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Secure Login</h5>
                    <p className="text-muted mb-0">
                      Role-based login sends carers and admins to the correct
                      dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Questionnaire Builder</h5>
                    <p className="text-muted mb-0">
                      Admins create domains and questions, then control which
                      items are visible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Saved Assessments</h5>
                    <p className="text-muted mb-0">
                      Carers can save sections and continue assessment progress.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Scoring Engine</h5>
                    <p className="text-muted mb-0">
                      Domain scores are calculated from Likert responses and
                      grouped into capability levels.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Certificates</h5>
                    <p className="text-muted mb-0">
                      Completed assessments generate certificates with top
                      capability areas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Analytics</h5>
                    <p className="text-muted mb-0">
                      Admins can review capability patterns, domain averages,
                      and support areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-5 bg-white">
          <div className="container py-4">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="fw-bold text-primary mb-3">Contact</h2>
                <p className="text-muted mb-4">
                  For the MVP, CareAble support can be managed by the project
                  admin team. Carers can register, complete assessments, and
                  return to their dashboard anytime.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link href="/register" className="btn btn-primary btn-lg">
                    Create Account
                  </Link>

                  <Link href="/login" className="btn btn-outline-primary btn-lg">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}