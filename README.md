# MediStore - Server

Professional backend for MediStore — a medicine e-commerce API built with Node.js, TypeScript, Express and Prisma.

## Table of Contents
- Project Overview
- Features
- Tech Stack
- Prerequisites
- Environment Variables
- Setup & Run
- Database & Migrations
- Seeding
- Project Structure
- API Overview
- Development Tips
- Contributing
- License

## Project Overview

`medistore-server` is the backend for a medication storefront. It exposes RESTful endpoints to manage medicines, categories, user accounts, orders, reviews and sessions. The project uses Prisma as ORM and Postgres as the primary database.

## Features

- User authentication and sessions
- Product (Medicine) CRUD
- Category management
- Orders and Order Items
- Reviews
- Admin seeding script
- Centralized error handling and auth middleware

## Database Design (ERD)

The database schema is designed to handle multi-role authentication, complex order management, and inventory tracking. 

**View Interactive Diagram:** [DrawSQL - MediStore ERD](https://drawsql.app/teams/faysal-ahmed/diagrams/medistore)

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- nodemailer for email
- dotenv for environment variables

## Prerequisites

- Node 18+ (or compatible)
- PostgreSQL database
- npm (or npx available)

## Environment Variables

Create a `.env` file in the project root with at least the following variables:

- `DATABASE_URL` — Postgres connection string (required)
- `PORT` — server port (optional; defaults in code)
- `JWT_SECRET` — secret for signing tokens (if used in auth flows)
- `NODE_ENV` — `development` or `production`
- `EMAIL_USER`, `EMAIL_PASS` — if email notifications are used

Example `.env` (do NOT commit this file):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medistore"
PORT=4000
JWT_SECRET=supersecretvalue
NODE_ENV=development
EMAIL_USER=you@example.com
EMAIL_PASS=yourpassword
```

## Setup & Run

Install dependencies:

```bash
npm install
```

Run the development server (hot-reload via `tsx watch`):

```bash
npm run dev
```

Run tests (if added):

```bash
npm test
```

## Database & Migrations

This project uses Prisma. You can push the Prisma schema to the database or apply migrations.

To push the current Prisma schema (safe for development):

```bash
npx prisma db push
```

To run migrations (if you have migration history and want to apply locally):

```bash
npx prisma migrate dev
```

To open Prisma Studio for browsing data:

```bash
npx prisma studio
```

Note: The project includes a `prisma/` folder and migration files in `prisma/migrations/`.

## Seeding

An admin seeding script is available to create initial admin accounts. Run:

```bash
npm run seed:admin
```

The script is located at `src/scripts/seedAdmin.ts`.

## Project Structure

- `src/` — application source
  - `app.ts` — Express app initialization
  - `server.ts` — entrypoint that starts the server
  - `lib/` — helpers (`prisma.ts`, `auth.ts`)
  - `modules/` — feature modules (medicines, users, ...)
  - `middlewares/` — auth, error handlers
  - `constants/` — constants such as roles
  - `scripts/` — utilities like seed scripts
- `prisma/` — Prisma schema and migrations
- `package.json` — scripts and dependencies

## API Overview

This repository exposes REST endpoints for resources such as `medicines`, `users`, `orders`, etc. Example routes (subject to router files):

- `GET /api/medicines` — list medicines
- `POST /api/medicines` — create medicine (admin)
- `GET /api/medicines/:id` — get medicine details
- `POST /api/users/register` — register user
- `POST /api/users/login` — login

Refer to the router files under `src/modules/` to see full route definitions and request/response shapes.

## Development Tips

- Keep `.env` out of version control.
- Use `npx prisma db push` while iterating locally to sync schema quickly.
- Use `npm run seed:admin` after database reset to create an admin user.
- Add request/response validation where needed for production readiness.

## Contributing

Contributions are welcome. Typical flow:

1. Fork the repo
2. Create a feature branch
3. Make changes with tests where applicable
4. Open a PR describing the change

## License

Specify your license here (e.g. MIT). If none selected, add an appropriate license file.

---

If you want, I can also:

- Add a `CONTRIBUTING.md` template
- Add a minimal `swagger` or Postman collection for the API
- Commit the changes and run the server to verify startup

Please tell me which follow-up actions you'd like.
