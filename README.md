<div align="center">

# OffScript

**Research · Think · Speak · Repeat**

OffScript is a daily practice space for becoming more comfortable speaking without a script. It gives you an unexpected topic, lets you research and form a view, then challenges you to speak for at least two minutes in your own words.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6c47ff?logo=clerk&logoColor=white)](https://clerk.com/)
[![Neon](https://img.shields.io/badge/Database-Neon-00e599?logo=neon&logoColor=black)](https://neon.com/)

</div>

<img src="./frontend/public/landing-new.png" alt="OffScript landing page" width="100%" />

## Why OffScript?

It is easy to outsource wording, structure, and arguments. OffScript is deliberately built around the opposite habit: encountering a prompt, doing enough research to understand it, and explaining what you think aloud.

V1 keeps the loop simple: get a topic, speak for two minutes, and return tomorrow.

## Features

- **Unexpected topic generator** — draws a prompt from a curated database, with a lightweight animated reveal.
- **Research-first practice** — encourages users to investigate the topic before speaking, without supplying a script or generated answer.
- **Two-minute speaking challenge** — a timer unlocks completion after 120 seconds and continues counting if the speaker wants to go longer.
- **Optional in-browser recording** — uses the browser’s camera, microphone, and `MediaRecorder` APIs; V1 offers the finished recording as a browser download rather than uploading it to OffScript.
- **YouTube archive links** — optionally attach an Unlisted YouTube video to a completed challenge. OffScript validates and stores the link; it does not host the video.
- **Progress that respects timezone** — per-user streaks, totals, history, and a 26-week activity heatmap use the user’s IANA timezone for day boundaries.
- **Authenticated, user-scoped data** — Clerk handles authentication, while server-side data access and database queries scope every challenge to the signed-in user.

## How it works

1. Sign in and generate a topic.
2. Research it and form your own perspective.
3. Start the challenge and speak for at least two minutes.
4. Complete the session, optionally download the recording, and optionally attach an Unlisted YouTube link.
5. Review your challenge history, streak, and speaking activity over time.

## Tech stack

| Area | Technologies |
| --- | --- |
| App | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, Base UI, shadcn/ui, Lucide |
| Authentication | Clerk |
| Data | Neon Serverless Postgres, Drizzle ORM + Drizzle Kit |
| Validation | Zod |
| Analytics | Vercel Analytics |
| Tooling | pnpm, ESLint, TypeScript |

## Getting started

### Prerequisites

- Node.js compatible with Next.js 16
- [pnpm 10](https://pnpm.io/installation)
- A Neon Postgres database
- A Clerk application

### Install and configure

From this `frontend` directory:

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` with your Neon pooled connection string and Clerk keys. The complete list of required settings and their descriptions is maintained in [`.env.example`](.env.example).

Apply the included database migration and seed the prompt catalog:

```bash
pnpm db:migrate
pnpm db:seed
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres pooled connection string. |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical public URL used for metadata, sitemap, and robots. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key. |
| `CLERK_SECRET_KEY` | Clerk secret key. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Mounted sign-in route. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Mounted sign-up route. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Default redirect after sign-in. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Default redirect after sign-up. |

`VERCEL_PROJECT_PRODUCTION_URL` is also recognised automatically as a fallback site URL in Vercel environments.

## Available commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | Run ESLint. |
| `pnpm typecheck` | Run TypeScript without emitting files. |
| `pnpm db:generate` | Generate a Drizzle migration from schema changes. |
| `pnpm db:migrate` | Apply Drizzle migrations. |
| `pnpm db:push` | Push the schema directly to the configured database. |
| `pnpm db:studio` | Launch Drizzle Studio. |
| `pnpm db:seed` | Seed the topic catalog. |

## Project structure

```text
frontend/
├── app/                    # App Router pages, server actions, and auth routes
│   ├── actions/            # Topic, challenge, and timezone server actions
│   ├── dashboard/          # Topic generator and today's activity
│   ├── recording/          # Browser recording and two-minute challenge
│   ├── history/            # Completed challenge archive
│   └── progress/           # Streak, totals, and activity heatmap
├── components/             # Navigation, heatmap, landing, and UI components
├── db/                     # Drizzle client, schema, migrations, and seed data
├── lib/                    # Data-access layer, queries, validation, and site config
├── public/                 # Application images and static assets
├── proxy.ts                # Clerk route protection
└── .env.example            # Local configuration template
```

## Data model and architecture

Clerk is the source of truth for identity. On first authenticated use, OffScript creates a small profile row in Neon Postgres for the Clerk user ID and timezone. Completed challenges are stored with a snapshot of their topic text, duration, completion time, timezone-aware calendar date, and optional YouTube URL. This keeps historical sessions intact even if a catalog topic later changes.

The app uses Server Components for authenticated pages and Server Actions for topic generation, session completion, archive-link updates, and timezone syncing. The browser only sends a topic ID when completing a challenge; the server reads the topic again before saving it.

## Recording and privacy notes

Camera and microphone access is optional. If permission is unavailable, a user can still complete a speaking challenge in practice mode. When recording is enabled, the video is produced in the browser and offered as a download; this V1 does not upload recordings to OffScript. Authentication is provided by Clerk, and challenge data is persisted in Neon Postgres. A YouTube URL is saved only when the user explicitly supplies one after completing a challenge.

## Quality checks

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## V1 scope

OffScript V1 is a practice tool, not an automated speaking evaluator. It does not generate a script, score opinions, analyse personality, or provide an AI confidence rating. The product is intentionally centred on consistent, self-directed practice.
