## Setup and Run instructions:

1. Install dependencies

```bash
npm install
```

2. Add .env file in the root and refer to example.env for enviroment variables ex. BASE_URL & KEYS
3. Migrate prisma

```bash
npx prisma migrate dev
```

4. Generate prisma client

```bash
npx prisma generate
```

```bash
npx prisma db seed
```

---

Run the development server:

```bash
npm run dev
```

Seed commands:

```bash
npm run generate:tmdb
```

drag the tmdb-data.json into prisma/

```bash
npm run seed
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
