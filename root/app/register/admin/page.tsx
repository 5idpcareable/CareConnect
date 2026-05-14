"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SignupFields from "../../components/SignupFields";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/access-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          dateOfBirth: formData.get("dateOfBirth"),
          postcode: formData.get("postcode"),
          password: formData.get("password"),
          repeatPassword: formData.get("repeatPassword"),
          termsAccepted: formData.get("termsAccepted") === "on",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Admin access request failed.");
        return;
      }

      router.push("/register/admin/pending");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
                    Request Admin Access
                  </h2>

                  <p className="text-muted mb-4">
                    Submit your details for review. A super admin must approve
                    your request before you can access the admin portal.
                  </p>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSignup}>
                    <SignupFields />

                    <hr className="my-4" />

                    <div className="form-check mb-4">
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

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? "Submitting Request..." : "Request Admin Access"}
                    </button>
                  </form>

                  <p className="text-center text-muted mt-4 mb-0">
                    Already approved?{" "}
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
