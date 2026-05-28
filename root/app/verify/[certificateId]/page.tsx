"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  assessmentTitle: string;
  completionDate: string;
  domainsCompleted: number;
  overallScore: number;
  overallOutcome: string;
  domainScores: DomainScore[];
  status: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function outcomeClass(level: string) {
  if (level === "Strength area") {
    return "result-strength";
  }

  if (level === "Growth area") {
    return "result-growth";
  }

  return "result-support";
}

export default function PublicCertificateVerificationPage() {
  const params = useParams<{ certificateId: string }>();
  const certificateId = params.certificateId;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateCertificate() {
      try {
        const response = await fetch("/api/carer/certificate/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            certificateId,
          }),
        });

        const data = await response.json();

        if (response.status === 401 && data.requiresLogin) {
          setRequiresLogin(true);
          return;
        }

        if (!response.ok || !data.valid) {
          setError(data.message || "This certificate could not be verified.");
          return;
        }

        setCertificate(data.certificate);
      } catch {
        setError("Something went wrong validating this certificate.");
      } finally {
        setLoading(false);
      }
    }

    if (certificateId) {
      validateCertificate();
    }
  }, [certificateId]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="verify-page py-5">
          <div className="container verify-container">
            <div className="verify-state-card text-center">
              <div className="spinner-border text-primary mb-3" role="status" />
              <p className="text-muted mb-0">
                Checking certificate access...
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (requiresLogin) {
    return (
      <>
        <Navbar />

        <style jsx global>{`
          .verify-page {
            min-height: 76vh;
            background: #f5f8fc;
          }

          .verify-container {
            max-width: 720px;
          }

          .verify-access-card {
            background: #ffffff;
            border: 1px solid #dbe7f8;
            border-top: 5px solid #0d6efd;
            border-radius: 10px;
            box-shadow: 0 12px 34px rgba(16, 42, 67, 0.07);
            padding: 44px 38px;
          }

          .lock-mark {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #eaf2ff;
            color: #0d6efd;
            font-size: 1.2rem;
            font-weight: 800;
          }
        `}</style>

        <main className="verify-page py-5">
          <div className="container verify-container">
            <div className="verify-access-card text-center">
              <div className="lock-mark">ID</div>

              <h1 className="h2 fw-bold mb-3">
                Login Required
              </h1>

              <p className="text-muted mb-4">
                Certificate outcome details are protected. Please log in as the
                certificate owner, an approved employer, or an administrator to
                view this verification report.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <Link
                  href={`/login?returnUrl=${encodeURIComponent(
                    `/verify/${certificateId}`
                  )}`}
                  className="btn btn-primary px-4"
                >
                  Login to View Certificate
                </Link>

                <Link href="/" className="btn btn-outline-primary px-4">
                  Return Home
                </Link>
              </div>
            </div>
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

        <style jsx global>{`
          .verify-page {
            min-height: 76vh;
            background: #f5f8fc;
          }

          .verify-container {
            max-width: 720px;
          }

          .verify-state-card {
            background: #ffffff;
            border: 1px solid #dbe7f8;
            border-radius: 10px;
            box-shadow: 0 12px 34px rgba(16, 42, 67, 0.07);
            padding: 44px 38px;
          }

          .invalid-mark {
            width: 58px;
            height: 58px;
            margin: 0 auto 18px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #b42318;
            background: #fee4e2;
            font-size: 1.35rem;
            font-weight: 700;
          }
        `}</style>

        <main className="verify-page py-5">
          <div className="container verify-container">
            <div className="verify-state-card text-center">
              <div className="invalid-mark">!</div>

              <h1 className="h3 fw-bold mb-2">
                Certificate Details Unavailable
              </h1>

              <p className="text-muted mb-4">
                {error || "No valid completed certificate was found."}
              </p>

              <Link href="/" className="btn btn-outline-primary">
                Return to CareAble
              </Link>
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

      <style jsx global>{`
        .verify-page {
          min-height: 76vh;
          background: #f5f8fc;
        }

        .verify-container {
          max-width: 1080px;
        }

        .verification-card {
          border: 1px solid #dbe7f8;
          border-radius: 10px;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 12px 34px rgba(16, 42, 67, 0.07);
        }

        .verification-header {
          border-top: 6px solid #0d6efd;
          padding: 30px 32px 26px;
        }

        .verified-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ddf3e7;
          color: #087443;
          font-size: 1.6rem;
          font-weight: 700;
        }

        .verify-label {
          color: #0d6efd;
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          background: #ddf3e7;
          color: #087443;
          border-radius: 999px;
          padding: 0.42rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .detail-panel {
          background: #f7faff;
          border: 1px solid #dce8f9;
          border-radius: 8px;
          padding: 15px 17px;
          height: 100%;
        }

        .detail-label {
          color: #66788a;
          font-size: 0.75rem;
          display: block;
          margin-bottom: 5px;
        }

        .detail-value {
          color: #102a43;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .score-panel {
          border: 1px solid #e1e9f5;
          border-radius: 8px;
          overflow: hidden;
        }

        .score-panel-header {
          background: #f7faff;
          border-bottom: 1px solid #e1e9f5;
          padding: 17px 20px;
        }

        .score-table {
          margin-bottom: 0;
        }

        .score-table th {
          color: #66788a;
          font-size: 0.73rem;
          text-transform: uppercase;
          padding: 13px 17px;
        }

        .score-table td {
          padding: 12px 17px;
          vertical-align: middle;
        }

        .result-badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.3rem 0.7rem;
          font-size: 0.74rem;
          font-weight: 700;
        }

        .result-strength {
          color: #087443;
          background: #ddf3e7;
        }

        .result-growth {
          color: #1556b8;
          background: #e2edff;
        }

        .result-support {
          color: #956100;
          background: #fff0c9;
        }

        .verification-footer {
          color: #66788a;
          background: #f7faff;
          border-top: 1px solid #e1e9f5;
          font-size: 0.82rem;
          padding: 17px 32px;
        }
      `}</style>

      <main className="verify-page py-4 py-lg-5">
        <div className="container verify-container">
          <div className="verification-card">
            <section className="verification-header">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-4 mb-4">
                <div className="d-flex gap-3 align-items-start">
                  <div className="verified-icon">OK</div>

                  <div>
                    <div className="verify-label mb-2">
                      CareAble Certificate Verification
                    </div>

                    <h1 className="h2 fw-bold mb-2">
                      Certificate Verified
                    </h1>

                    <p className="text-muted mb-0">
                      This credential matches a completed CareAble assessment.
                    </p>
                  </div>
                </div>

                <div className="text-md-end">
                  <span className="status-pill">Verified</span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="detail-panel">
                    <span className="detail-label">Certificate Holder</span>
                    <div className="detail-value">{certificate.carerName}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-panel">
                    <span className="detail-label">Assessment Completed</span>
                    <div className="detail-value">
                      {certificate.assessmentTitle}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="detail-panel">
                    <span className="detail-label">Completion Date</span>
                    <div className="detail-value">
                      {formatDate(certificate.completionDate)}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="detail-panel">
                    <span className="detail-label">Domains Completed</span>
                    <div className="detail-value">
                      {certificate.domainsCompleted}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="detail-panel">
                    <span className="detail-label">Overall Score</span>
                    <div className="detail-value">
                      {certificate.overallScore.toFixed(1)} / 5
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="detail-panel">
                    <span className="detail-label">Outcome</span>
                    <span
                      className={`result-badge ${outcomeClass(
                        certificate.overallOutcome
                      )}`}
                    >
                      {certificate.overallOutcome}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-3 p-lg-4">
              <div className="score-panel">
                <div className="score-panel-header">
                  <h2 className="h5 fw-bold mb-1">
                    Domain Outcome Details
                  </h2>

                  <p className="text-muted small mb-0">
                    Scores generated from the completed CareAble assessment.
                  </p>
                </div>

                <div className="table-responsive">
                  <table className="table score-table align-middle">
                    <thead>
                      <tr>
                        <th>Skill Domain</th>
                        <th>Score</th>
                        <th>Outcome</th>
                        <th>Interpretation</th>
                      </tr>
                    </thead>

                    <tbody>
                      {certificate.domainScores.map((domain) => (
                        <tr key={domain.domainId}>
                          <td className="fw-semibold">{domain.title}</td>

                          <td className="fw-semibold">
                            {domain.score.toFixed(1)} / 5
                          </td>

                          <td>
                            <span
                              className={`result-badge ${outcomeClass(
                                domain.capabilityLevel
                              )}`}
                            >
                              {domain.capabilityLevel}
                            </span>
                          </td>

                          <td className="text-muted">
                            {domain.capabilityDescription}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <footer className="verification-footer d-flex flex-column flex-md-row justify-content-between gap-2">
              <span>
                Certificate ID: <strong>{certificate.id}</strong>
              </span>

              <span>Verified against CareAble records</span>
            </footer>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="btn btn-outline-primary">
              Return to CareAble
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}