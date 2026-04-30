import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export default function LoginPage() {
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

              <form>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control rounded-4"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control rounded-4"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Remember me</label>
                  </div>

                  <a href="#" className="text-decoration-none">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2">
                  Login
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                New to CareAble?{" "}
                <Link href="/register" className="fw-semibold text-decoration-none">
                  Create an account
                </Link>
              </p>

              <div className="bg-light rounded-4 p-3 mt-4">
                <small className="text-secondary">
                  Role-based access: Carers can complete assessments, admins can
                  manage the system, and employers can validate certificates.
                </small>
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
  );
}