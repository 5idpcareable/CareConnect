"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type DomainScore = {
  domainId: string;
  title: string;
  score: number;
  capabilityLevel: string;
  capabilityDescription: string;
};

type Certificate = {
  id: string;
  carerName: string;
  carerEmail: string;
  assessmentTitle: string;
  completionDate: string;
  domainsCompleted: number;
  domainScores: DomainScore[];
  topCapabilityAreas: DomainScore[];
  status: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function capabilityBadgeClass(level: string) {
  if (level === "Strength area") {
    return "bg-success";
  }

  if (level === "Growth area") {
    return "bg-primary";
  }

  return "bg-warning text-dark";
}

export default function CarerCertificatePage() {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCertificate() {
      try {
        const response = await fetch("/api/carer/certificate", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Could not load certificate.");
          return;
        }

        setCertificate(data.certificate);
      } catch {
        setError("Something went wrong loading your certificate.");
      } finally {
        setLoading(false);
      }
    }

    loadCertificate();
  }, []);

  const topCapabilityText = useMemo(() => {
    if (!certificate || certificate.topCapabilityAreas.length === 0) {
      return "No strength areas above 4.0 were identified in this assessment.";
    }

    return certificate.topCapabilityAreas
      .map((domain) => domain.title)
      .join(", ");
  }, [certificate]);

  function handlePrint() {
    window.print();
  }

  async function handleDownload() {
    setDownloading(true);

    try {
      window.print();
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading certificate...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !certificate) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-danger">
              {error || "Certificate not available."}
            </div>

            <Link href="/carer/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <style jsx>{`
        .certificate-shell {
          max-width: 1100px;
          margin: 0 auto;
        }

        .certificate-card {
          background: #ffffff;
          border: 2px solid #0d6efd;
          border-radius: 12px;
          padding: 40px;
        }

        .certificate-inner {
          border: 1px solid #9ec5fe;
          border-radius: 10px;
          padding: 36px;
        }

        .certificate-label {
          letter-spacing: 0.16em;
          color: #0d6efd;
          font-weight: 700;
          text-transform: uppercase;
        }

        .certificate-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .certificate-meta {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .score-card {
          border: 1px solid #dee2e6;
          border-radius: 10px;
          padding: 16px;
          background: #ffffff;
        }

        @media print {
          nav,
          footer,
          .no-print {
            display: none !important;
          }

          body {
            background: #ffffff !important;
          }

          main {
            padding: 0 !important;
            background: #ffffff !important;
          }

          .certificate-shell {
            max-width: 100%;
          }

          .certificate-card {
            border: 2px solid #0d6efd;
            box-shadow: none !important;
            page-break-inside: avoid;
          }

          .certificate-inner {
            padding: 28px;
          }
        }

        @media (max-width: 768px) {
          .certificate-card {
            padding: 20px;
          }

          .certificate-inner {
            padding: 22px;
          }

          .certificate-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="bg-light py-5">
        <div className="container certificate-shell">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 no-print">
            <div>
              <h1 className="fw-bold text-primary mb-1">Certificate</h1>
              <p className="text-muted mb-0">
                Skill recognition certificate generated from your completed
                assessment.
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link href="/carer/dashboard" className="btn btn-outline-primary">
                Back to Dashboard
              </Link>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handlePrint}
              >
                Print
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? "Preparing..." : "Download"}
              </button>
            </div>
          </div>

          <section className="certificate-card shadow-sm">
            <div className="certificate-inner">
              <div className="text-center mb-4">
                <div className="certificate-label mb-3">
                  Certificate of Skill Recognition
                </div>

                <h2 className="fw-bold mb-4">CareAble</h2>

                <p className="text-muted mb-2">
                  This certificate is awarded to
                </p>

                <h1 className="fw-bold text-primary mb-3">
                  {certificate.carerName}
                </h1>

                <p className="text-muted mb-1">for completing the</p>

                <h3 className="fw-bold mb-4">
                  {certificate.assessmentTitle}
                </h3>

                <p className="text-muted mx-auto" style={{ maxWidth: "760px" }}>
                  This recognises caregiving skills demonstrated through the
                  CareAble self-assessment process, including practical
                  capabilities built through informal care, communication,
                  planning, coordination, and support activities.
                </p>
              </div>

              <div className="certificate-grid my-4">
                <div className="certificate-meta">
                  <small className="text-muted d-block">Certificate ID</small>
                  <strong>{certificate.id}</strong>
                </div>

                <div className="certificate-meta">
                  <small className="text-muted d-block">Carer Email</small>
                  <strong>{certificate.carerEmail}</strong>
                </div>

                <div className="certificate-meta">
                  <small className="text-muted d-block">Completion Date</small>
                  <strong>{formatDate(certificate.completionDate)}</strong>
                </div>

                <div className="certificate-meta">
                  <small className="text-muted d-block">Status</small>
                  <strong className="text-success">{certificate.status}</strong>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-lg-5">
                  <div className="score-card h-100">
                    <h5 className="fw-bold mb-2">Domains Completed</h5>
                    <div className="display-6 fw-bold text-primary">
                      {certificate.domainsCompleted}
                    </div>
                    <p className="text-muted mb-0">
                      Skill domains completed in this assessment.
                    </p>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="score-card h-100">
                    <h5 className="fw-bold mb-2">Top Capability Areas</h5>
                    <p className="text-muted mb-0">{topCapabilityText}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold mb-3">Domain Score Summary</h5>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Score</th>
                        <th>Capability Level</th>
                        <th>Description</th>
                      </tr>
                    </thead>

                    <tbody>
                      {certificate.domainScores.map((domain) => (
                        <tr key={domain.domainId}>
                          <td className="fw-semibold">{domain.title}</td>
                          <td>{domain.score.toFixed(1)}</td>
                          <td>
                            <span
                              className={`badge ${capabilityBadgeClass(
                                domain.capabilityLevel
                              )}`}
                            >
                              {domain.capabilityLevel}
                            </span>
                          </td>
                          <td>{domain.capabilityDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-center text-muted mb-0">
                Verified by CareAble
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}