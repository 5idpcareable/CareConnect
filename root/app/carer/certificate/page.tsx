"use client";

import Link from "next/link";
import QRCode from "qrcode";
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

function getOverallOutcome(score: number) {
  if (score >= 4) {
    return "Strength Area";
  }

  if (score >= 3) {
    return "Growth Area";
  }

  return "Support Area";
}

export default function CarerCertificatePage() {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
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

  const overallScore = useMemo(() => {
    if (!certificate || certificate.domainScores.length === 0) {
      return 0;
    }

    const totalScore = certificate.domainScores.reduce(
      (total, domain) => total + domain.score,
      0
    );

    return Number((totalScore / certificate.domainScores.length).toFixed(1));
  }, [certificate]);

  const overallOutcome = getOverallOutcome(overallScore);

  const capabilityText = useMemo(() => {
    if (!certificate || certificate.topCapabilityAreas.length === 0) {
      return "Caregiving capability assessment completed";
    }

    return certificate.topCapabilityAreas
      .slice(0, 3)
      .map((domain) => domain.title)
      .join(" | ");
  }, [certificate]);

  useEffect(() => {
    async function generateQrCode() {
      if (!certificate) {
        return;
      }

      const verificationUrl = `${window.location.origin}/verify/${encodeURIComponent(
        certificate.id
      )}`;

      try {
        const qrImage = await QRCode.toDataURL(verificationUrl, {
          width: 340,
          margin: 1,
          errorCorrectionLevel: "H",
          color: {
            dark: "#0d47a1",
            light: "#ffffff",
          },
        });

        setQrCode(qrImage);
      } catch {
        setError("Certificate loaded, but the QR code could not be generated.");
      }
    }

    generateQrCode();
  }, [certificate]);

  function handlePrint() {
    setPrinting(true);
    window.print();
    setPrinting(false);
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

  if (!certificate || error) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-danger">
              {error || "Certificate is not available."}
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
        .certificate-screen {
          background: #f4f7fc;
          min-height: 100vh;
        }

        .certificate-toolbar {
          max-width: 800px;
          margin: 0 auto 24px;
        }

        .formal-certificate {
          position: relative;
          width: min(100%, 794px);
          aspect-ratio: 210 / 297;
          margin: 0 auto;
          background: #ffffff;
          box-shadow: 0 14px 40px rgba(15, 46, 93, 0.12);
          padding: 12px;
        }

        .certificate-frame-outer {
          height: 100%;
          border: 4px solid #0d6efd;
          padding: 5px;
        }

        .certificate-frame-inner {
          position: relative;
          height: 100%;
          border: 1px solid #90bdff;
          padding: clamp(34px, 5vw, 52px);
          display: flex;
          flex-direction: column;
          text-align: center;
          color: #172b4d;
        }

        .certificate-seal {
          width: 86px;
          height: 86px;
          border: 2px solid #0d6efd;
          border-radius: 50%;
          margin: 0 auto 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #0d6efd;
          background: #f3f8ff;
        }

        .seal-mark {
          font-size: 1.45rem;
          font-weight: 800;
          line-height: 1;
        }

        .seal-name {
          font-size: 0.56rem;
          font-weight: 800;
          margin-top: 5px;
        }

        .certificate-brand {
          color: #0d6efd;
          font-size: 0.78rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.16em;
          margin-bottom: 28px;
        }

        .certificate-title {
          color: #172b4d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.15rem, 5vw, 3rem);
          line-height: 1.15;
          margin-bottom: 22px;
        }

        .certificate-intro {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 16px;
        }

        .recipient-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.15rem, 5vw, 2.8rem);
          color: #0d6efd;
          font-weight: 700;
          margin-bottom: 17px;
        }

        .certificate-for {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 13px;
        }

        .assessment-name {
          font-family: Georgia, "Times New Roman", serif;
          color: #172b4d;
          font-size: clamp(1.42rem, 3.5vw, 1.8rem);
          line-height: 1.32;
          font-weight: 700;
          margin: 0 auto 19px;
          max-width: 580px;
        }

        .credential-statement {
          color: #64748b;
          max-width: 570px;
          margin: 0 auto;
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .outcome-badge {
          display: inline-flex;
          margin: 24px auto 0;
          padding: 0.52rem 1.2rem;
          border: 1px solid #b9d6ff;
          color: #0d47a1;
          background: #eef5ff;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .certificate-bottom {
          margin-top: auto;
          display: grid;
          grid-template-columns: 1fr 150px 1fr;
          align-items: end;
          gap: 20px;
          padding-top: 28px;
        }

        .signature-block {
          text-align: left;
        }

        .signature-line {
          width: 165px;
          border-top: 1px solid #172b4d;
          margin-bottom: 9px;
        }

        .signature-label {
          color: #64748b;
          font-size: 0.72rem;
          line-height: 1.45;
        }

        .certificate-meta {
          text-align: center;
          color: #64748b;
          font-size: 0.7rem;
        }

        .certificate-meta strong {
          display: block;
          color: #172b4d;
          font-size: 0.8rem;
          margin-top: 3px;
        }

        .qr-verification {
          text-align: right;
        }

        .qr-box {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #90bdff;
        }

        .qr-image {
          width: 106px;
          height: 106px;
          display: block;
        }

        .qr-label {
          margin-top: 6px;
          color: #0d47a1;
          font-size: 0.58rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .certificate-id {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 17px;
          color: #64748b;
          font-size: 0.67rem;
          overflow-wrap: anywhere;
        }

        @media (max-width: 767px) {
          .formal-certificate {
            aspect-ratio: auto;
            min-height: 920px;
          }

          .certificate-frame-inner {
            padding: 28px 18px 46px;
          }

          .certificate-bottom {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .signature-block,
          .qr-verification {
            text-align: center;
          }

          .signature-line {
            margin-left: auto;
            margin-right: auto;
          }

          .certificate-meta {
            order: 3;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          body * {
            visibility: hidden !important;
          }

          #certificate-print-area,
          #certificate-print-area * {
            visibility: visible !important;
          }

          nav,
          footer,
          .no-print {
            display: none !important;
          }

          html,
          body,
          main {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          #certificate-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            aspect-ratio: auto !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .certificate-frame-inner {
            padding: 15mm 14mm 14mm !important;
          }
        }
      `}</style>

      <main className="certificate-screen py-4 py-lg-5">
        <div className="container">
          <div className="certificate-toolbar d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 no-print">
            <div>
              <h1 className="fw-bold text-primary mb-1">Certificate</h1>
              <p className="text-muted mb-0">
                Your formal CareAble certificate of recognition.
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link href="/carer/dashboard" className="btn btn-outline-primary">
                Back
              </Link>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
                disabled={printing}
              >
                {printing ? "Preparing..." : "Download / Print PDF"}
              </button>
            </div>
          </div>

          <section id="certificate-print-area" className="formal-certificate">
            <div className="certificate-frame-outer">
              <div className="certificate-frame-inner">
                <div className="certificate-seal">
                  <div className="seal-mark">CA</div>
                  <div className="seal-name">CAREABLE</div>
                </div>

                <div className="certificate-brand">CareAble Australia</div>

                <h1 className="certificate-title">
                  Certificate of
                  <br />
                  Skill Recognition
                </h1>

                <p className="certificate-intro">
                  This certificate is proudly presented to
                </p>

                <div className="recipient-name">{certificate.carerName}</div>

                <p className="certificate-for">
                  in recognition of successful completion of
                </p>

                <div className="assessment-name">
                  {certificate.assessmentTitle}
                </div>

                <p className="credential-statement">
                  Recognising demonstrated caregiving capability through a
                  structured assessment of practical skills, knowledge and
                  lived caring experience.
                </p>

                <div className="outcome-badge">
                  {overallOutcome} - {overallScore.toFixed(1)} / 5
                </div>

                <p className="credential-statement mt-3">
                  {capabilityText}
                </p>

                <div className="certificate-bottom">
                  <div className="signature-block">
                    <div className="signature-line" />
                    <div className="signature-label">
                      Authorised by CareAble
                      <br />
                      Certificate Issuer
                    </div>
                  </div>

                  <div className="certificate-meta">
                    Completed
                    <strong>{formatDate(certificate.completionDate)}</strong>

                    <div className="mt-3">
                      Domains Assessed
                      <strong>{certificate.domainsCompleted}</strong>
                    </div>
                  </div>

                  <div className="qr-verification">
                    <div className="qr-box">
                      {qrCode && (
                        <img
                          src={qrCode}
                          alt="Certificate verification QR code"
                          className="qr-image"
                        />
                      )}

                      <span className="qr-label">Scan to Verify</span>
                    </div>
                  </div>
                </div>

                <div className="certificate-id">
                  Certificate ID: {certificate.id}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}