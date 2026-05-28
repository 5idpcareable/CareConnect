"use client";

import QrScanner from "qr-scanner";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

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

function extractCertificateId(qrValue: string) {
  try {
    const url = new URL(qrValue);
    const match = url.pathname.match(/^\/verify\/([^/]+)$/);

    if (!match) {
      return null;
    }

    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export default function EmployerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const [loadingPage, setLoadingPage] = useState(true);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  useEffect(() => {
    async function loadEmployer() {
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
        const currentUser: User | null = data.user;

        if (!currentUser) {
          window.location.href = "/login";
          return;
        }

        if (!currentUser.roles.includes("employer")) {
          window.location.href = "/";
          return;
        }

        setUser(currentUser);
      } catch {
        window.location.href = "/login";
      } finally {
        setLoadingPage(false);
      }
    }

    loadEmployer();
  }, []);

  async function validateCertificateId(certificateId: string) {
    const response = await fetch("/api/carer/certificate/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        certificateId,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.valid) {
      throw new Error(data.message || "Certificate could not be validated.");
    }

    setCertificate(data.certificate);
  }

  async function handleManualValidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const certificateId = String(formData.get("certificateId") || "").trim();

    setError("");
    setSuccess("");
    setCertificate(null);
    setUploadedFileName("");
    setValidating(true);

    try {
      await validateCertificateId(certificateId);
      setSuccess("Certificate verified successfully.");
      form.reset();
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Something went wrong validating certificate."
      );
    } finally {
      setValidating(false);
    }
  }

  async function readQrFromImage(file: File) {
    const result = await QrScanner.scanImage(file, {
      returnDetailedScanResult: true,
      alsoTryWithoutScanRegion: true,
    });

    return result.data;
  }

  async function readQrFromPdf(file: File) {
    const pdfjs = await import("pdfjs-dist");

    if (!pdfjs.GlobalWorkerOptions.workerPort) {
      pdfjs.GlobalWorkerOptions.workerPort = new Worker(
        new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
        { type: "module" }
      );
    }

    const fileData = await file.arrayBuffer();

    const pdf = await pdfjs.getDocument({
      data: fileData,
    }).promise;

    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 2.8 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("The certificate could not be read in this browser.");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await firstPage.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const result = await QrScanner.scanImage(canvas, {
      returnDetailedScanResult: true,
      alsoTryWithoutScanRegion: true,
    });

    return result.data;
  }

  async function handleCertificateUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");
    setCertificate(null);
    setUploadedFileName(file.name);
    setUploading(true);

    try {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      const isImage =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        /\.(png|jpg|jpeg)$/i.test(file.name);

      if (!isPdf && !isImage) {
        throw new Error("Please upload a PDF, PNG, JPG or JPEG certificate.");
      }

      const qrValue = isPdf
        ? await readQrFromPdf(file)
        : await readQrFromImage(file);

      const certificateId = extractCertificateId(qrValue);

      if (!certificateId) {
        throw new Error(
          "A valid CareAble certificate QR code was not found in this file."
        );
      }

      await validateCertificateId(certificateId);
      setSuccess("Uploaded certificate verified successfully.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Something went wrong reading the uploaded certificate."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (loadingPage) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading employer workspace...
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <style jsx>{`
        .employer-page {
          min-height: 100vh;
          background: #f5f7fb;
        }

        .workspace-container {
          max-width: 1120px;
        }

        .workspace-header {
          background: #ffffff;
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          padding: 26px 30px;
        }

        .section-label {
          color: #62758a;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .verify-card {
          background: #ffffff;
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          height: 100%;
          padding: 25px;
        }

        .upload-zone {
          position: relative;
          border: 1px dashed #9fc2fb;
          border-radius: 9px;
          background: #f6faff;
          padding: 28px 20px;
          text-align: center;
          transition:
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .upload-zone:hover {
          border-color: #0d6efd;
          background: #eef5ff;
        }

        .upload-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .upload-mark {
          width: 48px;
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #e5efff;
          color: #0d6efd;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .file-name {
          border: 1px solid #dfe9f7;
          background: #ffffff;
          border-radius: 7px;
          padding: 9px 12px;
          color: #52667a;
          font-size: 0.82rem;
          margin-top: 14px;
        }

        .result-card {
          background: #ffffff;
          border: 1px solid #dbe7f8;
          border-top: 5px solid #198754;
          border-radius: 10px;
          overflow: hidden;
        }

        .verified-pill {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.38rem 0.82rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #087443;
          background: #ddf3e7;
        }

        .detail-box {
          height: 100%;
          background: #f7faff;
          border: 1px solid #dfe9f7;
          border-radius: 8px;
          padding: 13px 15px;
        }

        .detail-box small {
          display: block;
          color: #66788a;
          margin-bottom: 5px;
        }

        .detail-box strong {
          color: #102a43;
          overflow-wrap: anywhere;
        }

        .result-badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.28rem 0.68rem;
          font-size: 0.73rem;
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
          color: #991b1b;
          background: #fee2e2;
        }

        .score-table th {
          color: #62758a;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .score-table td,
        .score-table th {
          padding: 0.74rem 0.64rem;
          vertical-align: middle;
        }

        @media (max-width: 767px) {
          .workspace-header,
          .verify-card {
            padding: 20px;
          }
        }
      `}</style>

      <main className="employer-page py-4 py-lg-5">
        <div className="container workspace-container">
          <header className="workspace-header mb-4">
            <div className="section-label mb-2">
              Employer Verification Portal
            </div>

            <h1 className="fw-bold text-primary mb-2">
              Certificate Validation
            </h1>

            <p className="text-muted mb-0">
              Welcome, {user.firstName}. Upload a CareAble certificate or
              enter its ID to validate issued capability outcomes.
            </p>
          </header>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="row g-4 mb-4">
            <div className="col-lg-7">
              <section className="verify-card shadow-sm">
                <div className="section-label mb-2">Recommended</div>
                <h2 className="h4 fw-bold mb-2">Upload Certificate</h2>

                <p className="text-muted mb-4">
                  Upload the downloaded CareAble certificate. The embedded QR
                  code will be read and verified against CareAble records.
                </p>

                <label className="upload-zone d-block">
                  <input
                    type="file"
                    className="upload-input"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    onChange={handleCertificateUpload}
                    disabled={uploading}
                  />

                  <span className="upload-mark">QR</span>

                  <span className="d-block fw-semibold mb-1">
                    {uploading
                      ? "Reading certificate..."
                      : "Choose certificate file"}
                  </span>

                  <span className="text-muted small">
                    PDF, PNG, JPG or JPEG
                  </span>
                </label>

                {uploadedFileName && (
                  <div className="file-name">
                    Selected file: <strong>{uploadedFileName}</strong>
                  </div>
                )}
              </section>
            </div>

            <div className="col-lg-5">
              <section className="verify-card shadow-sm">
                <div className="section-label mb-2">Alternative</div>
                <h2 className="h4 fw-bold mb-2">Enter Certificate ID</h2>

                <p className="text-muted mb-4">
                  Use manual validation when the certificate ID is available.
                </p>

                <form onSubmit={handleManualValidate}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Certificate ID
                    </label>

                    <input
                      name="certificateId"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter certificate ID"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={validating}
                  >
                    {validating ? "Validating..." : "Validate Certificate"}
                  </button>
                </form>
              </section>
            </div>
          </div>

          {certificate && (
            <section className="result-card shadow-sm">
              <div className="p-4 p-lg-5">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                  <div>
                    <span className="verified-pill mb-3">
                      Certificate Verified
                    </span>

                    <h2 className="h3 fw-bold mb-1">
                      {certificate.carerName}
                    </h2>

                    <p className="text-muted mb-0">
                      {certificate.assessmentTitle}
                    </p>
                  </div>

                  <div className="text-md-end">
                    <small className="text-muted d-block">
                      Certificate ID
                    </small>
                    <strong style={{ overflowWrap: "anywhere" }}>
                      {certificate.id}
                    </strong>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="detail-box">
                      <small>Completion Date</small>
                      <strong>{formatDate(certificate.completionDate)}</strong>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="detail-box">
                      <small>Overall Score</small>
                      <strong>{certificate.overallScore.toFixed(1)} / 5</strong>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="detail-box">
                      <small>Outcome</small>
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

                <h3 className="h5 fw-bold mb-3">Domain Outcome Details</h3>

                <div className="table-responsive">
                  <table className="table score-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Capability Domain</th>
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
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}