# Top Group

A Next.js application built with TypeScript, Prisma, Tailwind CSS, and modern React tooling.

## Features

- Next.js 16 App Router
- TypeScript support
- Prisma ORM with database migrations and seeding
- Authentication with Better Auth
- Tailwind CSS styling
- React Email integration
- TMDB data generation and seeding
- ESLint and Prettier configuration

---

## Requirements

Before running the project, make sure you have installed:

- Node.js (recommended: latest LTS version)
- npm
- A configured database supported by Prisma

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd top-group
```

Install dependencies:

```bash
npm install
```

---

## Environment Setup

Create a `.env` file in the project root.

Use `example.env` as a reference and provide all required environment variables, such as:

- Database connection details
- Base URL configuration
- Authentication keys
- External API keys

Example:

```env
DATABASE_URL=
BASE_URL=
```

Do not commit your `.env` file.

---

## Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Seed the database:

```bash
npx prisma db seed
```

---

## TMDB Data Generation

Generate TMDB data:

```bash
npm run generate:tmdb
```

After generating the data:

1. Move the generated `tmdb-data.json` file into the `prisma/` directory.
2. Run the seed command:

```bash
npm run seed
```

---

## Email Development

The project uses React Email for developing and previewing email templates.

Start the email development server:

```bash
npm run email:dev
```

The email preview server will run on:

```
http://localhost:3001
```
##https://ethereal.email/login
---

## Development

Start the Next.js development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Available Scripts

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the development server         |
| `npm run build`         | Create a production build            |
| `npm run start`         | Start the production server          |
| `npm run lint`          | Run ESLint checks                    |
| `npm run format`        | Format the project using Prettier    |
| `npm run format:check`  | Check formatting                     |
| `npm run generate:tmdb` | Generate TMDB data                   |
| `npm run seed`          | Seed the database                    |
| `npm run email:dev`     | Start React Email development server |

---

## Code Quality

Before submitting changes, run:

```bash
npm run lint
```

```bash
npm run format:check
```

```bash
npm run build
```

These checks help ensure consistent formatting, code quality, and production compatibility.

---

## Deployment

This project can be deployed using platforms that support Next.js applications, such as Vercel.

For deployment instructions, see the official Next.js deployment documentation:

https://nextjs.org/docs/app/building-your-application/deploying

---

## Tech Stack

### Framework

- Next.js
- React
- TypeScript

### Styling

- Tailwind CSS
- Radix UI
- Base UI

### Database

- Prisma ORM
- PostgreSQL

### Authentication

- Better Auth

### Developer Tools

- ESLint
- Prettier
- Prisma CLI

### Email

- React Email
- Nodemailer

---

## Contributing

When contributing:

1. Create a new branch.
2. Make your changes.
3. Run linting and build checks.
4. Commit your changes with a descriptive message.
5. Open a pull request.

Keep commits focused and follow the existing project style.
