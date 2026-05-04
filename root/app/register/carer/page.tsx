import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CarerRegisterPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card border-0 shadow rounded-4">
                <div className="card-body p-4 p-md-5">
                  <h2 className="fw-bold text-primary mb-2">
                    Carer Registration
                  </h2>
                  <p className="text-muted mb-4">
                    Complete your basic details and carer onboarding information.
                  </p>

                  <form>
                    <h5 className="fw-bold mb-3">Basic Information</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Postcode</label>
                        <input type="number" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Repeat Password</label>
                        <input type="password" className="form-control" />
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h5 className="fw-bold mb-3">Work Status</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Are you working at the moment?
                        </label>
                        <select className="form-select">
                          <option>Select option</option>
                          <option>Yes, full-time</option>
                          <option>Yes, part-time</option>
                          <option>Casual</option>
                          <option>No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Are you looking for work?
                        </label>
                        <select className="form-select">
                          <option>Select option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Have you applied for any job within the last 4 weeks?
                        </label>
                        <select className="form-select">
                          <option>Select option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Which industry interests you?
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Example: aged care, disability, health"
                        />
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h5 className="fw-bold mb-3">Language Background</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Do you speak a language other than English?
                        </label>
                        <select className="form-select">
                          <option>Select option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Which language do you speak?
                        </label>
                        <select className="form-select">
                          <option>Select language</option>
                          <option>Mandarin</option>
                          <option>Arabic</option>
                          <option>Vietnamese</option>
                          <option>Cantonese</option>
                          <option>German</option>
                          <option>Italian</option>
                          <option>Hindi</option>
                          <option>Greek</option>
                          <option>Spanish</option>
                          <option>Nepali</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h5 className="fw-bold mb-3">Caregiving Information</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          How did you hear about this app?
                        </label>
                        <select className="form-select">
                          <option>Select option</option>
                          <option>Partner organisation</option>
                          <option>Carers VIC</option>
                          <option>Carers NSW</option>
                          <option>Brotherhood St Laurence</option>
                          <option>Other carer organisation</option>
                          <option>WhatsApp group</option>
                          <option>WeChat group</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          What brings you here?
                        </label>
                        <select className="form-select">
                          <option>Select reason</option>
                          <option>To recognise my caregiving skills</option>
                          <option>To explore employment pathways</option>
                          <option>To complete a self-assessment</option>
                          <option>To receive a certificate</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Who do you care for?</label>
                        <select className="form-select">
                          <option>Select option</option>
                          <option>Parent</option>
                          <option>Child</option>
                          <option>Relative</option>
                          <option>Friend</option>
                          <option>Partner</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Age of the person you are caring for
                        </label>
                        <select className="form-select">
                          <option>Select age range</option>
                          <option>Under 18</option>
                          <option>18–29</option>
                          <option>30–40</option>
                          <option>41–60</option>
                          <option>61–80</option>
                          <option>Over 80</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Which condition applies to the person you care for?
                        </label>
                        <select className="form-select">
                          <option>Select condition</option>
                          <option>Dementia</option>
                          <option>Palliative care</option>
                          <option>Disability</option>
                          <option>Chronic illness</option>
                          <option>Age-related frailty</option>
                          <option>Mental health condition</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          How long have you cared for this person?
                        </label>
                        <select className="form-select">
                          <option>Select duration</option>
                          <option>Less than 1 year</option>
                          <option>1–3 years</option>
                          <option>3–5 years</option>
                          <option>5–7 years</option>
                          <option>7–10 years</option>
                          <option>Over 10 years</option>
                        </select>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I accept the terms of service and privacy policy.
                      </label>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="researchConsent"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="researchConsent"
                      >
                        I consent to my data being anonymised and used for
                        research purposes.
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2">
                      Create Carer Account
                    </button>
                  </form>
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