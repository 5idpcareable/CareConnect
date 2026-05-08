"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  roleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  postcode?: string;
  roles: string[];
};

export default function CarerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!data.user) {
          window.location.href = "/login";
          return;
        }

        setUser(data.user);
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        dateOfBirth: formData.get("dateOfBirth"),
        postcode: formData.get("postcode"),
      }),
    });

    const data = await response.json();

    setSaving(false);

    if (!response.ok) {
      setError(data.message || "Profile update failed.");
      return;
    }

    setUser(data.user);
    setSuccess("Profile updated successfully.");
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading profile...</div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="mb-4">
                <h1 className="fw-bold text-primary mb-1">
                  Edit Account Details
                </h1>
                <p className="text-muted mb-0">
                  Update your personal details. Your email and role are locked
                  for account security.
                </p>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  {error && <div className="alert alert-danger">{error}</div>}

                  {success && (
                    <div className="alert alert-success">{success}</div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input
                          name="firstName"
                          type="text"
                          className="form-control"
                          defaultValue={user.firstName}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                          name="lastName"
                          type="text"
                          className="form-control"
                          defaultValue={user.lastName}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={user.email}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Role</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.roles.join(", ")}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          name="phone"
                          type="tel"
                          className="form-control"
                          defaultValue={user.phone || ""}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Date of Birth</label>
                        <input
                          name="dateOfBirth"
                          type="date"
                          className="form-control"
                          defaultValue={user.dateOfBirth || ""}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Postcode</label>
                        <input
                          name="postcode"
                          type="number"
                          className="form-control"
                          defaultValue={user.postcode || ""}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>

                      <Link
                        href="/carer/dashboard"
                        className="btn btn-outline-secondary"
                      >
                        Back to Dashboard
                      </Link>
                    </div>
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
