"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import LandingPageStyles from "./components/LandingPageStyles";
import Navbar from "./components/Navbar";

type User = {
  roles: string[];
};

type LandingData = {
  metrics: {
    registeredCarers: number;
    assessmentCompletionRate: number;
    visibleDomains: number;
    visibleQuestions: number;
    certificatesIssued: number;
    averageScore: number;
  };
};

const emptyLandingData: LandingData = {
  metrics: {
    registeredCarers: 0,
    assessmentCompletionRate: 0,
    visibleDomains: 0,
    visibleQuestions: 0,
    certificatesIssued: 0,
    averageScore: 0,
  },
};

const features = [
  {
    code: "SA",
    title: "Self Assessment",
    description:
      "Complete structured skill assessments at your own pace, one section at a time.",
  },
  {
    code: "SM",
    title: "Skill Mapping",
    description:
      "Translate lived caring experience into recognised and meaningful capabilities.",
  },
  {
    code: "CH",
    title: "Capability Heatmap",
    description:
      "View strengths, growth areas and support opportunities across care domains.",
  },
  {
    code: "DC",
    title: "Digital Certificate",
    description:
      "Receive a verified certificate with QR-enabled outcome validation.",
  },
  {
    code: "SE",
    title: "Secure Access",
    description:
      "Protected authentication and controlled access for carers and employers.",
  },
  {
    code: "PD",
    title: "Progress Dashboard",
    description:
      "Save assessment progress and return when it suits your caring schedule.",
  },
];

const challenges = [
  {
    title: "Unrecognised Skills",
    description:
      "Care experience builds valuable capabilities that are often invisible.",
  },
  {
    title: "Employment Barriers",
    description:
      "Carers may struggle to communicate their transferable strengths.",
  },
  {
    title: "Lack of Support",
    description:
      "Recognition pathways are rarely designed around unpaid carers.",
  },
  {
    title: "CareAble Solution",
    description:
      "Assessment, capability insights and verified digital certification.",
    highlighted: true,
  },
];

const processSteps = [
  {
    code: "01",
    title: "Login",
    text: "Create secure access",
  },
  {
    code: "02",
    title: "Assessment",
    text: "Complete care domains",
  },
  {
    code: "03",
    title: "Scoring",
    text: "Understand capability",
  },
  {
    code: "04",
    title: "Heatmap",
    text: "Explore strengths",
  },
  {
    code: "05",
    title: "Certificate",
    text: "Share recognition",
  },
];

function numberLabel(value: number) {
  return value.toLocaleString();
}

