This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in real values before running or deploying:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | **Yes** | 32+ char random string for JWT signing. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GUMROAD_PRODUCT_PERMALINK` | No | Gumroad product URL slug (defaults to `carpetestimator`) |

> **⚠️ SECURITY WARNING — Git History**
>
> Previous versions of this codebase contained a hardcoded JWT secret:
> `carpet_estimator_pro_secure_stateless_secret_2026`
>
> This value may still exist in git history. **If you have any commits containing this string, rotate it immediately:**
> 1. Generate a new `JWT_SECRET` value (see above).
> 2. Update `JWT_SECRET` in your deployment environment (Vercel, etc.).
> 3. All existing session cookies signed with the old secret will be invalidated automatically — users will need to re-enter their license key.
> 4. Optionally purge the secret from git history using `git filter-repo` or BFG Repo Cleaner.

