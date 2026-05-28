"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnalyticsTabs from "../../components/analytics/AnalyticsTabs";
import type { DomainAnalytics } from "../../components/analytics/CapabilityFieldMap";

type AnalyticsSummary = {
  totalCarers: number;
  completedAssessments: number;
  carersWithCompletedAssessments: number;
  overallAverageScore: number;
  topDomain: DomainAnalytics | null;
  supportDomain: DomainAnalytics | null;
  strengthPercent: number;
  growthPercent: number;
  supportPercent: number;
};

type AnalyticsData = {
  summary: AnalyticsSummary;
  domainAnalytics: DomainAnalytics[];
};

type PageSize = "5" | "10" | "15" | "all";

function outcomeClass(score: number) {
  if (score >= 4) {
    return "outcome-strength";
  }

  if (score >= 3) {
    return "outcome-growth";
  }

  return "outcome-support";
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [capabilityFilter, setCapabilityFilter] = useState("all");
  const [pageSize, setPageSize] = useState<PageSize>("5");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Could not load analytics.");
          return;
        }

        setAnalytics(data);
      } catch {
        setError("Something went wrong loading analytics.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const filteredDomains = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return analytics.domainAnalytics.filter((domain) => {
      if (capabilityFilter === "strength") {
        return domain.averageScore >= 4;
      }

      if (capabilityFilter === "growth") {
        return domain.averageScore >= 3 && domain.averageScore < 4;
      }

      if (capabilityFilter === "support") {
        return domain.averageScore < 3;
      }

      return true;
    });
  }, [analytics, capabilityFilter]);

  const pageSizeNumber =
    pageSize === "all" ? Math.max(filteredDomains.length, 1) : Number(pageSize);

  const totalPages =
    pageSize === "all"
      ? 1
      : Math.max(1, Math.ceil(filteredDomains.length / pageSizeNumber));

  const visibleDomains =
    pageSize === "all"
      ? filteredDomains
      : filteredDomains.slice(
          (page - 1) * pageSizeNumber,
          page * pageSizeNumber
        );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading analytics...</div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !analytics) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-danger">
              {error || "Analytics are not available."}
            </div>

            <Link href="/admin/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const { summary, domainAnalytics } = analytics;

  return (
    <>
      <Navbar />

      <style jsx>{`
        .analytics-page {
          min-height: 100vh;
          background: #f5f7fb;
        }

        .analytics-container {
          max-width: 1240px;
        }

        .page-header {
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          background: #ffffff;
          padding: 27px 30px;
        }

        .section-label {
          color: #62758a;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .metric-card {
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          background: #ffffff;
          padding: 19px 20px;
          height: 100%;
        }

        .metric-value {
          color: #102a43;
          font-size: 1.9rem;
          font-weight: 700;
          line-height: 1.18;
        }

        .metric-primary {
          color: #0d6efd;
        }

        .metric-chip {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.27rem 0.65rem;
          font-size: 0.71rem;
          font-weight: 700;
        }

        .outcome-strength {
          color: #087443;
          background: #ddf3e7;
        }

        .outcome-growth {
          color: #1556b8;
          background: #e2edff;
        }

        .outcome-support {
          color: #956100;
          background: #fff0c9;
        }

        .report-card {
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          background: #ffffff;
          padding: 26px;
        }

        .report-card th {
          color: #62758a;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .report-card td,
        .report-card th {
          padding: 0.8rem 0.65rem;
          vertical-align: middle;
        }

        @media (max-width: 767px) {
          .page-header,
          .report-card {
            padding: 20px;
          }
        }
      `}</style>

      <main className="analytics-page py-4 py-lg-5">
        <div className="container analytics-container">
          <header className="page-header mb-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
              <div>
                <div className="section-label mb-2">Reporting and Insights</div>

                <h1 className="fw-bold text-primary mb-2">
                  Capability Analytics
                </h1>

                <p className="text-muted mb-0">
                  Explore completed carer assessment outcomes across capability
                  domains and skill recognition levels.
                </p>
              </div>

              <Link href="/admin/dashboard" className="btn btn-outline-primary">
                Back to Dashboard
              </Link>
            </div>
          </header>

          <section className="row g-3 mb-4">
            <div className="col-6 col-xl-3">
              <div className="metric-card">
                <div className="section-label mb-2">Registered Carers</div>
                <div className="metric-value metric-primary">
                  {summary.totalCarers}
                </div>
                <small className="text-muted">Total carer accounts</small>
              </div>
            </div>

            <div className="col-6 col-xl-3">
              <div className="metric-card">
                <div className="section-label mb-2">
                  Completed Assessments
                </div>
                <div className="metric-value">
                  {summary.completedAssessments}
                </div>
                <small className="text-muted">
                  {summary.carersWithCompletedAssessments} individual carers
                </small>
              </div>
            </div>

            <div className="col-6 col-xl-3">
              <div className="metric-card">
                <div className="section-label mb-2">Average Capability</div>
                <div className="metric-value metric-primary">
                  {summary.overallAverageScore.toFixed(1)} / 5
                </div>
                <small className="text-muted">Mean domain outcome</small>
              </div>
            </div>

            <div className="col-6 col-xl-3">
              <div className="metric-card">
                <div className="section-label mb-2">Capability Mix</div>

                <div className="d-flex flex-wrap gap-1 mt-3">
                  <span className="metric-chip outcome-strength">
                    {summary.strengthPercent}% Strength
                  </span>

                  <span className="metric-chip outcome-growth">
                    {summary.growthPercent}% Growth
                  </span>

                  <span className="metric-chip outcome-support">
                    {summary.supportPercent}% Support
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-4">
            <AnalyticsTabs domains={domainAnalytics} />
          </div>

          <section className="report-card">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
              <div>
                <div className="section-label mb-2">Detailed Report</div>

                <h2 className="h4 fw-bold mb-1">Domain Outcomes</h2>

                <p className="text-muted mb-0">
                  Percentage of completed carer results recorded in each
                  capability level.
                </p>
              </div>

              <div className="d-flex flex-column flex-md-row gap-2">
                <div style={{ minWidth: "225px" }}>
                  <label className="form-label fw-semibold">
                    Outcome View
                  </label>

                  <select
                    className="form-select"
                    value={capabilityFilter}
                    onChange={(event) => {
                      setCapabilityFilter(event.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">All domains</option>
                    <option value="strength">Strength domains</option>
                    <option value="growth">Growth domains</option>
                    <option value="support">Support domains</option>
                  </select>
                </div>

                <div style={{ minWidth: "110px" }}>
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
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Average Score</th>
                    <th>Completed Carers</th>
                    <th>Strength</th>
                    <th>Growth</th>
                    <th>Support</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleDomains.map((domain) => (
                    <tr key={domain.domainId}>
                      <td className="fw-semibold">{domain.domainTitle}</td>

                      <td>
                        <strong>{domain.averageScore.toFixed(1)}</strong> / 5
                      </td>

                      <td>{domain.completedCarers}</td>

                      <td>
                        <span className="metric-chip outcome-strength">
                          {domain.strengthPercent}%
                        </span>
                      </td>

                      <td>
                        <span className="metric-chip outcome-growth">
                          {domain.growthPercent}%
                        </span>
                      </td>

                      <td>
                        <span className="metric-chip outcome-support">
                          {domain.supportPercent}%
                        </span>
                      </td>
                    </tr>
                  ))}

                  {visibleDomains.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-muted">
                        No analytics are available for this selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredDomains.length > 0 && pageSize !== "all" && (
              <div className="d-flex justify-content-between align-items-center mt-4">
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
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}