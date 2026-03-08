# Lurnt — Claude Code Instructions

## Starting Work on a GitHub Issue

When asked to work on an issue (e.g. "let's work on issue #3"), follow this workflow:

1. Ensure the working tree is clean. If there are uncommitted changes, warn the user.
2. `git checkout main && git pull`
3. Create a branch: `git checkout -b <issue-number>-<slugified-title>` (e.g. `3-domain-models`)
4. `git push -u origin <branch-name>`
5. Read the issue with `gh issue view <number>` to understand the full scope.
6. Begin working.

## Committing & PRs

- Always run `pnpm turbo run type-check` before committing to catch errors early.
- The pre-commit hook runs build, type-check, and tests automatically.
- When creating PRs, reference the issue with `Closes #<number>` in the PR body.

## Project Structure

- **Monorepo:** pnpm workspaces + Turborepo
- **Apps:** `apps/web` (Next.js)
- **Packages:** api, data-access, database, domain, domain-services, email, ui, utils, typescript-config
- **Architecture:** API Route → Domain Service → Data Access → Database (see `docs/architecture.md`)
- **Package scope:** `@lurnt/*`

## Conventions

- Domain entities go in `packages/domain/src/domain-entities/<Entity>/` with model.ts, dto.ts, invariants.ts, index.ts
- Services go in `packages/domain-services/src/services/<name>/` with methods in a `methods/` subdirectory
- Data access organized by entity: `packages/data-access/src/entities/<name>/` with queries.ts + mutations.ts
- DB schema in `packages/database/src/schema/`
- Tests use vitest with mocked data-access
