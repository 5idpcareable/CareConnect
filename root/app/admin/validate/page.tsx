"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type CapabilityArea = {
  domainId: string;
  title: string;
  score: number;
  capabilityLevel: string;
  capabilityDescription: string;
};

type ValidCertificate = {
  id: string;
  carerName: string;
  assessmentTitle: string;
  completionDate: string;
  domainsCompleted: number;
  topCapabilityAreas: CapabilityArea[];
  status: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CertificateValidatePage() {
  const [certificate, setCertificate] = useState<ValidCertificate | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleValidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setCertificate(null);
    setSearched(true);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/certificates/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificateId: formData.get("certificateId"),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setError(data.message || "Certificate could not be validated.");
        return;
      }

      setCertificate(data.certificate);
      event.currentTarget.reset();
    } catch {
      setError("Something went wrong validating certificate.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-light py-5" style={{ minHeight: "75vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="text-center mb-4">
                <h1 className="fw-bold text-primary mb-2">
                  Validate Certificate
                </h1>
                <p className="text-muted mb-0">
                  Enter a CareAble certificate ID to confirm authenticity.
                </p>
              </div>

              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <form onSubmit={handleValidate}>
                    <label className="form-label fw-semibold">
                      Certificate ID
                    </label>

                    <div className="d-flex flex-column flex-md-row gap-2">
                      <input
                        name="certificateId"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Example: cm..."
                        required
                      />

                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={loading}
                      >
                        {loading ? "Checking..." : "Validate"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {!error && searched && !certificate && !loading && (
                <div className="alert alert-warning">
                  No verified certificate found for that ID.
                </div>
              )}

              {certificate && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                      <div>
                        <span className="badge bg-success mb-3">
                          {certificate.status}
                        </span>

                        <h2 className="fw-bold mb-1">
                          Certificate Verified
                        </h2>

                        <p className="text-muted mb-0">
                          This certificate was issued by CareAble.
                        </p>
                      </div>

                      <div className="text-lg-end">
                        <small className="text-muted d-block">
                          Certificate ID
                        </small>
                        <strong style={{ overflowWrap: "anywhere" }}>
                          {certificate.id}
                        </strong>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="bg-light rounded-3 p-3 h-100">
                          <small className="text-muted d-block">
                            Certificate Holder
                          </small>
                          <strong>{certificate.carerName}</strong>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="bg-light rounded-3 p-3 h-100">
                          <small className="text-muted d-block">
                            Assessment
                          </small>
                          <strong>{certificate.assessmentTitle}</strong>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="bg-light rounded-3 p-3 h-100">
                          <small className="text-muted d-block">
                            Completion Date
                          </small>
                          <strong>
                            {formatDate(certificate.completionDate)}
                          </strong>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="bg-light rounded-3 p-3 h-100">
                          <small className="text-muted d-block">
                            Domains Completed
                          </small>
                          <strong>{certificate.domainsCompleted}</strong>
                        </div>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-3">Top Capability Areas</h5>

                    {certificate.topCapabilityAreas.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {certificate.topCapabilityAreas.map((area) => (
                          <span
                            key={area.domainId}
                            className="badge bg-success rounded-pill px-3 py-2"
                          >
                            {area.title} · {area.score.toFixed(1)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">
                        No top capability areas above 4.0 were recorded for
                        this certificate.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <Link href="/" className="text-decoration-none">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}