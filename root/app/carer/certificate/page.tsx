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

function capabilityClass(level: string) {
  if (level === "Strength area") {
    return "text-success";
  }

  if (level === "Growth area") {
    return "text-primary";
  }

  return "text-warning";
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
      return "No top capability area above 4.0 was identified.";
    }

    return certificate.topCapabilityAreas
      .map((domain) => `${domain.title} (${domain.score.toFixed(1)})`)
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

      <style jsx global>{`
        .certificate-wrap {
          max-width: 1120px;
          margin: 0 auto;
        }

        .certificate-page {
          background: #ffffff;
          border: 2px solid #0d6efd;
          border-radius: 14px;
          padding: 22px;
        }

        .certificate-inner {
          border: 1px solid #9ec5fe;
          border-radius: 10px;
          padding: 28px 34px;
          min-height: 680px;
          display: flex;
          flex-direction: column;
        }

        .certificate-label {
          letter-spacing: 0.18em;
          color: #0d6efd;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.86rem;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1.25fr 1.25fr 1fr 0.75fr;
          gap: 10px;
        }

        .meta-box {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px 12px;
          min-width: 0;
          overflow-wrap: anywhere;
          font-size: 0.9rem;
        }

        .top-box {
          background: #eef5ff;
          border: 1px solid #cfe2ff;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .score-table {
          font-size: 0.82rem;
        }

        .score-table th,
        .score-table td {
          padding: 0.35rem 0.45rem;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          body * {
            visibility: hidden !important;
          }

          #certificate-print-area,
          #certificate-print-area * {
            visibility: visible !important;
          }

          #certificate-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
          }

          nav,
          footer,
          .no-print {
            display: none !important;
          }

          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          main {
            padding: 0 !important;
            background: #ffffff !important;
          }

          .container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .certificate-wrap {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
          }

          .certificate-page {
            box-shadow: none !important;
            page-break-inside: avoid;
            break-inside: avoid;
            border-radius: 0 !important;
            min-height: 190mm;
          }

          .certificate-inner {
            min-height: 176mm;
            padding: 18px 24px;
          }
        }

        @media (max-width: 768px) {
          .certificate-page {
            padding: 14px;
          }

          .certificate-inner {
            padding: 20px;
            min-height: auto;
          }

          .meta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="bg-light py-5">
        <div className="container certificate-wrap">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 no-print">
            <div>
              <h1 className="fw-bold text-primary mb-1">Certificate</h1>
              <p className="text-muted mb-0">
                One-page CareAble skill recognition certificate.
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

          <section
            id="certificate-print-area"
            className="certificate-page shadow-sm"
          >
            <div className="certificate-inner">
              <div className="text-center mb-3">
                <div className="certificate-label mb-2">
                  Certificate of Skill Recognition
                </div>

                <h2 className="fw-bold mb-2">CareAble</h2>

                <p className="text-muted mb-1">This certificate is awarded to</p>

                <h1 className="fw-bold text-primary mb-2">
                  {certificate.carerName}
                </h1>

                <p className="text-muted mb-1">for completing</p>

                <h3 className="fw-bold mb-3">
                  {certificate.assessmentTitle}
                </h3>

                <p className="text-muted mx-auto mb-3" style={{ maxWidth: 850 }}>
                  This recognises caregiving skills demonstrated through the
                  CareAble self-assessment process. Domain scores are calculated
                  as the mean of Likert 1-5 responses and grouped into strength,
                  growth, and support capability areas.
                </p>
              </div>

              <div className="meta-grid mb-3">
                <div className="meta-box">
                  <small className="text-muted d-block">Certificate ID</small>
                  <strong>{certificate.id}</strong>
                </div>

                <div className="meta-box">
                  <small className="text-muted d-block">Carer Email</small>
                  <strong>{certificate.carerEmail}</strong>
                </div>

                <div className="meta-box">
                  <small className="text-muted d-block">Completion Date</small>
                  <strong>{formatDate(certificate.completionDate)}</strong>
                </div>

                <div className="meta-box">
                  <small className="text-muted d-block">Status</small>
                  <strong className="text-success">Verified</strong>
                </div>
              </div>

              <div className="top-box mb-3">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <small className="text-muted d-block">
                      Domains Completed
                    </small>
                    <div className="h3 fw-bold text-primary mb-0">
                      {certificate.domainsCompleted}
                    </div>
                  </div>

                  <div className="col-md-9">
                    <small className="text-muted d-block">
                      Top Capability Areas (score 4.0 and above)
                    </small>
                    <strong>{topCapabilityText}</strong>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h5 className="fw-bold mb-2">Domain Score Summary</h5>

                <div className="table-responsive">
                  <table className="table table-sm align-middle score-table mb-0">
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
                            <strong
                              className={capabilityClass(
                                domain.capabilityLevel
                              )}
                            >
                              {domain.capabilityLevel}
                            </strong>
                          </td>
                          <td>{domain.capabilityDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-auto text-center">
                <p className="text-muted small mb-1">
                  Capability scale: 4.0-5.0 Strength area, 3.0-3.9 Growth area,
                  1.0-2.9 Support area.
                </p>
                <p className="text-muted mb-0">Verified by CareAble</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}