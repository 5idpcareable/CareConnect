"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      router.push("/carer/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
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
                  Welcome Back
                </h2>
                <p className="text-secondary">
                  Sign in to continue your CareAble journey.
                </p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control rounded-4"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control rounded-4"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                New to CareAble?{" "}
                <Link href="/register" className="fw-semibold text-decoration-none">
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
