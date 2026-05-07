import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h4 className="fw-bold">CareAble</h4>
            <p className="text-white-50">
              Supporting hidden carers through skill recognition,
              self-assessment, and digital certification.
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="fw-bold">Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link href="/" className="text-white-50 text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-white-50 text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-white-50 text-decoration-none">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white-50 text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold">Project</h6>
            <p className="text-white-50 mb-1">La Trobe University</p>
            <p className="text-white-50 mb-1">ACAMI</p>
            <p className="text-white-50 mb-0">CareAble MVP</p>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold">Contact</h6>
            <p className="text-white-50 mb-1">Email: support@careable.com</p>
            <p className="text-white-50 mb-0">Australia-based platform</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-white-50">
          Copyright 2026 CareAble. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
