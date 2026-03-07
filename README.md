# Lurnt

Lurnt guides your learning toward expertise. Tell it what you want to master, and it builds a personalized knowledge graph — a map of concepts and prerequisites — then walks you through it with resources, quizzes, and conversational assessments.

## How It Works

1. **Pick an expertise** — "Machine Learning", "Guitar", "Spanish", anything.
2. **Initial assessment** — A conversational intake gauges your background, followed by a placement test to pinpoint where you are on the graph.
3. **Learn** — Lurnt always surfaces your next three unlocked topics. Each topic comes with curated resources (videos, articles, exercises — based on your preferences).
4. **Prove it** — Pass a hard-coded quiz, then a conversational assessment with an LLM to complete a node.
5. **Keep going** — The graph expands progressively as you advance. There's no finish line — always more to learn.

## Key Concepts

- **Expertise** — A subject area you want to master. You can have multiple active at once.
- **Knowledge Graph** — AI-generated DAG of concepts, where each node has prerequisite nodes. Generated progressively as you advance.
- **Node** — A single concept/topic. Has resources, a quiz, and a conversational assessment.
- **Resources** — Videos, articles, courses, etc. Looked up by AI for the first user, then cached for everyone. Users can submit and upvote resources too.
- **Assessment** — Two-stage: hard-coded quiz to verify basics, then a conversational LLM assessment for deeper understanding.

## Tech Stack

- **Framework:** Next.js (App Router)
- **API:** tRPC
- **Database:** MySQL 8.0 + Drizzle ORM
- **AI:** LLM-powered graph generation, resource lookup, and conversational assessment
- **Auth:** JWT + Google OAuth
- **Email:** Resend
- **UI:** Custom component library (`@lurnt/ui`)
- **Monorepo:** pnpm workspaces + Turborepo
- **Testing:** Vitest
- **Language:** TypeScript

## Project Structure

```
apps/
  web/                  # Next.js frontend + API routes

packages/
  api/                  # tRPC router, context, auth helpers
  data-access/          # Database queries & mutations
  database/             # Drizzle schema & migrations
  domain/               # Domain models, DTOs, invariants
  domain-services/      # Business logic services
  email/                # Email templates & sending
  ui/                   # Shared React components & themes
  utils/                # Shared utilities (hashing, logging, etc.)
  typescript-config/    # Shared TS configs
```

See [docs/architecture.md](docs/architecture.md) for details on the layered architecture and code conventions.

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.x
- Docker (for MySQL)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start MySQL
pnpm db:up

# Run migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed

# Start dev server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [.env.example](.env.example) for all available configuration options.

## Scripts

| Command                   | Description                 |
| ------------------------- | --------------------------- |
| `pnpm dev`                | Start the dev server        |
| `pnpm build`              | Build all packages          |
| `pnpm lint`               | Lint all packages           |
| `pnpm type-check`         | Type-check all packages     |
| `pnpm test`               | Run tests                   |
| `pnpm db:up`              | Start MySQL via Docker      |
| `pnpm db:migrate`         | Run database migrations     |
| `pnpm db:make-migrations` | Generate a new migration    |
| `pnpm db:studio`          | Open Drizzle Studio         |
| `pnpm db:seed`            | Seed the database           |
