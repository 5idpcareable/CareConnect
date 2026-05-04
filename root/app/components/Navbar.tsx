export default function Navbar() {
  return (
    <nav className="navbar bg-white shadow-sm sticky-top">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand fw-bold text-primary mb-0" href="/">
          CareAble
        </a>

        <div className="d-flex align-items-center gap-3">
          <a className="nav-link d-none d-md-block" href="/">
            Home
          </a>

          <a className="nav-link d-none d-md-block" href="#about">
            About
          </a>

          <a className="nav-link d-none d-md-block" href="#features">
            Features
          </a>

          <a className="nav-link d-none d-md-block" href="#contact">
            Contact
          </a>

          <a className="btn btn-outline-primary px-4" href="/login">
            Login
          </a>

          <a className="btn btn-primary px-4" href="/register">
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}