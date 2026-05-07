"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CarerRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleId = searchParams.get("role") || "1";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roleId,
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        dateOfBirth: formData.get("dateOfBirth"),
        postcode: formData.get("postcode"),
        password: formData.get("password"),
        repeatPassword: formData.get("repeatPassword"),

        workStatus: formData.get("workStatus"),
        lookingForWork: formData.get("lookingForWork"),
        appliedRecently: formData.get("appliedRecently"),
        interestedIndustry: formData.get("interestedIndustry"),

        speaksOtherLanguage: formData.get("speaksOtherLanguage"),
        language: formData.get("language"),

        referralSource: formData.get("referralSource"),
        reasonForJoining: formData.get("reasonForJoining"),
        careRecipient: formData.get("careRecipient"),
        careRecipientAge: formData.get("careRecipientAge"),
        careCondition: formData.get("careCondition"),
        careDuration: formData.get("careDuration"),

        termsAccepted: formData.get("termsAccepted") === "on",
        researchConsent: formData.get("researchConsent") === "on",
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(data.message || "Sign up failed.");
      return;
    }

    router.push("/carer/dashboard");
  }

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
                    Carer Sign Up
                  </h2>

                  <p className="text-muted mb-2">
                    Complete your basic details and carer onboarding information.
                  </p>

                  <p className="text-muted small mb-4">
                    Selected role ID: <strong>{roleId}</strong>
                  </p>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSignup}>
                    <h5 className="fw-bold mb-3">Basic Information</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input
                          name="firstName"
                          type="text"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                          name="lastName"
                          type="text"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          name="phone"
                          type="tel"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Date of Birth</label>
                        <input
                          name="dateOfBirth"
                          type="date"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Postcode</label>
                        <input
                          name="postcode"
                          type="number"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Repeat Password</label>
                        <input
                          name="repeatPassword"
                          type="password"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h5 className="fw-bold mb-3">Work Status</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Are you working at the moment?
                        </label>
                        <select name="workStatus" className="form-select">
                          <option value="">Select option</option>
                          <option value="full-time">Yes, full-time</option>
                          <option value="part-time">Yes, part-time</option>
                          <option value="casual">Casual</option>
                          <option value="not-working">No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Are you looking for work?
                        </label>
                        <select name="lookingForWork" className="form-select">
                          <option value="">Select option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Have you applied for any job within the last 4 weeks?
                        </label>
                        <select name="appliedRecently" className="form-select">
                          <option value="">Select option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Which industry interests you?
                        </label>
                        <input
                          name="interestedIndustry"
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
                        <select
                          name="speaksOtherLanguage"
                          className="form-select"
                        >
                          <option value="">Select option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Which language do you speak?
                        </label>
                        <select name="language" className="form-select">
                          <option value="">Select language</option>
                          <option value="mandarin">Mandarin</option>
                          <option value="arabic">Arabic</option>
                          <option value="vietnamese">Vietnamese</option>
                          <option value="cantonese">Cantonese</option>
                          <option value="german">German</option>
                          <option value="italian">Italian</option>
                          <option value="hindi">Hindi</option>
                          <option value="greek">Greek</option>
                          <option value="spanish">Spanish</option>
                          <option value="nepali">Nepali</option>
                          <option value="other">Other</option>
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
                        <select name="referralSource" className="form-select">
                          <option value="">Select option</option>
                          <option value="partner-organisation">
                            Partner organisation
                          </option>
                          <option value="carers-vic">Carers VIC</option>
                          <option value="carers-nsw">Carers NSW</option>
                          <option value="brotherhood-st-laurence">
                            Brotherhood St Laurence
                          </option>
                          <option value="other-carer-organisation">
                            Other carer organisation
                          </option>
                          <option value="whatsapp">WhatsApp group</option>
                          <option value="wechat">WeChat group</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          What brings you here?
                        </label>
                        <select name="reasonForJoining" className="form-select">
                          <option value="">Select reason</option>
                          <option value="recognise-skills">
                            To recognise my caregiving skills
                          </option>
                          <option value="employment-pathways">
                            To explore employment pathways
                          </option>
                          <option value="self-assessment">
                            To complete a self-assessment
                          </option>
                          <option value="certificate">
                            To receive a certificate
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Who do you care for?</label>
                        <select name="careRecipient" className="form-select">
                          <option value="">Select option</option>
                          <option value="parent">Parent</option>
                          <option value="child">Child</option>
                          <option value="relative">Relative</option>
                          <option value="friend">Friend</option>
                          <option value="partner">Partner</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Age of the person you are caring for
                        </label>
                        <select name="careRecipientAge" className="form-select">
                          <option value="">Select age range</option>
                          <option value="under-18">Under 18</option>
                          <option value="18-29">18-29</option>
                          <option value="30-40">30-40</option>
                          <option value="41-60">41-60</option>
                          <option value="61-80">61-80</option>
                          <option value="over-80">Over 80</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Which condition applies to the person you care for?
                        </label>
                        <select name="careCondition" className="form-select">
                          <option value="">Select condition</option>
                          <option value="dementia">Dementia</option>
                          <option value="palliative-care">
                            Palliative care
                          </option>
                          <option value="disability">Disability</option>
                          <option value="chronic-illness">Chronic illness</option>
                          <option value="age-related-frailty">
                            Age-related frailty
                          </option>
                          <option value="mental-health">
                            Mental health condition
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          How long have you cared for this person?
                        </label>
                        <select name="careDuration" className="form-select">
                          <option value="">Select duration</option>
                          <option value="less-than-1-year">
                            Less than 1 year
                          </option>
                          <option value="1-3-years">1-3 years</option>
                          <option value="3-5-years">3-5 years</option>
                          <option value="5-7-years">5-7 years</option>
                          <option value="7-10-years">7-10 years</option>
                          <option value="over-10-years">Over 10 years</option>
                        </select>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="form-check mb-3">
                      <input
                        name="termsAccepted"
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I accept the terms of service and privacy policy.
                      </label>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        name="researchConsent"
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

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Carer Account"}
                    </button>
                  </form>

                  <p className="text-center text-muted mt-4 mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary fw-semibold">
                      Login here
                    </a>
                  </p>
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
