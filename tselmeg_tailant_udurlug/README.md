# Tselmeg Digital International School Report Day Platform

Монгол хэл дээрх parent report day event-ийн Next.js MVP.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma ORM, PostgreSQL
- Custom single-admin authentication
- Server-sent events for live stage and announcement updates
- Google Cloud Storage upload support with local upload fallback
- Dockerfile for Cloud Run

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start PostgreSQL locally and set `DATABASE_URL`.

4. Run Prisma migration and seed:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

5. Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Admin login: `/admin/login`

Set credentials with:

```env
ADMIN_EMAIL="admin@tselmeg.edu.mn"
ADMIN_PASSWORD="change-me"
AUTH_SECRET="replace-with-long-random-secret"
```

## Google Cloud deployment

Recommended production architecture:

- Cloud Run: Next.js app
- Cloud SQL PostgreSQL: database
- Cloud Storage: uploaded images
- Secret Manager: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, GCS credentials

Build container:

```bash
docker build -t tselmeg-report-day .
```

Cloud Run must receive:

```env
DATABASE_URL="postgresql://..."
ADMIN_EMAIL="..."
ADMIN_PASSWORD="..."
AUTH_SECRET="..."
GCS_BUCKET_NAME="your-bucket"
GCS_PROJECT_ID="your-project"
GCS_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Run migration before first production launch:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

## Notes

- If `GCS_BUCKET_NAME` is empty, uploads are stored locally under `public/uploads`.
- The included `public/logo.svg` is a placeholder. Replace it with the provided school logo while keeping the same file path, or update `components/Logo.tsx`.
- Public pages do not require login. Only `/admin` pages and admin APIs are protected.
