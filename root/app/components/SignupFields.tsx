export default function SignupFields() {
  return (
    <>
      <h5 className="fw-bold mb-3">Account Details</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            name="firstName"
            type="text"
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input
            name="lastName"
            type="text"
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            required
            autoComplete="email"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone Number</label>
          <input
            name="phone"
            type="tel"
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Postcode</label>
          <input
            name="postcode"
            type="number"
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Repeat Password</label>
          <input
            name="repeatPassword"
            type="password"
            className="form-control"
            required
            autoComplete="new-password"
          />
        </div>
      </div>
    </>
  );
}
