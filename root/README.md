# CareAble

CareAble is a web-based platform that supports hidden unpaid carers through skill recognition, self-assessment, digital certification, and certificate validation. The system helps carers identify the skills they have developed through caregiving and provides a verified certificate that can be validated by employers or other users.

CareAble includes role-based access for carers, admins, super admins, and employers. Carers can register, complete assessments, view results, and generate certificates. Admins can manage questionnaires, domains, questions, assessments, users, certificates, and analytics. Super admins can approve admin and employer access requests. Employers can validate certificates using a certificate ID, QR code, uploaded image, or uploaded PDF.

> Built with Next.js App Router, React, TypeScript, Prisma, SQLite, Bootstrap 5, QR code generation, QR scanning, and PDF certificate reading.

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/5idpcareable/CareConnect.git
cd CareConnect/root
npm install
```

All setup commands below should be run from inside the `CareConnect/root` folder.

### 2. Create Environment File

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Run Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Seed default roles:

```bash
npx tsx prisma/seed.ts
```

### 4. Create a Super Admin

Create the first super admin account:

```bash
npx tsx prisma/create-super-admin.ts admin@example.com Password123
```

You can replace `admin@example.com` and `Password123` with your own email and password.

### 5. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## Implemented Features

### Authentication and Security

- Email and password login
- Role-based redirects after login
- HTTP-only session cookie
- 20-minute idle session expiry
- Password reset flow
- Change password option
- Passwords stored as hashes

### Role-Based Access

- Carer dashboard
- Admin dashboard
- Super admin review tools
- Employer certificate validation portal
- Protected pages based on user role

### Carer Features

- Carer registration and onboarding
- Edit profile details
- Complete skill assessment
- Save assessment progress
- Take assessment multiple times
- View generated certificate
- View QR verification link

### Admin and Super Admin Features

- Manage users
- Manage questionnaires
- Create assessment domains
- Create assessment questions
- Edit, hide, show, and soft delete questions
- Review assessment attempts
- Validate certificates
- View analytics and reporting
- Approve admin access requests
- Approve employer access requests

### Employer Features

- Employer access request
- Certificate validation dashboard
- Validate certificate by ID
- Upload certificate as PDF or image
- Scan QR code from uploaded certificate
- View certificate holder and domain score details

### Certificate and Verification Features

- Certificate generated from completed assessment results
- QR code included on certificate
- Public certificate verification page
- Domain outcome summary
- Employer upload validation

### Analytics Features

- Capability heatmap
- Ridgeline chart
- Outcome matrix
- Domain-based reporting
- Assessment completion insights

---

## Project Structure

```text
root/
|
|-- app/
|   |-- admin/                     Admin and super admin pages
|   |-- api/                       API route handlers
|   |-- carer/                     Carer dashboard, profile, assessment, certificate
|   |-- components/                Shared Navbar, Footer, styles, analytics components
|   |-- employer/                  Employer certificate validation dashboard
|   |-- forgot-password/           Forgot password page
|   |-- generated/prisma/          Generated Prisma client
|   |-- lib/                       Authentication, Prisma, and database helpers
|   |-- login/                     Login page
|   |-- register/                  Role-based registration pages
|   |-- reset-password/            Reset password page
|   |-- verify/[certificateId]/    Public certificate verification page
|   |-- globals.css                Global styles
|   |-- layout.tsx                 Root layout
|   |-- page.tsx                   Landing page
|
|-- prisma/
|   |-- migrations/                Prisma migration files
|   |-- create-admin-invite.ts     Admin invite helper script
|   |-- create-super-admin.ts      Super admin creation script
|   |-- schema.prisma              Prisma database schema
|   |-- seed.ts                    Default role seed script
|
|-- public/                        Static files
|-- docs/                          Documentation and diagrams
|-- package.json                   Project scripts and dependencies
|-- prisma.config.ts               Prisma configuration
|-- tsconfig.json                  TypeScript configuration
|-- README.md                      Project setup and documentation
```

---

## Key Screens and Routes

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/login` | Login page |
| `/register` | Role selection page |
| `/register/carer` | Carer registration page |
| `/register/admin` | Admin access request page |
| `/register/employer` | Employer access request page |
| `/forgot-password` | Forgot password page |
| `/reset-password` | Reset password page |
| `/carer/dashboard` | Carer dashboard |
| `/carer/profile` | Carer profile and password change |
| `/carer/assessment` | Carer self-assessment page |
| `/carer/certificate` | Carer certificate page |
| `/admin/dashboard` | Admin dashboard |
| `/admin/questionnaires` | Questionnaire builder |
| `/admin/users` | User management |
| `/admin/assessments` | Assessment review |
| `/admin/analytics` | Analytics and reporting |
| `/admin/access-requests` | Admin approval requests |
| `/admin/employer-requests` | Employer approval requests |
| `/admin/validate` | Certificate validation page |
| `/employer/dashboard` | Employer certificate validation portal |
| `/verify/[certificateId]` | Public certificate verification page |

---

## Built With

- Next.js App Router
- React
- TypeScript
- Bootstrap 5
- Prisma ORM
- SQLite
- qrcode
- qr-scanner
- pdfjs-dist

---

## Default Roles

| Role ID | Role Name |
|---|---|
| 1 | carer |
| 2 | admin |
| 3 | employer |
| 4 | super_admin |

---

## Useful Commands

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

Open Prisma Studio:

```bash
npx prisma studio
```

Create a new Prisma migration:

```bash
npx prisma migrate dev --name migration_name
```

Regenerate Prisma client:

```bash
npx prisma generate
```

Seed roles:

```bash
npx tsx prisma/seed.ts
```

Create super admin:

```bash
npx tsx prisma/create-super-admin.ts admin@example.com Password123
```

---

## Database Notes

The project uses Prisma with SQLite for local MVP development. The main entities include:

- User
- Role
- UserRole
- Session
- PasswordResetToken
- CarerProfile
- Questionnaire
- AssessmentDomain
- AssessmentQuestion
- AssessmentAttempt
- AssessmentResponse
- AdminInvite
- AdminAccessRequest
- EmployerAccessRequest

Certificates are generated from completed assessment attempts and responses. They are not stored as a separate database table in the current MVP.

---

## Testing Checklist

Before submitting or demonstrating the project, test the following:

- Carer registration
- Admin access request
- Employer access request
- Super admin approval workflow
- Login and logout
- Role-based dashboard redirects
- Session expiry
- Password reset
- Change password
- Questionnaire creation
- Domain creation
- Question creation
- Question edit, hide, show, and delete
- Assessment save and completion
- Multiple assessment attempts
- Certificate generation
- QR verification page
- Employer certificate upload validation
- Analytics page

---

## Production Considerations

This project is currently configured for local development using SQLite. For production, the database should be moved to PostgreSQL or another managed relational database. Recommended future improvements include:

- Production database hosting
- Environment secret management
- Email provider for password reset and approval notifications
- Rate limiting for login and password reset
- Audit logging for admin actions
- Automated unit and integration tests
- Multi-factor authentication for admin and super admin users
- Managed backups and deployment monitoring

---

## Contributing

Contributions can be made using the following workflow:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature-name
```

5. Open a pull request

---

## License

MIT (c) CareAble
