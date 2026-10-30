# APC Youth For Progressive Nigeria — initial website foundation

This is a development starter for a membership and information portal. It includes:
- Responsive public homepage
- Registration form
- Server-side age validation (18+)
- Password hashing with bcrypt
- PostgreSQL data model using Prisma
- Pending application creation
- Initial administrator creation script (does not expose a public admin-registration route)

## Important before real public use

This starter is not yet production-ready. Authentication/login, password reset, administrator review screens, rate limiting, email verification, secure QR issuance/verification, data export/deletion workflows, backups, monitoring, and security testing still need to be implemented and tested. Do not collect real member data or publicly launch until those items, the organization's privacy notice, and legal review are complete.

The application intentionally does not include party persuasion, voter profiling, or public member directories. Membership information is sensitive and must be restricted to authorized purposes and personnel.

## Requirements

- Node.js 20.9 or later
- PostgreSQL 15 or later
- npm

## Setup

1. Extract the ZIP.
2. Open a terminal in the project folder.
3. Install packages:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL database.
5. Create the database tables:

   ```bash
   npx prisma migrate dev --name initial
   ```

6. Add the official State, LGA and Ward reference data to the `State`, `Lga` and `Ward` tables. The form will not accept an application until its selected state and LGA exist in these verified tables. Do not rely on free-text guesses for the official location register.
7. Start the development server:

   ```bash
   npm run dev
   ```

8. Visit http://localhost:3000

## Create the first administrator

Set `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL` and a unique password of at least 16 characters in `.env`, then run:

```bash
npm run admin:create
```

The initial administrator creation script creates a SUPER_ADMIN account. A secure admin login interface and session handling must be implemented before this account can be used through the website. Keep `.env` private.

## Current registration behavior

- Applicants must be 18 or older. The server checks this; browser validation is not trusted.
- Phone number is required and unique. Email is optional and unique when supplied.
- Passwords are hashed before storage.
- Applicants select a state and enter their LGA. The API checks these against the database.
- Ward is optional in this first build and, if supplied, must match the selected LGA.
- A successful submission creates a PENDING member and PENDING application.
- Membership number and card are not issued at registration. They are reserved for the future approval workflow.

## Architecture notes

The schema includes users, members, applications, cards, states, LGAs, wards, admin profiles, audit logs, programs and program registrations. Admin roles are scoped in the data model; authorization enforcement must be added to every admin endpoint before use.

Before launch, have the organization approve the exact branding, membership rules, data fields, retention period, privacy notice, and authorized administrator list.
