"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type AssessmentStatus = "IN_PROGRESS" | "COMPLETED";
type StatusFilter = "all" | "IN_PROGRESS" | "COMPLETED";
type PageSize = "5" | "10" | "15" | "all";

type AdminAssessment = {
  id: string;
  certificateId: string | null;
  status: AssessmentStatus;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
  carer: {
    id: string;
    name: string;
    email: string;
  };
  questionnaire: {
    id: string;
    title: string;
  };
  progress: {
    completedQuestions: number;
    totalQuestions: number;
    progressPercent: number;
  };
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not completed";
  }

  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusBadgeClass(status: AssessmentStatus) {
  if (status === "COMPLETED") {
    return "bg-success";
  }

  return "bg-primary";
}

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<AdminAssessment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageSize, setPageSize] = useState<PageSize>("5");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssessments() {
      try {
        const response = await fetch("/api/admin/assessments", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Could not load assessments.");
          return;
        }

        setAssessments(data.assessments || []);
      } catch {
        setError("Something went wrong loading assessments.");
      } finally {
        setLoading(false);
      }
    }

    loadAssessments();
  }, []);

  const filteredAssessments = useMemo(() => {
    if (statusFilter === "all") {
      return assessments;
    }

    return assessments.filter((assessment) => assessment.status === statusFilter);
  }, [assessments, statusFilter]);

  const totalItems = filteredAssessments.length;
  const pageSizeNumber =
    pageSize === "all" ? Math.max(totalItems, 1) : Number(pageSize);
  const totalPages =
    pageSize === "all" ? 1 : Math.max(1, Math.ceil(totalItems / pageSizeNumber));

  const paginatedAssessments =
    pageSize === "all"
      ? filteredAssessments
      : filteredAssessments.slice(
          (page - 1) * pageSizeNumber,
          page * pageSizeNumber
        );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const completedCount = assessments.filter(
    (assessment) => assessment.status === "COMPLETED"
  ).length;

  const inProgressCount = assessments.filter(
    (assessment) => assessment.status === "IN_PROGRESS"
  ).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading assessments...
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">
                Assessment Register
              </h1>
              <p className="text-muted mb-0">
                Review completed and in-progress carer assessments.
              </p>
            </div>

            <Link href="/admin/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">Total Attempts</small>
                  <div className="display-6 fw-bold text-primary">
                    {assessments.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">Completed</small>
                  <div className="display-6 fw-bold text-success">
                    {completedCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">In Progress</small>
                  <div className="display-6 fw-bold text-primary">
                    {inProgressCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Assessments</h4>
                  <p className="text-muted mb-0">
                    Track progress, completion, and certificate IDs.
                  </p>
                </div>

                <div className="d-flex flex-column flex-md-row gap-2">
                  <div style={{ minWidth: "180px" }}>
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value as StatusFilter);
                        setPage(1);
                      }}
                    >
                      <option value="all">All statuses</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div style={{ minWidth: "120px" }}>
                    <label className="form-label fw-semibold">Show</label>
                    <select
                      className="form-select"
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(event.target.value as PageSize);
                        setPage(1);
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Carer</th>
                      <th>Assessment</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Completed</th>
                      <th>Certificate ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedAssessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td style={{ minWidth: "220px" }}>
                          <div className="fw-semibold">
                            {assessment.carer.name}
                          </div>
                          <small className="text-muted">
                            {assessment.carer.email}
                          </small>
                        </td>

                        <td style={{ minWidth: "220px" }}>
                          {assessment.questionnaire.title}
                        </td>

                        <td>
                          <span
                            className={`badge ${statusBadgeClass(
                              assessment.status
                            )}`}
                          >
                            {assessment.status === "COMPLETED"
                              ? "Completed"
                              : "In Progress"}
                          </span>
                        </td>

                        <td style={{ minWidth: "180px" }}>
                          <div className="progress mb-1" style={{ height: 8 }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${assessment.progress.progressPercent}%`,
                              }}
                            />
                          </div>
                          <small className="text-muted">
                            {assessment.progress.progressPercent}% ·{" "}
                            {assessment.progress.completedQuestions} of{" "}
                            {assessment.progress.totalQuestions}
                          </small>
                        </td>

                        <td>{formatDate(assessment.completedAt)}</td>

                        <td style={{ maxWidth: "240px" }}>
                          {assessment.certificateId ? (
                            <code style={{ whiteSpace: "normal" }}>
                              {assessment.certificateId}
                            </code>
                          ) : (
                            <span className="text-muted">Not available</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {paginatedAssessments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-muted">
                          No assessments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredAssessments.length > 0 && pageSize !== "all" && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    Page {page} of {totalPages}
                  </small>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={page <= 1}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={page >= totalPages}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}