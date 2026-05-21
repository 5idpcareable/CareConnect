"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          repeatPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not reset password.");
        return;
      }

      setMessage(data.message || "Password reset successfully.");
      setPassword("");
      setRepeatPassword("");
    } catch {
      setError("Something went wrong resetting password.");
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
                  Reset Password
                </h2>
                <p className="text-secondary">
                  Enter your new password to continue.
                </p>
              </div>

              {!token && (
                <div className="alert alert-danger">
                  Reset token is missing. Please create a new reset link.
                </div>
              )}

              {error && <div className="alert alert-danger">{error}</div>}

              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-4"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={!token || Boolean(message)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Repeat Password
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-4"
                    placeholder="Repeat new password"
                    value={repeatPassword}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                    required
                    disabled={!token || Boolean(message)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2"
                  disabled={loading || !token || Boolean(message)}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                {message ? (
                  <Link
                    href="/login"
                    className="fw-semibold text-decoration-none"
                  >
                    Login with new password
                  </Link>
                ) : (
                  <Link
                    href="/forgot-password"
                    className="fw-semibold text-decoration-none"
                  >
                    Create a new reset link
                  </Link>
                )}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main style={{ background: "#fbf7ff", minHeight: "100vh" }}>
          <div className="container py-5">
            <div className="alert alert-info mb-0">Loading reset page...</div>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}