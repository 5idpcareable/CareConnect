import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roles = [
  {
    id: 1,
    title: "Carer",
    description:
      "Complete onboarding and access caregiving skill assessments.",
    href: "/register/carer?role=1",
    button: "Continue as Carer",
  },
  {
    id: 2,
    title: "Admin",
    description:
      "Manage users, assessments, roles, certificates, and dashboard data.",
    href: "/register/admin?role=2",
    button: "Continue as Admin",
  },
  {
    id: 3,
    title: "Employer",
    description:
      "Validate certificates and view recognised caregiving skills.",
    href: "/register/employer?role=3",
    button: "Continue as Employer",
  },
];

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary">
              Create Your CareAble Account
            </h1>
            <p className="text-muted">
              Select your role to continue with the correct onboarding form.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {roles.map((role) => (
              <div className="col-md-4" key={role.id}>
                <div className="card border-0 shadow rounded-4 h-100">
                  <div className="card-body p-4 text-center d-flex flex-column">
                    <div className="mb-3">
                      <span className="badge bg-primary rounded-pill">
                        Role ID: {role.id}
                      </span>
                    </div>

                    <h3 className="fw-bold">{role.title}</h3>

                    <p className="text-muted flex-grow-1">
                      {role.description}
                    </p>

                    <Link
                      href={role.href}
                      className="btn btn-outline-primary w-100"
                    >
                      {role.button}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p className="text-muted mb-2">Already have an account?</p>
            <Link href="/login" className="btn btn-primary px-4">
              Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
