import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CarerDashboardPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="mb-4">
            <h1 className="fw-bold text-primary">Carer Dashboard</h1>
            <p className="text-muted mb-0">
              Welcome back. Track your onboarding, assessment progress, and certificate.
            </p>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Profile Status</h5>
                  <p className="text-muted mb-3">
                    Your carer profile has been started.
                  </p>
                  <span className="badge bg-success">Registered</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Assessment</h5>
                  <p className="text-muted mb-3">
                    Complete your caregiving skills self-assessment.
                  </p>
                  <span className="badge bg-warning text-dark">Not Started</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Certificate</h5>
                  <p className="text-muted mb-3">
                    Your certificate will appear after assessment completion.
                  </p>
                  <span className="badge bg-secondary">Locked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-3">Next Step</h4>

                  <p className="text-muted">
                    Start your self-assessment to recognise the caregiving skills
                    you have developed through your lived experience.
                  </p>

                  <a href="/carer/assessment" className="btn btn-primary px-4">
                    Start Assessment
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Your Progress</h5>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Profile</span>
                      <span>100%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Assessment</span>
                      <span>0%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-warning" style={{ width: "0%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Certificate</span>
                      <span>0%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-secondary" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
