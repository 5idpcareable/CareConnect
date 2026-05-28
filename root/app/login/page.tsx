"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getDashboardPath(roles: string[]) {
    if (roles.includes("super_admin") || roles.includes("admin")) {
      return "/admin/dashboard";
    }

    if (roles.includes("employer")) {
      return "/employer/dashboard";
    }

    if (roles.includes("carer")) {
      return "/carer/dashboard";
    }

    return "/";
  }

  function getSafeReturnUrl() {
    const returnUrl = searchParams.get("returnUrl");

    if (!returnUrl) {
      return null;
    }

    if (!returnUrl.startsWith("/") || returnUrl.startsWith("//")) {
      return null;
    }

    if (!returnUrl.startsWith("/verify/")) {
      return null;
    }

    return returnUrl;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      const roles: string[] = data.user?.roles || [];
      const safeReturnUrl = getSafeReturnUrl();

      if (safeReturnUrl) {
        router.push(safeReturnUrl);
        router.refresh();
        return;
      }

      router.push(getDashboardPath(roles));
      router.refresh();
    } catch {
      setError("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #f4f7fc;
          display: flex;
          align-items: center;
        }

        .login-card {
          background: #ffffff;
          border: 1px solid #dbe7f8;
          border-radius: 16px;
          box-shadow: 0 16px 38px rgba(16, 42, 67, 0.08);
          padding: 34px;
        }

        .brand-label {
          color: #0d6efd;
          font-weight: 800;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .secure-note {
          background: #f5f9ff;
          border: 1px solid #dbe7f8;
          border-radius: 8px;
          color: #52667a;
          font-size: 0.86rem;
          padding: 11px 13px;
        }

        .form-control {
          min-height: 48px;
        }
      `}</style>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="login-card">
              <div className="text-center mb-4">
                <div className="brand-label mb-2">CareAble</div>

                <h1 className="h2 fw-bold text-primary mb-2">
                  Welcome Back
                </h1>

                <p className="text-muted mb-0">
                  Sign in to continue securely.
                </p>
              </div>

              {getSafeReturnUrl() && (
                <div className="secure-note mb-4">
                  Login is required to view protected certificate verification
                  details.
                </div>
              )}

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="small fw-semibold text-decoration-none"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center text-muted mt-4 mb-0">
                New to CareAble?{" "}
                <Link
                  href="/register"
                  className="fw-semibold text-decoration-none"
                >
                  Create an account
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