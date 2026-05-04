import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="py-5 bg-light">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="display-4 fw-bold mb-4">
                  Supporting Hidden Carers Through Skill Recognition
                </h1>

                <p className="lead text-muted mb-4">
                  CareAble helps unpaid carers recognise their caregiving
                  skills, complete self-assessments, and receive meaningful
                  digital certification.
                </p>

                <div className="d-flex gap-3">
                  <a href="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </a>

                  <a href="#about" className="btn btn-outline-primary btn-lg">
                    Learn More
                  </a>
                </div>
              </div>

              <div className="col-lg-6 mt-5 mt-lg-0">
                <div className="bg-white rounded-4 shadow p-5 text-center">
                  <h3 className="fw-bold text-primary mb-3">CareAble</h3>
                  <p className="text-muted mb-0">
                    A mobile-friendly platform for carers, admins, and future
                    employer access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}