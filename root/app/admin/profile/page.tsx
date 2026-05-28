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
  phone: string;
  dateOfBirth: string;
  postcode: string;
  roles: string[];
};

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [detailsError, setDetailsError] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function loadAdmin() {
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
        const currentUser: User | null = data.user;

        if (!currentUser) {
          window.location.href = "/login";
          return;
        }

        const canAccessAdmin =
          currentUser.roles.includes("admin") ||
          currentUser.roles.includes("super_admin");

        if (!canAccessAdmin) {
          window.location.href = "/carer/dashboard";
          return;
        }

        setUser(currentUser);
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  async function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setDetailsError("");
    setDetailsSuccess("");
    setSavingDetails(true);

    const formData = new FormData(event.currentTarget);

    try {
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

      if (!response.ok) {
        setDetailsError(data.message || "Account details update failed.");
        return;
      }

      setUser(data.user);
      setDetailsSuccess("Account details updated successfully.");
    } catch {
      setDetailsError("Something went wrong updating your account details.");
    } finally {
      setSavingDetails(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setPasswordError("");
    setPasswordSuccess("");
    setSavingPassword(true);

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.get("currentPassword"),
          newPassword: formData.get("newPassword"),
          repeatPassword: formData.get("repeatPassword"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || "Password change failed.");
        return;
      }

      form.reset();
      setPasswordSuccess("Password changed successfully.");
    } catch {
      setPasswordError("Something went wrong changing your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading account settings...
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const isSuperAdmin = user.roles.includes("super_admin");

  return (
    <>
      <Navbar />

      <style jsx>{`
        .settings-page {
          min-height: 76vh;
          background: #f5f7fb;
        }

        .settings-container {
          max-width: 1040px;
        }

        .settings-card {
          background: #ffffff;
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          padding: 28px;
        }

        .section-label {
          color: #62758a;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .role-badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.36rem 0.8rem;
          color: #ffffff;
          background: #172b4d;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .locked-input {
          background: #f2f5f9;
          color: #52667a;
        }

        .security-card {
          background: #ffffff;
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          padding: 28px;
          height: 100%;
        }

        .security-note {
          color: #52667a;
          background: #f6faff;
          border: 1px solid #dce8f9;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 0.85rem;
        }

        .form-control {
          min-height: 45px;
        }

        @media (max-width: 767px) {
          .settings-card,
          .security-card {
            padding: 20px;
          }
        }
      `}</style>

      <main className="settings-page py-4 py-lg-5">
        <div className="container settings-container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
            <div>
              <div className="section-label mb-2">Administration</div>

              <h1 className="fw-bold text-primary mb-1">Account Settings</h1>

              <p className="text-muted mb-0">
                Manage your administrator profile and password securely.
              </p>
            </div>

            <Link href="/admin/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <section className="settings-card shadow-sm h-100">
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-4">
                  <div>
                    <div className="section-label mb-2">Profile</div>
                    <h2 className="h4 fw-bold mb-1">Personal Details</h2>
                    <p className="text-muted mb-0">
                      Update the information attached to your account.
                    </p>
                  </div>

                  <div>
                    <span className="role-badge">
                      {isSuperAdmin ? "Super Admin" : "Admin"}
                    </span>
                  </div>
                </div>

                {detailsError && (
                  <div className="alert alert-danger">{detailsError}</div>
                )}

                {detailsSuccess && (
                  <div className="alert alert-success">{detailsSuccess}</div>
                )}

                <form onSubmit={handleDetailsSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        First Name
                      </label>

                      <input
                        name="firstName"
                        type="text"
                        className="form-control"
                        defaultValue={user.firstName}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Last Name
                      </label>

                      <input
                        name="lastName"
                        type="text"
                        className="form-control"
                        defaultValue={user.lastName}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email</label>

                      <input
                        type="email"
                        className="form-control locked-input"
                        value={user.email}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Access Level
                      </label>

                      <input
                        type="text"
                        className="form-control locked-input"
                        value={isSuperAdmin ? "Super Admin" : "Admin"}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>

                      <input
                        name="phone"
                        type="tel"
                        className="form-control"
                        defaultValue={user.phone || ""}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Date of Birth
                      </label>

                      <input
                        name="dateOfBirth"
                        type="date"
                        className="form-control"
                        defaultValue={user.dateOfBirth || ""}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Postcode</label>

                      <input
                        name="postcode"
                        type="text"
                        className="form-control"
                        defaultValue={user.postcode || ""}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-4 px-4"
                    disabled={savingDetails}
                  >
                    {savingDetails ? "Saving..." : "Save Account Details"}
                  </button>
                </form>
              </section>
            </div>

            <div className="col-lg-5">
              <section className="security-card shadow-sm">
                <div className="section-label mb-2">Security</div>

                <h2 className="h4 fw-bold mb-2">Change Password</h2>

                <p className="text-muted mb-3">
                  Verify your current password before setting a new one.
                </p>

                <div className="security-note mb-4">
                  Changing your password signs out any other active sessions on
                  your account.
                </div>

                {passwordError && (
                  <div className="alert alert-danger">{passwordError}</div>
                )}

                {passwordSuccess && (
                  <div className="alert alert-success">{passwordSuccess}</div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Current Password
                    </label>

                    <input
                      name="currentPassword"
                      type="password"
                      className="form-control"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>

                    <input
                      name="newPassword"
                      type="password"
                      className="form-control"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm New Password
                    </label>

                    <input
                      name="repeatPassword"
                      type="password"
                      className="form-control"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-outline-primary px-4"
                    disabled={savingPassword}
                  >
                    {savingPassword ? "Updating..." : "Change Password"}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}