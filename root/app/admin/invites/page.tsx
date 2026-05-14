"use client";

import { FormEvent, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  firstName: string;
  email: string;
  roles: string[];
};

type AdminInvite = {
  id: string;
  token: string;
  email: string | null;
  usedAt: string | null;
  expiresAt: string;
  createdAt: string;
};

export default function AdminInvitesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadInvites() {
    const response = await fetch("/api/admin/invites", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not load invites.");
      return;
    }

    setInvites(data.invites);
  }

  useEffect(() => {
    async function loadPage() {
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

        if (!currentUser.roles.includes("super_admin")) {
          window.location.href = "/admin/dashboard";
          return;
        }

        setUser(currentUser);
        await loadInvites();
      } catch {
        setError("Something went wrong loading invites.");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  async function handleCreateInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCreating(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.get("email"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not create invite.");
        return;
      }

      setSuccess("Admin invite created.");
      event.currentTarget.reset();
      await loadInvites();
    } catch {
      setError("Something went wrong creating invite.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading invites...</div>
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
          <div className="mb-4">
            <h1 className="fw-bold text-primary mb-1">Admin Invites</h1>
            <p className="text-muted mb-0">
              Create single-use invite tokens for approved admin users.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Create Invite</h5>

                  <form onSubmit={handleCreateInvite}>
                    <div className="mb-3">
                      <label className="form-label">
                        Email restriction optional
                      </label>
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="admin@example.com"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={creating}
                    >
                      {creating ? "Creating..." : "Create Invite Token"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Invite Tokens</h5>

                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Token</th>
                          <th>Status</th>
                          <th>Expires</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invites.map((invite) => {
                          const isExpired =
                            new Date(invite.expiresAt) < new Date();

                          return (
                            <tr key={invite.id}>
                              <td>{invite.email || "Any email"}</td>
                              <td>
                                <code>{invite.token}</code>
                              </td>
                              <td>
                                {invite.usedAt ? (
                                  <span className="badge bg-secondary">
                                    Used
                                  </span>
                                ) : isExpired ? (
                                  <span className="badge bg-danger">
                                    Expired
                                  </span>
                                ) : (
                                  <span className="badge bg-success">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td>
                                {new Date(invite.expiresAt).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        })}

                        {invites.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-muted">
                              No invites created yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-muted small mb-0">
                    Share the token privately with the approved admin. Tokens
                    expire and can only be used once.
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
