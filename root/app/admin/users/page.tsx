"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type RoleFilter = "all" | "carer" | "admin" | "super_admin" | "employer";
type PageSize = "5" | "10" | "15" | "all";

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  createdAt: string;
  roles: string[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function roleBadgeClass(role: string) {
  if (role === "super_admin") {
    return "bg-dark";
  }

  if (role === "admin") {
    return "bg-primary";
  }

  if (role === "employer") {
    return "bg-info text-dark";
  }

  return "bg-success";
}

function roleLabel(role: string) {
  if (role === "super_admin") {
    return "Super Admin";
  }

  if (role === "admin") {
    return "Admin";
  }

  if (role === "employer") {
    return "Employer";
  }

  return "Carer";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [pageSize, setPageSize] = useState<PageSize>("5");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Could not load users.");
          return;
        }

        setUsers(data.users || []);
      } catch {
        setError("Something went wrong loading users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.postcode.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.roles.includes(roleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalItems = filteredUsers.length;
  const pageSizeNumber =
    pageSize === "all" ? Math.max(totalItems, 1) : Number(pageSize);
  const totalPages =
    pageSize === "all" ? 1 : Math.max(1, Math.ceil(totalItems / pageSizeNumber));

  const paginatedUsers =
    pageSize === "all"
      ? filteredUsers
      : filteredUsers.slice((page - 1) * pageSizeNumber, page * pageSizeNumber);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const carerCount = users.filter((user) => user.roles.includes("carer")).length;
  const adminCount = users.filter(
    (user) => user.roles.includes("admin") || user.roles.includes("super_admin")
  ).length;
  const employerCount = users.filter((user) =>
    user.roles.includes("employer")
  ).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading users...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">User Management</h1>
              <p className="text-muted mb-0">
                View registered users with search, role filters, and account
                details.
              </p>
            </div>

            <Link href="/admin/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">Total Users</small>
                  <div className="display-6 fw-bold text-primary">
                    {users.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">Carers</small>
                  <div className="display-6 fw-bold text-success">
                    {carerCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">Admins</small>
                  <div className="display-6 fw-bold text-primary">
                    {adminCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <small className="text-muted">Employers</small>
                  <div className="display-6 fw-bold text-info">
                    {employerCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Registered Users</h4>
                  <p className="text-muted mb-0">
                    Search by name, email, phone, or postcode.
                  </p>
                </div>

                <div className="d-flex flex-column flex-md-row gap-2">
                  <div style={{ minWidth: "260px" }}>
                    <label className="form-label fw-semibold">Search</label>
                    <input
                      className="form-control"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search users"
                    />
                  </div>

                  <div style={{ minWidth: "180px" }}>
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={roleFilter}
                      onChange={(event) => {
                        setRoleFilter(event.target.value as RoleFilter);
                        setPage(1);
                      }}
                    >
                      <option value="all">All roles</option>
                      <option value="carer">Carer</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>

                  <div style={{ minWidth: "120px" }}>
                    <label className="form-label fw-semibold">Show</label>
                    <select
                      className="form-select"
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(event.target.value as PageSize);
                        setPage(1);
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Roles</th>
                      <th>Phone</th>
                      <th>Postcode</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id}>
                        <td style={{ minWidth: "260px" }}>
                          <div className="fw-semibold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span
                                key={role}
                                className={`badge ${roleBadgeClass(role)}`}
                              >
                                {roleLabel(role)}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>{user.phone}</td>
                        <td>{user.postcode}</td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}

                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-muted">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length > 0 && pageSize !== "all" && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    Page {page} of {totalPages}
                  </small>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={page <= 1}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={page >= totalPages}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}