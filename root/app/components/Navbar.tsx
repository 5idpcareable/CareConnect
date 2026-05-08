"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: string;
  roleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setCheckedAuth(true);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    window.location.href = "/";
  }

  const isLoggedIn = checkedAuth && user;

  return (
    <nav className="bg-white shadow-sm sticky-top">
      <div className="container py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <Link className="fw-bold text-primary text-decoration-none fs-5" href="/">
          CareAble
        </Link>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <Link className="text-decoration-none text-dark" href="/">
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <a className="text-decoration-none text-dark" href="/#about">
                About
              </a>

              <a className="text-decoration-none text-dark" href="/#features">
                Features
              </a>

              <a className="text-decoration-none text-dark" href="/#contact">
                Contact
              </a>

              <Link className="btn btn-outline-primary px-4" href="/login">
                Login
              </Link>

              <Link className="btn btn-primary px-4" href="/register">
                Register
              </Link>
            </>
          )}

          {isLoggedIn && user && (
            <>
              <Link
                className="text-decoration-none text-dark"
                href="/carer/dashboard"
              >
                Dashboard
              </Link>

              <Link
                className="text-decoration-none text-dark"
                href="/carer/profile"
              >
                Profile
              </Link>

              <Link
                className="text-decoration-none text-dark"
                href="/register/carer/assessment"
              >
                Assessment
              </Link>

              <span className="text-muted small">{user.firstName}</span>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
