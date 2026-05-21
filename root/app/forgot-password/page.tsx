"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setResetUrl("");
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not create reset link.");
        return;
      }

      setMessage(data.message || "Reset link created.");

      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setError("Something went wrong creating reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: "#fbf7ff", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg rounded-5 p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "#7b4dff" }}>
                  Forgot Password
                </h2>
                <p className="text-secondary">
                  Enter your email to create a password reset link.
                </p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {message && <div className="alert alert-success">{message}</div>}

              {resetUrl && (
                <div className="alert alert-info">
                  <div className="fw-semibold mb-2">
                    Development reset link:
                  </div>

                  <Link href={resetUrl} className="text-break">
                    {resetUrl}
                  </Link>
                </div>
              )}

              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-4"
                    placeholder="Enter your account email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2"
                  disabled={loading}
                >
                  {loading ? "Creating Link..." : "Create Reset Link"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Remember your password?{" "}
                <Link href="/login" className="fw-semibold text-decoration-none">
                  Back to login
                </Link>
              </p>
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
  );
}