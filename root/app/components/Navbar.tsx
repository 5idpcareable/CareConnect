"use client";

import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

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

  function goToPage(href: string) {
    setMobileOpen(false);

    if (href.includes("#")) {
      window.location.href = href;
      return;
    }

    router.push(href);
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
          background: rgba(255, 255, 255, 0.94);
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

        .logo-button {
          border: 0;
          background: transparent;
          padding: 0;
          display: inline-flex;
          align-items: center;
        }

        .logo-text {
          color: #10233f;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1;
        }

        .logo-text span {
          color: #2563eb;
        }

        .desktop-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-button {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border: 1px solid #dce7f6;
          border-radius: 10px;
          color: #52657b;
          background: #ffffff;
          font-size: 0.91rem;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          transition:
            color 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            transform 0.18s ease;
        }

        .nav-button:hover {
          color: #2563eb;
          border-color: #bfd2ff;
          background: #f6faff;
          box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
          transform: translateY(-1px);
        }

        .nav-button-active {
          color: #ffffff;
          background: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 9px 18px rgba(37, 99, 235, 0.2);
        }

        .nav-button-active:hover {
          color: #ffffff;
          background: #1d4ed8;
          border-color: #1d4ed8;
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
          font-weight: 700;
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
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
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
          background: #ffffff;
          border: 1px solid #cbdcf8;
        }

        .login-action:hover {
          color: #2563eb;
          background: #f5f9ff;
          border-color: #b9d0ff;
          transform: translateY(-1px);
        }

        .register-action {
          color: #ffffff;
          background: #f59e0b;
          border: 1px solid #f59e0b;
          box-shadow: 0 8px 18px rgba(245, 158, 11, 0.18);
        }

        .register-action:hover {
          color: #ffffff;
          background: #d97706;
          border-color: #d97706;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(245, 158, 11, 0.24);
        }

        .logout-action {
          color: #64748b;
          background: #ffffff;
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
          border-radius: 10px;
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
            font-weight: 800;
          }

          .profile-role {
            color: #64748b;
            font-size: 0.79rem;
          }

          .mobile-links {
            display: grid;
            gap: 6px;
            padding: 4px 0;
          }

          .mobile-nav-button {
            width: 100%;
            min-height: 46px;
            display: flex;
            align-items: center;
            padding: 0 13px;
            border: 0;
            border-radius: 10px;
            color: #52657b;
            background: #f8fbff;
            font-size: 0.94rem;
            font-weight: 700;
            text-align: left;
            transition:
              color 0.18s ease,
              background 0.18s ease;
          }

          .mobile-nav-button:hover,
          .mobile-nav-button-active {
            color: #ffffff;
            background: #2563eb;
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
          .logo-text {
            font-size: 1.2rem;
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
            <button
              type="button"
              className="logo-button"
              onClick={() => goToPage("/")}
              aria-label="Go to CareAble home"
            >
              <span className="logo-text">
                Care<span>Able</span>
              </span>
            </button>

            <div className="desktop-links">
              {navigationLinks.map((link) => {
                const isActive = isCurrentPage(link.href);

                return (
                  <button
                    key={link.label}
                    type="button"
                    className={`nav-button ${
                      isActive ? "nav-button-active" : ""
                    }`}
                    onClick={() => goToPage(link.href)}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="desktop-actions">
              {!checkedAuth && <div className="auth-placeholder" />}

              {checkedAuth && !user && (
                <>
                  <button
                    type="button"
                    className="login-action"
                    onClick={() => goToPage("/login")}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="register-action"
                    onClick={() => goToPage("/register")}
                  >
                    Register
                  </button>
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
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
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
                  {navigationLinks.map((link) => {
                    const isActive = isCurrentPage(link.href);

                    return (
                      <button
                        key={link.label}
                        type="button"
                        className={`mobile-nav-button ${
                          isActive ? "mobile-nav-button-active" : ""
                        }`}
                        onClick={() => goToPage(link.href)}
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </div>

                {checkedAuth && !user && (
                  <div className="mobile-actions">
                    <button
                      type="button"
                      className="login-action"
                      onClick={() => goToPage("/login")}
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className="register-action"
                      onClick={() => goToPage("/register")}
                    >
                      Register
                    </button>
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