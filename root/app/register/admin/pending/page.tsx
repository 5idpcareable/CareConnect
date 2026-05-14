import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function AdminPendingPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5 text-center">
                  <span className="badge bg-warning text-dark mb-3">
                    Pending Review
                  </span>

                  <h1 className="fw-bold text-primary mb-3">
                    Admin Access Request Submitted
                  </h1>

                  <p className="text-muted mb-4">
                    Your request has been saved. A super admin must review and
                    approve your access before you can log in to the admin
                    portal.
                  </p>

                  <div className="alert alert-info text-start">
                    If you try to log in before approval, the system will show
                    that your admin request is still pending.
                  </div>

                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <Link href="/" className="btn btn-primary">
                      Back to Home
                    </Link>

                    <Link href="/login" className="btn btn-outline-primary">
                      Go to Login
                    </Link>
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
