"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EmployerRegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmployerRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/employer/access-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.get("companyName"),
          contactName: formData.get("contactName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          postcode: formData.get("postcode"),
          password: formData.get("password"),
          repeatPassword: formData.get("repeatPassword"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not submit employer request.");
        return;
      }

      form.reset();
      setSuccess(data.message || "Employer access request submitted.");
    } catch {
      setError("Something went wrong submitting employer request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  <h1 className="fw-bold text-primary mb-2">
                    Employer Access Request
                  </h1>

                  <p className="text-muted mb-4">
                    Submit your organisation details. A super admin will review
                    your request before employer login access is activated.
                  </p>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && (
                    <div className="alert alert-success">{success}</div>
                  )}

                  <form onSubmit={handleEmployerRequest}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Company Name
                        </label>
                        <input
                          name="companyName"
                          type="text"
                          className="form-control"
                          placeholder="Organisation name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Contact Name
                        </label>
                        <input
                          name="contactName"
                          type="text"
                          className="form-control"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="work@example.com"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          className="form-control"
                          placeholder="Contact phone"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Postcode
                        </label>
                        <input
                          name="postcode"
                          type="text"
                          className="form-control"
                          placeholder="Postcode"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Requested Role
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value="Employer"
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Password
                        </label>
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Create password"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Repeat Password
                        </label>
                        <input
                          name="repeatPassword"
                          type="password"
                          className="form-control"
                          placeholder="Repeat password"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mt-4 py-2"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Request"}
                    </button>
                  </form>

                  <p className="text-center text-muted mt-4 mb-0">
                    Already approved?{" "}
                    <Link href="/login" className="fw-semibold">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>

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