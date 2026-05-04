import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary">
              Create Your CareAble Account
            </h1>
            <p className="text-muted">
              Select your role to continue with the correct onboarding form.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-body p-4 text-center">
                  <h3 className="fw-bold">Carer</h3>
                  <p className="text-muted">
                    Complete onboarding and access caregiving skill assessments.
                  </p>
                  <a href="/register/carer" className="btn btn-outline-primary w-100">
                 Continue as Carer
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-body p-4 text-center">
                  <h3 className="fw-bold">Admin</h3>
                  <p className="text-muted">
                    Manage users, assessments, roles, and dashboard data.
                  </p>
                  <a href="/register/admin" className="btn btn-outline-primary w-100">
                    Continue as Admin
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-body p-4 text-center">
                  <h3 className="fw-bold">Employer</h3>
                  <p className="text-muted">
                    Validate certificates and view recognised caregiving skills.
                  </p>
                  <a href="/register/employer" className="btn btn-outline-primary w-100">
                    Continue as Employer
                  </a>
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