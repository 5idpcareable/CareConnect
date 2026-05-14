"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type Certificate = {
  certificateId: string;
  carerName: string;
  email: string;
  assessmentTitle: string;
  completedAt: string;
  completedDate: string;
  status: string;
};

export default function CarerCertificatePage() {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
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
          setError(data.message || "Certificate is not available yet.");
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

  function handleDownloadPdf() {
    window.print();
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

  return (
    <>
      <Navbar />

      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 297mm;
            height: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
          }

          nav,
          footer,
          .no-print {
            display: none !important;
          }

          .print-page {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
          }

          .print-page .container {
            width: 297mm !important;
            max-width: 297mm !important;
            height: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .certificate-shell {
            width: 297mm !important;
            max-width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .certificate-paper {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <style jsx>{`
        .certificate-shell {
          max-width: 1120px;
          margin: 0 auto;
        }

        .certificate-paper {
          background: #ffffff;
          border: 2px solid #0d6efd;
          box-shadow: 0 20px 50px rgba(13, 110, 253, 0.12);
          overflow: hidden;
        }

        .certificate-inner {
          min-height: 680px;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr auto;
        }

        .certificate-header {
          background: #0d6efd;
          color: #ffffff;
          padding: 24px 42px;
        }

        .certificate-title {
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .certificate-body {
          padding: 54px 76px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .recipient-name {
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          line-height: 1.1;
        }

        .certificate-rule {
          width: 150px;
          height: 3px;
          background: #0d6efd;
          margin: 22px auto;
          border-radius: 999px;
        }

        .recognition-copy {
          max-width: 780px;
          margin: 0 auto;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .verification-strip {
          background: #f6f9ff;
          border-top: 1px solid #dbe8ff;
          padding: 22px 42px;
        }

        .certificate-meta-value {
          overflow-wrap: anywhere;
          word-break: break-word;
          line-height: 1.35;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: #e9f8ef;
          color: #087f3f;
          padding: 6px 12px;
          font-weight: 700;
        }

        @media print {
          .certificate-inner {
            width: 297mm;
            height: 210mm;
            min-height: 210mm;
          }

          .certificate-header {
            padding: 14mm 18mm 10mm;
          }

          .certificate-body {
            padding: 12mm 22mm;
          }

          .verification-strip {
            padding: 9mm 18mm;
          }

          .recipient-name {
            font-size: 34pt;
          }

          .recognition-copy {
            font-size: 11pt;
          }
        }

        @media (max-width: 767px) {
          .certificate-body {
            padding: 36px 24px;
          }

          .certificate-header,
          .verification-strip {
            padding: 22px 24px;
          }
        }
      `}</style>

      <main className="bg-light py-5 print-page">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4 no-print">
            <div>
              <h1 className="fw-bold text-primary mb-1">Certificate</h1>
              <p className="text-muted mb-0">
                View your CareAble skill recognition certificate.
              </p>
            </div>

            <Link href="/carer/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="card border-0 shadow-sm no-print">
              <div className="card-body p-4">
                <div className="alert alert-warning mb-3">{error}</div>

                <Link href="/carer/assessment" className="btn btn-primary">
                  Continue Assessment
                </Link>
              </div>
            </div>
          )}

          {certificate && (
            <div className="certificate-shell print-area">
              <div className="certificate-paper rounded-4">
                <div className="certificate-inner">
                  <div className="certificate-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <p className="certificate-title fw-bold mb-2">
                        Certificate of Skill Recognition
                      </p>
                      <h2 className="fw-bold mb-0">CareAble</h2>
                    </div>

                    <div className="text-md-end">
                      <small className="d-block opacity-75">
                        Verified digital certificate
                      </small>
                      <strong>{certificate.completedDate}</strong>
                    </div>
                  </div>

                  <div className="certificate-body text-center">
                    <p className="text-muted mb-2">
                      This certificate is awarded to
                    </p>

                    <h1 className="recipient-name fw-bold text-primary mb-3">
                      {certificate.carerName}
                    </h1>

                    <div className="certificate-rule" />

                    <p className="fs-5 text-muted mb-3">for completing</p>

                    <h3 className="fw-bold mb-4">
                      {certificate.assessmentTitle}
                    </h3>

                    <p className="recognition-copy text-muted mb-0">
                      This recognises informal caregiving capabilities
                      demonstrated through the CareAble self-assessment process.
                      These capabilities reflect practical care and support
                      skills developed through unpaid caregiving experience.
                    </p>
                  </div>

                  <div className="verification-strip">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-5">
                        <small className="text-muted d-block">
                          Certificate ID
                        </small>
                        <span className="fw-semibold certificate-meta-value d-block">
                          {certificate.certificateId}
                        </span>
                      </div>

                      <div className="col-md-3">
                        <small className="text-muted d-block">
                          Completion Date
                        </small>
                        <span className="fw-semibold">
                          {certificate.completedDate}
                        </span>
                      </div>

                      <div className="col-md-2">
                        <small className="text-muted d-block">Status</small>
                        <span className="status-pill">
                          {certificate.status}
                        </span>
                      </div>

                      <div className="col-md-2 text-md-end">
                        <small className="text-muted d-block">Issued by</small>
                        <span className="fw-bold text-primary">CareAble</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-4 no-print">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  Print Certificate
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleDownloadPdf}
                >
                  Download PDF
                </button>

                <Link
                  href="/carer/dashboard"
                  className="btn btn-outline-primary"
                >
                  Back to Dashboard
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
