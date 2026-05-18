"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type DomainAnalytics = {
  domainId: string;
  domainTitle: string;
  averageScore: number;
  completedCarers: number;
  strengthCount: number;
  growthCount: number;
  supportCount: number;
  strengthPercent: number;
  growthPercent: number;
  supportPercent: number;
};

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

function scoreColor(score: number) {
  if (score >= 4) {
    return "#198754";
  }

  if (score >= 3) {
    return "#0d6efd";
  }

  return "#ffc107";
}

function capabilityLabel(score: number) {
  if (score >= 4) {
    return "Strength";
  }

  if (score >= 3) {
    return "Growth";
  }

  return "Support";
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [capabilityFilter, setCapabilityFilter] = useState("all");
  const [reportPageSize, setReportPageSize] = useState<PageSize>("5");
  const [reportPage, setReportPage] = useState(1);
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

  const radarPoints = useMemo(() => {
    if (!analytics || analytics.domainAnalytics.length === 0) {
      return "";
    }

    const center = 120;
    const maxRadius = 88;
    const domains = analytics.domainAnalytics.slice(0, 8);

    return domains
      .map((domain, index) => {
        const angle = (Math.PI * 2 * index) / domains.length - Math.PI / 2;
        const radius = (domain.averageScore / 5) * maxRadius;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;

        return `${x},${y}`;
      })
      .join(" ");
  }, [analytics]);

  const filteredDomainAnalytics = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return analytics.domainAnalytics.filter((domain) => {
      if (capabilityFilter === "all") {
        return true;
      }

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

  const reportCount = filteredDomainAnalytics.length;
  const reportPageSizeNumber =
    reportPageSize === "all" ? Math.max(reportCount, 1) : Number(reportPageSize);

  const totalReportPages =
    reportPageSize === "all"
      ? 1
      : Math.max(1, Math.ceil(reportCount / reportPageSizeNumber));

  const paginatedDomainAnalytics =
    reportPageSize === "all"
      ? filteredDomainAnalytics
      : filteredDomainAnalytics.slice(
          (reportPage - 1) * reportPageSizeNumber,
          reportPage * reportPageSizeNumber
        );

  useEffect(() => {
    if (reportPage > totalReportPages) {
      setReportPage(totalReportPages);
    }
  }, [reportPage, totalReportPages]);

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
              {error || "Analytics not available."}
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
        .metric-card {
          border: 0;
          border-radius: 14px;
          box-shadow: 0 10px 26px rgba(33, 37, 41, 0.08);
          height: 100%;
        }

        .metric-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0d6efd;
        }

        .insight-card {
          border: 0;
          border-radius: 14px;
          box-shadow: 0 10px 26px rgba(33, 37, 41, 0.08);
          overflow: hidden;
        }

        .domain-bar {
          height: 12px;
          border-radius: 999px;
          background: #e9ecef;
          overflow: hidden;
        }

        .domain-bar-fill {
          height: 100%;
          border-radius: 999px;
        }

        .radar-panel {
          min-height: 320px;
          display: grid;
          place-items: center;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          display: inline-block;
        }
      `}</style>

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">
                Analytics Dashboard
              </h1>
              <p className="text-muted mb-0">
                View carer capability patterns from completed skill assessments.
              </p>
            </div>

            <Link href="/admin/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card metric-card">
                <div className="card-body p-4">
                  <div className="metric-label">Total Carers</div>
                  <div className="metric-value">{summary.totalCarers}</div>
                  <p className="text-muted mb-0 small">
                    Registered carer accounts.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card metric-card">
                <div className="card-body p-4">
                  <div className="metric-label">Completed Assessments</div>
                  <div className="metric-value">
                    {summary.completedAssessments}
                  </div>
                  <p className="text-muted mb-0 small">
                    Submitted and certificate-ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card metric-card">
                <div className="card-body p-4">
                  <div className="metric-label">Completed Carers</div>
                  <div className="metric-value">
                    {summary.carersWithCompletedAssessments}
                  </div>
                  <p className="text-muted mb-0 small">
                    Unique carers with completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card metric-card">
                <div className="card-body p-4">
                  <div className="metric-label">Average Score</div>
                  <div className="metric-value">
                    {summary.overallAverageScore.toFixed(1)}
                  </div>
                  <p className="text-muted mb-0 small">
                    Mean score across domains.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card insight-card h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between gap-3 mb-4">
                    <div>
                      <h4 className="fw-bold mb-1">Domain Capability Map</h4>
                      <p className="text-muted mb-0">
                        Average domain scores from completed assessments.
                      </p>
                    </div>

                    <div className="d-flex flex-wrap gap-3 small">
                      <span>
                        <span
                          className="legend-dot me-1"
                          style={{ background: "#198754" }}
                        />
                        Strength
                      </span>
                      <span>
                        <span
                          className="legend-dot me-1"
                          style={{ background: "#0d6efd" }}
                        />
                        Growth
                      </span>
                      <span>
                        <span
                          className="legend-dot me-1"
                          style={{ background: "#ffc107" }}
                        />
                        Support
                      </span>
                    </div>
                  </div>

                  <div className="d-grid gap-3">
                    {domainAnalytics.map((domain) => (
                      <div key={domain.domainId}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="fw-semibold">
                            {domain.domainTitle}
                          </div>
                          <div className="small text-muted">
                            {domain.averageScore.toFixed(1)} / 5 ·{" "}
                            {capabilityLabel(domain.averageScore)}
                          </div>
                        </div>

                        <div className="domain-bar">
                          <div
                            className="domain-bar-fill"
                            style={{
                              width: `${(domain.averageScore / 5) * 100}%`,
                              background: scoreColor(domain.averageScore),
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {domainAnalytics.length === 0 && (
                      <div className="text-muted">
                        No completed assessment data available yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card insight-card h-100">
                <div className="card-body p-4 radar-panel">
                  <div className="w-100">
                    <h4 className="fw-bold mb-1">Capability Radar</h4>
                    <p className="text-muted mb-3">
                      Quick view of strongest domains.
                    </p>

                    <svg
                      viewBox="0 0 240 240"
                      width="100%"
                      height="260"
                      role="img"
                      aria-label="Capability radar chart"
                    >
                      {[0.2, 0.4, 0.6, 0.8, 1].map((ring) => (
                        <circle
                          key={ring}
                          cx="120"
                          cy="120"
                          r={88 * ring}
                          fill="none"
                          stroke="#dee2e6"
                        />
                      ))}

                      {domainAnalytics.slice(0, 8).map((domain, index) => {
                        const angle =
                          (Math.PI * 2 * index) /
                            Math.max(domainAnalytics.slice(0, 8).length, 1) -
                          Math.PI / 2;
                        const x = 120 + Math.cos(angle) * 94;
                        const y = 120 + Math.sin(angle) * 94;

                        return (
                          <line
                            key={domain.domainId}
                            x1="120"
                            y1="120"
                            x2={x}
                            y2={y}
                            stroke="#e9ecef"
                          />
                        );
                      })}

                      {radarPoints && (
                        <polygon
                          points={radarPoints}
                          fill="rgba(13, 110, 253, 0.18)"
                          stroke="#0d6efd"
                          strokeWidth="3"
                        />
                      )}
                    </svg>

                    <div className="small text-muted">
                      Showing up to 8 domains by average score.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="card insight-card h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Top Strength</h5>
                  <p className="text-muted mb-2">
                    Highest scoring capability domain.
                  </p>

                  {summary.topDomain ? (
                    <>
                      <div className="h4 text-success fw-bold mb-1">
                        {summary.topDomain.domainTitle}
                      </div>
                      <p className="mb-0">
                        Average score{" "}
                        <strong>
                          {summary.topDomain.averageScore.toFixed(1)}
                        </strong>
                      </p>
                    </>
                  ) : (
                    <p className="text-muted mb-0">No data yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card insight-card h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Support Priority</h5>
                  <p className="text-muted mb-2">
                    Domain with the largest support-area share.
                  </p>

                  {summary.supportDomain ? (
                    <>
                      <div className="h4 text-warning fw-bold mb-1">
                        {summary.supportDomain.domainTitle}
                      </div>
                      <p className="mb-0">
                        <strong>{summary.supportDomain.supportPercent}%</strong>{" "}
                        in support area.
                      </p>
                    </>
                  ) : (
                    <p className="text-muted mb-0">No data yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card insight-card h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Overall Capability Mix</h5>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Strength</span>
                      <strong>{summary.strengthPercent}%</strong>
                    </div>
                    <div className="progress mb-2" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${summary.strengthPercent}%` }}
                      />
                    </div>

                    <div className="d-flex justify-content-between small mb-1">
                      <span>Growth</span>
                      <strong>{summary.growthPercent}%</strong>
                    </div>
                    <div className="progress mb-2" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${summary.growthPercent}%` }}
                      />
                    </div>

                    <div className="d-flex justify-content-between small mb-1">
                      <span>Support</span>
                      <strong>{summary.supportPercent}%</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${summary.supportPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card insight-card">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Domain Detail Report</h4>
                  <p className="text-muted mb-0">
                    Percentage of completed carers in each capability level.
                  </p>
                </div>

                <div className="d-flex flex-column flex-md-row gap-2">
                  <div style={{ minWidth: "240px" }}>
                    <label className="form-label fw-semibold">
                      Filter by Capability
                    </label>
                    <select
                      className="form-select"
                      value={capabilityFilter}
                      onChange={(event) => {
                        setCapabilityFilter(event.target.value);
                        setReportPage(1);
                      }}
                    >
                      <option value="all">All domains</option>
                      <option value="strength">Strength area only</option>
                      <option value="growth">Growth area only</option>
                      <option value="support">Support area only</option>
                    </select>
                  </div>

                  <div style={{ minWidth: "120px" }}>
                    <label className="form-label fw-semibold">Show</label>
                    <select
                      className="form-select"
                      value={reportPageSize}
                      onChange={(event) => {
                        setReportPageSize(event.target.value as PageSize);
                        setReportPage(1);
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
                      <th>Domain</th>
                      <th>Average</th>
                      <th>Completed Carers</th>
                      <th>Strength</th>
                      <th>Growth</th>
                      <th>Support</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedDomainAnalytics.map((domain) => (
                      <tr key={domain.domainId}>
                        <td className="fw-semibold">{domain.domainTitle}</td>
                        <td>{domain.averageScore.toFixed(1)}</td>
                        <td>{domain.completedCarers}</td>
                        <td>
                          <span className="badge bg-success">
                            {domain.strengthPercent}%
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {domain.growthPercent}%
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {domain.supportPercent}%
                          </span>
                        </td>
                      </tr>
                    ))}

                    {paginatedDomainAnalytics.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-muted">
                          No analytics available for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredDomainAnalytics.length > 0 &&
                reportPageSize !== "all" && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      Page {reportPage} of {totalReportPages}
                    </small>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={reportPage <= 1}
                        onClick={() =>
                          setReportPage((currentPage) => currentPage - 1)
                        }
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={reportPage >= totalReportPages}
                        onClick={() =>
                          setReportPage((currentPage) => currentPage + 1)
                        }
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