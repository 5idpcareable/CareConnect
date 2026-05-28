"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

type EmployerRequest = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  postcode: string;
  status: string;
  reviewedAt: string | null;
  createdAt: string;
};

type RequestFilter = "PENDING" | "ALL";

export default function EmployerRequestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<EmployerRequest[]>([]);
  const [filter, setFilter] = useState<RequestFilter>("PENDING");
  const [updatingId, setUpdatingId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadRequests() {
    const response = await fetch("/api/admin/employer-requests", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not load employer requests.");
      return;
    }

    setRequests(data.requests || []);
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
        setError("Something went wrong loading employer requests.");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "ALL") {
      return requests;
    }

    return requests.filter((request) => request.status === "PENDING");
  }, [requests, filter]);

  async function handleRequestAction(
    requestId: string,
    action: "approve" | "reject"
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(requestId);

    try {
      const response = await fetch("/api/admin/employer-requests", {
        method: "PATCH",
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
        setError(data.message || "Could not update employer request.");
        return;
      }

      setSuccess(data.message || "Employer request updated successfully.");
      await loadRequests();
    } catch {
      setError("Something went wrong updating employer request.");
    } finally {
      setUpdatingId("");
    }
  }

  function statusBadge(status: string) {
    if (status === "APPROVED") {
      return <span className="badge bg-success">Approved</span>;
    }

    if (status === "REJECTED") {
      return <span className="badge bg-danger">Rejected</span>;
    }

    return <span className="badge bg-warning text-dark">Pending</span>;
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading employer requests...
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
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">
                Employer Access Requests
              </h1>
              <p className="text-muted mb-0">
                Review employer signup requests before allowing certificate
                validation access.
              </p>
            </div>

            <Link href="/admin/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Requests</h4>
                  <p className="text-muted mb-0">
                    Approved employers will receive access through their login.
                  </p>
                </div>

                <div style={{ minWidth: "180px" }}>
                  <label className="form-label fw-semibold">View</label>
                  <select
                    className="form-select"
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value as RequestFilter)
                    }
                  >
                    <option value="PENDING">Pending only</option>
                    <option value="ALL">Show all</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Postcode</th>
                      <th>Status</th>
                      <th>Requested</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="fw-semibold">{request.companyName}</td>

                        <td>{request.contactName}</td>

                        <td>{request.email}</td>

                        <td>{request.phone}</td>

                        <td>{request.postcode}</td>

                        <td>{statusBadge(request.status)}</td>

                        <td>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                          {request.status === "PENDING" ? (
                            <div className="d-flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={updatingId === request.id}
                                onClick={() =>
                                  handleRequestAction(request.id, "approve")
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={updatingId === request.id}
                                onClick={() =>
                                  handleRequestAction(request.id, "reject")
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

                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-muted">
                          No employer requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-muted small mb-0">
                This keeps employer access controlled by the super admin instead
                of allowing open employer accounts.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}