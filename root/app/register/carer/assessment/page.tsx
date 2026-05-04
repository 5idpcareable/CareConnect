import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function CarerAssessmentPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="mb-4">
            <h1 className="fw-bold text-primary">Caregiving Skills Assessment</h1>
            <p className="text-muted">
              Rate yourself from 1 to 5 based on your caregiving experience.
            </p>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Assessment Progress</span>
                  <span className="text-muted">Step 1 of 1</span>
                </div>

                <div className="progress">
                  <div className="progress-bar" style={{ width: "100%" }}></div>
                </div>
              </div>

              <form>
                <div className="mb-4">
                  <h5 className="fw-bold">Communication Skills</h5>
                  <p className="text-muted">
                    I can communicate clearly with the person I care for, family
                    members, and support services.
                  </p>

                  <select className="form-select">
                    <option>Select rating</option>
                    <option>1 - Strongly disagree</option>
                    <option>2 - Disagree</option>
                    <option>3 - Neutral</option>
                    <option>4 - Agree</option>
                    <option>5 - Strongly agree</option>
                  </select>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold">Problem Solving</h5>
                  <p className="text-muted">
                    I can solve unexpected problems and make decisions under pressure.
                  </p>

                  <select className="form-select">
                    <option>Select rating</option>
                    <option>1 - Strongly disagree</option>
                    <option>2 - Disagree</option>
                    <option>3 - Neutral</option>
                    <option>4 - Agree</option>
                    <option>5 - Strongly agree</option>
                  </select>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold">Time Management</h5>
                  <p className="text-muted">
                    I can organise appointments, medication, routines, and daily
                    responsibilities.
                  </p>

                  <select className="form-select">
                    <option>Select rating</option>
                    <option>1 - Strongly disagree</option>
                    <option>2 - Disagree</option>
                    <option>3 - Neutral</option>
                    <option>4 - Agree</option>
                    <option>5 - Strongly agree</option>
                  </select>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold">Emotional Support</h5>
                  <p className="text-muted">
                    I can provide patience, empathy, reassurance, and emotional
                    support.
                  </p>

                  <select className="form-select">
                    <option>Select rating</option>
                    <option>1 - Strongly disagree</option>
                    <option>2 - Disagree</option>
                    <option>3 - Neutral</option>
                    <option>4 - Agree</option>
                    <option>5 - Strongly agree</option>
                  </select>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold">Health and Safety Awareness</h5>
                  <p className="text-muted">
                    I can recognise risks, follow safe practices, and support
                    wellbeing.
                  </p>

                  <select className="form-select">
                    <option>Select rating</option>
                    <option>1 - Strongly disagree</option>
                    <option>2 - Disagree</option>
                    <option>3 - Neutral</option>
                    <option>4 - Agree</option>
                    <option>5 - Strongly agree</option>
                  </select>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <a href="/carer/dashboard" className="btn btn-outline-primary">
                    Back to Dashboard
                  </a>

                  <a href="/carer/certificate" className="btn btn-primary">
                    Submit Assessment
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
