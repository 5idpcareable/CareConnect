"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

type NavItem = {
  label: string;
  href: string;
};

const publicLinks: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const carerLinks: NavItem[] = [
  { label: "Dashboard", href: "/carer/dashboard" },
  { label: "Profile", href: "/carer/profile" },
  { label: "Assessment", href: "/carer/assessment" },
  { label: "Certificate", href: "/carer/certificate" },
];

const adminLinks: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Questionnaires", href: "/admin/questionnaires" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Account", href: "/admin/profile" },
];

const employerLinks: NavItem[] = [
  { label: "Certificate Validation", href: "/employer/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [navbarSolid, setNavbarSolid] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
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

    function handleScroll() {
      setNavbarSolid(window.scrollY > 10);
    }

    checkAuth();
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleResize() {
      if (window.innerWidth >= 992) {
        setMobileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/";
    }
  }

  function isCurrentPage(href: string) {
    const pagePath = href.split("#")[0];

    if (href === "/#home") {
      return pathname === "/";
    }

    if (href.includes("#")) {
      return false;
    }

    return pathname === pagePath || pathname.startsWith(`${pagePath}/`);
  }

  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("super_admin");

  const isEmployer = !isAdmin && user?.roles.includes("employer");

  const isCarer = !isAdmin && !isEmployer && user?.roles.includes("carer");

  let navigationLinks = publicLinks;

  if (isAdmin) {
    navigationLinks = adminLinks;
  } else if (isEmployer) {
    navigationLinks = employerLinks;
  } else if (isCarer) {
    navigationLinks = carerLinks;
  }

  return (
    <>
      <style jsx>{`
        .careable-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(22px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.82);
          transition:
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .careable-nav.scrolled,
        .careable-nav.open {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 9px 28px rgba(15, 23, 42, 0.06);
        }

        .nav-shell {
          max-width: 1240px;
        }

        .nav-row {
          min-height: 76px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #13243d;
          font-size: 1.24rem;
          font-weight: 750;
          text-decoration: none;
          white-space: nowrap;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #ffffff;
          background: #2563eb;
          font-size: 1.05rem;
          font-weight: 800;
          box-shadow: 0 9px 19px rgba(37, 99, 235, 0.2);
        }

        .brand-word span {
          color: #2563eb;
        }

        .desktop-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-item-link {
          position: relative;
          padding: 13px 0;
          color: #52657b;
          font-size: 0.93rem;
          font-weight: 550;
          text-decoration: none;
          transition: color 0.18s ease;
        }

        .nav-item-link:hover,
        .nav-item-link.active {
          color: #2563eb;
        }

        .nav-item-link.active {
          font-weight: 650;
        }

        .nav-item-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 3px;
          height: 2px;
          border-radius: 999px;
          background: #2563eb;
          opacity: 0;
          transform: translateY(4px);
          transition:
            opacity 0.18s ease,
            transform 0.18s ease;
        }

        .nav-item-link:hover::after,
        .nav-item-link.active::after {
          opacity: 1;
          transform: translateY(0);
        }

        .desktop-actions {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .user-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 4px 14px 4px 5px;
          border-radius: 999px;
          color: #475569;
          background: #f5f8fd;
          border: 1px solid #e2eaf6;
          font-size: 0.89rem;
          font-weight: 600;
        }

        .user-initial {
          width: 31px;
          height: 31px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #2563eb;
          background: #e4eeff;
          font-size: 0.79rem;
          font-weight: 800;
        }

        .login-action,
        .register-action,
        .logout-action {
          min-height: 43px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 9px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition:
            color 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            transform 0.18s ease;
        }

        .login-action {
          color: #2563eb;
          background: transparent;
          border: 1px solid #d1ddf2;
        }

        .login-action:hover {
          color: #2563eb;
          background: #f5f9ff;
          border-color: #b9d0ff;
        }

        .register-action {
          color: #ffffff;
          background: #2563eb;
          border: 1px solid #2563eb;
          box-shadow: 0 8px 18px rgba(37, 99, 235, 0.16);
        }

        .register-action:hover {
          color: #ffffff;
          background: #1d4ed8;
          border-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
        }

        .logout-action {
          color: #64748b;
          background: transparent;
          border: 1px solid #dce5f1;
        }

        .logout-action:hover {
          color: #b42318;
          background: #fff5f5;
          border-color: #fecaca;
        }

        .logout-action:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-placeholder {
          width: 164px;
          height: 43px;
          border-radius: 9px;
          background: #f1f5f9;
        }

        .hamburger {
          display: none;
          position: relative;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          border: 1px solid #dae5f4;
          border-radius: 10px;
          background: #ffffff;
          transition:
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .hamburger:hover,
        .hamburger.open {
          background: #f3f8ff;
          border-color: #c5d8ff;
        }

        .hamburger-lines {
          position: relative;
          width: 20px;
          height: 16px;
          display: block;
        }

        .hamburger-lines span {
          position: absolute;
          left: 0;
          width: 20px;
          height: 2px;
          border-radius: 999px;
          background: #2563eb;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease,
            top 0.2s ease;
        }

        .hamburger-lines span:nth-child(1) {
          top: 0;
        }

        .hamburger-lines span:nth-child(2) {
          top: 7px;
        }

        .hamburger-lines span:nth-child(3) {
          top: 14px;
        }

        .hamburger.open .hamburger-lines span:nth-child(1) {
          top: 7px;
          transform: rotate(45deg);
        }

        .hamburger.open .hamburger-lines span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open .hamburger-lines span:nth-child(3) {
          top: 7px;
          transform: rotate(-45deg);
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 991px) {
          .nav-row {
            min-height: 68px;
          }

          .desktop-links,
          .desktop-actions {
            display: none;
          }

          .hamburger {
            display: inline-flex;
          }

          .mobile-menu {
            display: block;
            padding: 0 0 16px;
            animation: menuEnter 0.18s ease;
          }

          .mobile-menu-inner {
            border: 1px solid #e3ebf7;
            border-radius: 14px;
            background: #ffffff;
            padding: 10px;
            box-shadow: 0 15px 32px rgba(15, 23, 42, 0.08);
          }

          .mobile-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 9px 15px;
            margin-bottom: 6px;
            border-bottom: 1px solid #edf2f8;
          }

          .mobile-profile .user-initial {
            width: 37px;
            height: 37px;
          }

          .profile-name {
            color: #14263d;
            font-size: 0.94rem;
            font-weight: 700;
          }

          .profile-role {
            color: #64748b;
            font-size: 0.79rem;
          }

          .mobile-links {
            display: grid;
            gap: 4px;
            padding: 4px 0;
          }

          .mobile-link {
            min-height: 46px;
            display: flex;
            align-items: center;
            padding: 0 13px;
            border-radius: 9px;
            color: #52657b;
            font-size: 0.94rem;
            font-weight: 600;
            text-decoration: none;
            transition:
              color 0.18s ease,
              background 0.18s ease;
          }

          .mobile-link:hover,
          .mobile-link.active {
            color: #2563eb;
            background: #f2f7ff;
          }

          .mobile-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding-top: 10px;
            margin-top: 7px;
            border-top: 1px solid #edf2f8;
          }

          .mobile-actions.signed-in {
            grid-template-columns: 1fr;
          }

          .mobile-actions .login-action,
          .mobile-actions .register-action,
          .mobile-actions .logout-action {
            width: 100%;
          }
        }

        @media (max-width: 575px) {
          .brand {
            gap: 8px;
            font-size: 1.1rem;
          }

          .brand-mark {
            width: 35px;
            height: 35px;
            border-radius: 10px;
          }

          .hamburger {
            width: 40px;
            height: 40px;
          }
        }

        @keyframes menuEnter {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav
        className={`careable-nav ${navbarSolid ? "scrolled" : ""} ${
          mobileOpen ? "open" : ""
        }`}
      >
        <div className="container position-relative nav-shell">
          <div className="nav-row d-flex align-items-center justify-content-between gap-3">
            <Link href="/" className="brand">
              <span className="brand-mark">C</span>

              <span className="brand-word">
                Care<span>Able</span>
              </span>
            </Link>

            <div className="desktop-links">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`nav-item-link ${
                    isCurrentPage(link.href) ? "active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="desktop-actions">
              {!checkedAuth && <div className="auth-placeholder" />}

              {checkedAuth && !user && (
                <>
                  <Link href="/login" className="login-action">
                    Login
                  </Link>

                  <Link href="/register" className="register-action">
                    Register
                  </Link>
                </>
              )}

              {checkedAuth && user && (
                <>
                  <span className="user-pill">
                    <span className="user-initial">
                      {user.firstName.slice(0, 1).toUpperCase()}
                    </span>

                    {user.firstName}
                  </span>

                  <button
                    type="button"
                    className="logout-action"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Leaving..." : "Logout"}
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className={`hamburger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <span className="hamburger-lines">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          {mobileOpen && (
            <div className="mobile-menu" id="mobile-navigation">
              <div className="mobile-menu-inner">
                {checkedAuth && user && (
                  <div className="mobile-profile">
                    <span className="user-initial">
                      {user.firstName.slice(0, 1).toUpperCase()}
                    </span>

                    <div>
                      <div className="profile-name">
                        {user.firstName} {user.lastName}
                      </div>

                      <div className="profile-role">
                        {isAdmin
                          ? "Admin Account"
                          : isEmployer
                          ? "Employer Account"
                          : "Carer Account"}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mobile-links">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`mobile-link ${
                        isCurrentPage(link.href) ? "active" : ""
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {checkedAuth && !user && (
                  <div className="mobile-actions">
                    <Link
                      href="/login"
                      className="login-action"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      className="register-action"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}

                {checkedAuth && user && (
                  <div className="mobile-actions signed-in">
                    <button
                      type="button"
                      className="logout-action"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? "Leaving..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}