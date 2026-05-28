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

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

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

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);

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
        setProfileError(data.message || "Profile update failed.");
        return;
      }

      setUser(data.user);
      setProfileSuccess("Profile updated successfully.");
    } catch {
      setProfileError("Something went wrong updating your profile.");
    } finally {
      setSavingProfile(false);
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

      <style jsx>{`
        .profile-page {
          min-height: 75vh;
          background: #f5f7fb;
        }

        .profile-container {
          max-width: 940px;
        }

        .profile-card {
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          background: #ffffff;
        }

        .section-label {
          color: #62758a;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .locked-field {
          background: #f2f5f9;
        }

        .security-panel {
          border-top: 1px solid #e4ebf5;
          margin-top: 28px;
          padding-top: 26px;
        }

        .security-note {
          border: 1px solid #d8e7fc;
          border-radius: 8px;
          background: #f6faff;
          color: #52667a;
          font-size: 0.86rem;
          padding: 12px 14px;
        }

        .form-control {
          min-height: 44px;
        }
      `}</style>

      <main className="profile-page py-4 py-lg-5">
        <div className="container profile-container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
            <div>
              <div className="section-label mb-2">My Account</div>

              <h1 className="fw-bold text-primary mb-1">Profile Settings</h1>

              <p className="text-muted mb-0">
                Manage your personal details and password securely.
              </p>
            </div>

            <Link href="/carer/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          <section className="profile-card shadow-sm p-4 p-lg-5">
            <div className="mb-4">
              <h2 className="h4 fw-bold mb-1">Personal Details</h2>
              <p className="text-muted mb-0">
                Your email address and account role cannot be edited here.
              </p>
            </div>

            {profileError && (
              <div className="alert alert-danger">{profileError}</div>
            )}

            {profileSuccess && (
              <div className="alert alert-success">{profileSuccess}</div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    className="form-control"
                    defaultValue={user.firstName}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name</label>
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
                    className="form-control locked-field"
                    value={user.email}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Role</label>
                  <input
                    type="text"
                    className="form-control locked-field"
                    value={user.roles.join(", ")}
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
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>

            <section className="security-panel">
              <div className="row g-4">
                <div className="col-lg-5">
                  <div className="section-label mb-2">Security</div>

                  <h2 className="h4 fw-bold mb-2">Change Password</h2>

                  <p className="text-muted mb-3">
                    Update your password using your current password for
                    verification.
                  </p>

                  <div className="security-note">
                    After changing your password, your other active sessions
                    will be logged out.
                  </div>
                </div>

                <div className="col-lg-7">
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

                    <div className="row g-3">
                      <div className="col-md-6">
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

                      <div className="col-md-6">
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
                    </div>

                    <button
                      type="submit"
                      className="btn btn-outline-primary mt-4 px-4"
                      disabled={savingPassword}
                    >
                      {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}