export default function Home() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [landingData, setLandingData] =
    useState<LandingData>(emptyLandingData);

  useEffect(() => {
    async function loadLandingPage() {
      try {
        const authResponse = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (authResponse.ok) {
          const authData = await authResponse.json();
          const user: User | null = authData.user;

          if (
            user?.roles.includes("super_admin") ||
            user?.roles.includes("admin")
          ) {
            window.location.href = "/admin/dashboard";
            return;
          }

          if (user?.roles.includes("employer")) {
            window.location.href = "/employer/dashboard";
            return;
          }

          if (user?.roles.includes("carer")) {
            window.location.href = "/carer/dashboard";
            return;
          }
        }

        const metricsResponse = await fetch("/api/public/landing", {
          method: "GET",
          cache: "no-store",
        });

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();

          setLandingData({
            metrics: metricsData.metrics,
          });
        }
      } catch {
        setLandingData(emptyLandingData);
      } finally {
        setMetricsLoading(false);
        setCheckingAuth(false);
      }
    }

    loadLandingPage();
  }, []);

  if (checkingAuth) {
    return (
      <>
        <LandingPageStyles />

        <main className="loading-screen">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </main>
      </>
    );
  }

  const { metrics } = landingData;

  const statistics = [
    {
      value: numberLabel(metrics.registeredCarers),
      label: "Registered Carers",
    },
    {
      value: `${metrics.assessmentCompletionRate}%`,
      label: "Assessment Completion",
    },
    {
      value: numberLabel(metrics.visibleDomains),
      label: "Active Skill Domains",
    },
    {
      value: numberLabel(metrics.certificatesIssued),
      label: "Certificates Issued",
    },
  ];

  const averageScore =
    metrics.averageScore > 0 ? `${metrics.averageScore.toFixed(1)} / 5` : "--";

  return (
    <>
      <LandingPageStyles />

      <div className="landing-page">
        <Navbar />

        <main>
          <section id="home" className="hero-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 fade-up">
                  <span className="hero-badge">
                    <span className="badge-dot" />
                    Supporting Hidden Carers
                  </span>

                  <h1 className="hero-title">
                    Transform Caregiving Experience Into Recognised Skills
                  </h1>

                  <p className="hero-copy mb-4">
                    CareAble helps unpaid carers identify the valuable skills
                    built through caring, complete meaningful self-assessments,
                    and receive trusted digital certification.
                  </p>

                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <Link
                      href="/register"
                      className="btn btn-careable btn-lg px-4"
                    >
                      Start Assessment
                    </Link>

                    <a
                      href="#how-it-works"
                      className="btn btn-outline-careable btn-lg px-4"
                    >
                      See How It Works
                    </a>
                  </div>
                </div>

                <div className="col-lg-6 fade-up delay-2">
                  <div className="hero-visual">
                    <div className="image-panel">
                      <img
                        src="https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1100&q=80"
                        alt="Carer supporting an older person at home"
                      />
                      <div className="image-overlay" />
                    </div>

                    <div className="dashboard-float">
                      <span className="tiny-label">Average Skill Score</span>

                      <div className="score-value">
                        {metricsLoading ? "..." : averageScore}
                      </div>

                      <span className="badge bg-success">
                        Capability insights
                      </span>

                      <div className="heat-row">
                        <span
                          className="heat-cell"
                          style={{ background: "#2563eb" }}
                        />
                        <span
                          className="heat-cell"
                          style={{ background: "#60a5fa" }}
                        />
                        <span
                          className="heat-cell"
                          style={{ background: "#f59e0b" }}
                        />
                        <span
                          className="heat-cell"
                          style={{ background: "#16a34a" }}
                        />
                      </div>
                    </div>

                    <div className="certificate-float">
                      <span className="tiny-label">Certificates Issued</span>

                      <h5 className="fw-bold mt-2 mb-1">
                        {metricsLoading
                          ? "..."
                          : numberLabel(metrics.certificatesIssued)}
                      </h5>

                      <p className="small text-muted mb-0">
                        Verified digital records
                      </p>
                    </div>

                    <div className="progress-float">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="tiny-label">Completion Rate</span>

                        <strong className="small">
                          {metricsLoading
                            ? "..."
                            : `${metrics.assessmentCompletionRate}%`}
                        </strong>
                      </div>

                      <div className="progress" style={{ height: "7px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{
                            width: `${metrics.assessmentCompletionRate}%`,
                          }}
                          role="progressbar"
                          aria-valuenow={metrics.assessmentCompletionRate}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="stats-section" aria-label="Platform statistics">
            <div className="container">
              <div className="stats-card">
                <div className="row g-4 text-center">
                  {statistics.map((statistic) => (
                    <div className="col-6 col-lg-3" key={statistic.label}>
                      <div className="stat-number">
                        {metricsLoading ? "..." : statistic.value}
                      </div>

                      <div className="stat-label">{statistic.label}</div>

                      {!metricsLoading && (
                        <span className="live-label">
                          <span className="live-dot" />
                          Live data
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="landing-section">
            <div className="container">
              <div
                className="text-center mx-auto mb-5"
                style={{ maxWidth: 720 }}
              >
                <div className="section-tag mb-3">Features</div>

                <h2 className="section-title mb-3">
                  Built to recognise the value of care
                </h2>

                <p className="section-copy mx-auto mb-0">
                  A complete skills recognition experience designed around the
                  lives, needs and ambitions of unpaid carers.
                </p>
              </div>

              <div className="row g-4">
                {features.map((feature) => (
                  <div className="col-md-6 col-lg-4" key={feature.title}>
                    <article className="feature-card">
                      <span className="feature-icon">{feature.code}</span>

                      <h3 className="feature-title">{feature.title}</h3>

                      <p className="text-muted mb-0">
                        {feature.description}
                      </p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="landing-section bg-white">
            <div className="container">
              <div className="row align-items-center g-5">
                <div className="col-lg-6">
                  <div className="solution-image">
                    <img
                      src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1000&q=80"
                      alt="A carer providing thoughtful support at home"
                    />

                    <div className="solution-caption">
                      <h3 className="h5 fw-bold mb-2">
                        Care deserves recognition
                      </h3>

                      <p className="small mb-0">
                        CareAble helps turn practical support, resilience and
                        lived experience into visible capability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="section-tag mb-3">Problem and Solution</div>

                  <h2 className="section-title mb-3">
                    Making hidden capability visible
                  </h2>

                  <p className="section-copy mb-4">
                    Informal care can involve communication, coordination,
                    resilience, safety awareness and practical support.
                    CareAble turns that experience into recognised outcomes.
                  </p>

                  {challenges.map((challenge) => (
                    <div
                      key={challenge.title}
                      className={`challenge-card ${
                        challenge.highlighted ? "solution" : ""
                      }`}
                    >
                      <span className="challenge-marker" />

                      <h3 className="h6 fw-bold mb-1">
                        {challenge.title}
                      </h3>

                      <p className="text-muted small mb-0">
                        {challenge.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="landing-section">
            <div className="container">
              <div className="text-center mb-5">
                <div className="section-tag mb-3">How It Works</div>

                <h2 className="section-title">
                  From lived experience to recognition
                </h2>
              </div>

              <div className="process-wrap">
                <div className="process-line" />

                <div className="row g-4">
                  {processSteps.map((step) => (
                    <div className="col-md" key={step.code}>
                      <div className="process-card">
                        <span className="process-icon">{step.code}</span>

                        <h3 className="h6 fw-bold">{step.title}</h3>

                        <p className="text-muted small mb-0">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="landing-section">
            <div className="container">
              <div className="cta-panel text-center">
                <h2 className="section-title text-white mb-3">
                  Start Your CareAble Journey Today
                </h2>

                <p
                  className="mb-4 mx-auto"
                  style={{ maxWidth: 620, opacity: 0.88 }}
                >
                  Recognise your caring experience, understand your
                  capabilities and receive a certificate that helps make your
                  skills visible.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link
                    href="/register"
                    className="btn btn-light btn-lg px-4 text-primary"
                  >
                    Create Account
                  </Link>

                  <a
                    href="#about"
                    className="btn btn-outline-light btn-lg px-4"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <div id="contact">
          <Footer />
        </div>
      </div>
    </>
  );
}