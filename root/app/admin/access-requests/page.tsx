"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  firstName: string;
  email: string;
  roles: string[];
};

type AdminAccessRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  postcode: string;
  status: string;
  reviewedAt: string | null;
  createdAt: string;
};

export default function AdminAccessRequestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<AdminAccessRequest[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState("");

  async function loadRequests() {
    const response = await fetch("/api/admin/access-requests", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not load admin access requests.");
      return;
    }

    setRequests(data.requests);
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
        await loadRequests();
      } catch {
        setError("Something went wrong loading admin access requests.");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  async function reviewRequest(requestId: string, action: "APPROVE" | "REJECT") {
    setError("");
    setSuccess("");
    setReviewingId(requestId);

    try {
      const response = await fetch("/api/admin/access-requests/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          requestId,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not review request.");
        return;
      }

      setSuccess(data.message || "Request reviewed.");
      await loadRequests();
    } catch {
      setError("Something went wrong reviewing request.");
    } finally {
      setReviewingId("");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading admin access requests...
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

  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="mb-4">
            <h1 className="fw-bold text-primary mb-1">
              Admin Access Requests
            </h1>
            <p className="text-muted mb-0">
              Review pending admin account requests. Approval creates an active
              admin account.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Postcode</th>
                      <th>Status</th>
                      <th>Requested</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          {request.firstName} {request.lastName}
                        </td>
                        <td>{request.email}</td>
                        <td>{request.phone}</td>
                        <td>{request.postcode}</td>
                        <td>
                          {request.status === "PENDING" && (
                            <span className="badge bg-warning text-dark">
                              Pending
                            </span>
                          )}

                          {request.status === "APPROVED" && (
                            <span className="badge bg-success">
                              Approved
                            </span>
                          )}

                          {request.status === "REJECTED" && (
                            <span className="badge bg-danger">Rejected</span>
                          )}
                        </td>
                        <td>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {request.status === "PENDING" ? (
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                disabled={reviewingId === request.id}
                                onClick={() =>
                                  reviewRequest(request.id, "APPROVE")
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                disabled={reviewingId === request.id}
                                onClick={() =>
                                  reviewRequest(request.id, "REJECT")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">
                              Reviewed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-muted">
                          No admin access requests yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-muted small mb-0">
                Only super admins can approve admin access requests.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
