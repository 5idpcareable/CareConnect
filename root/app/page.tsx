import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export default function Page() {
  return (
    <main style={{ background: "#fbf7ff", minHeight: "100vh" }}>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 sticky-top">
        <div className="container">
          <Link
            href="/"
            className="navbar-brand fw-bold fs-3"
            style={{ color: "#7b4dff" }}
          >
            CareAble
          </Link>

          <div className="d-flex gap-2">
            <Link href="/login" className="btn btn-outline-primary rounded-pill px-4">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary rounded-pill px-4">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="container py-5">
        <div className="row align-items-center py-5">
          <div className="col-lg-6">
            <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2 mb-3">
              Care Meets Intelligence
            </span>

            <h1 className="display-3 fw-bold lh-1 mb-4">
              Recognise the skills of hidden carers.
            </h1>

            <p className="lead text-secondary mb-4">
              CareAble helps unpaid carers complete self-assessments, understand
              their strengths, view insights, and receive a digital certificate
              that recognises their caregiving capability.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary btn-lg rounded-pill px-5">
                Start Assessment
              </Link>
              <Link href="#features" className="btn btn-light btn-lg rounded-pill px-5 shadow-sm">
                Learn More
              </Link>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="position-relative d-flex justify-content-center">
              <div
                className="position-absolute rounded-circle"
                style={{
                  width: "360px",
                  height: "360px",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  filter: "blur(40px)",
                  opacity: 0.25,
                }}
              />

              <div
                className="card border-0 shadow-lg rounded-5 p-4 position-relative"
                style={{ width: "330px", background: "white" }}
              >
                <div className="text-center mb-4">
                  <div
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "linear-gradient(135deg, #7b4dff, #c084fc)",
                      color: "white",
                      fontSize: "30px",
                    }}
                  >
                    ♥
                  </div>

                  <h4 className="fw-bold mb-1">CareAble</h4>
                  <p className="text-secondary small mb-0">
                    Turn care experience into recognised skills
                  </p>
                </div>

                <div className="bg-light rounded-4 p-3 mb-3">
                  <small className="text-secondary">Capability Level</small>
                  <h5 className="fw-bold mb-0 text-primary">
                    High Demonstrated Capability
                  </h5>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div
                      className="rounded-4 p-3 text-center"
                      style={{ background: "#f3e8ff" }}
                    >
                      <h5 className="fw-bold mb-0">9/9</h5>
                      <small>Domains</small>
                    </div>
                  </div>

                  <div className="col-6">
                    <div
                      className="rounded-4 p-3 text-center"
                      style={{ background: "#e0f2fe" }}
                    >
                      <h5 className="fw-bold mb-0">4.1</h5>
                      <small>Score</small>
                    </div>
                  </div>
                </div>

                <div className="rounded-4 p-3 mb-3" style={{ background: "#fff7ed" }}>
                  <small className="text-secondary">Top Strength</small>
                  <p className="fw-semibold mb-0">
                    Communication & Relational Care
                  </p>
                </div>

                <Link href="/register" className="btn btn-primary w-100 rounded-pill">
                  Begin Self-Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">What CareAble Provides</h2>
          <p className="text-secondary">
            A simple journey from self-assessment to recognised capability.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold">Recognise Carers</h5>
              <p className="text-secondary">
                Supports people who provide care but may not identify as carers.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold">Assess Skills</h5>
              <p className="text-secondary">
                Uses structured questions to understand caregiving capabilities.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold">View Insights</h5>
              <p className="text-secondary">
                Shows strengths, growth areas, and progress in a clear dashboard.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold">Digital Certificate</h5>
              <p className="text-secondary">
                Generates a certificate after completing the full assessment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}