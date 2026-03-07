# Architecture & Patterns

## Layered Architecture

All requests flow through four layers:

```
API Route → Domain Service → Data Access → Database
```

- **API Route** (`apps/web/src/app/api/`): Next.js App Router route handlers. Authenticates the request, parses/validates input with Zod DTOs, builds a `ServiceContext`, and delegates to domain services. No business logic here.
  - **tRPC routes** (`api/trpc/[trpc]/`): For authenticated user-facing features (auth, profile, stats).
  - **REST routes** (`api/admin/`): For admin CRUD operations, authenticated via `APP_ADMIN_TOKEN` bearer token.
- **Domain Service** (`packages/domain-services/src/services/`): Business logic. Uses the `makeService` factory from `@erz/domain`. Each service method lives in its own file under a `methods/` subdirectory.
- **Data Access** (`packages/data-access/src/entities/`): Raw database queries and mutations. Takes the full `ServiceContext` as the first parameter — never imports `getDb` or other connection singletons directly.
- **Database** (`packages/database/src/schema/`): Drizzle ORM schema definitions. Uses `genericColumns` (id, createdAt, updatedAt) for all tables.

## Domain Entities

Domain entities live in `packages/domain/src/domain-entities/`. Each entity gets a **Capitalized** folder with three files:

```
packages/domain/src/domain-entities/<Entity>/
├── model.ts        # Zod schema + TypeScript type for the domain model
├── dto.ts          # Input/output DTOs derived from the model schema
├── invariants.ts   # Business rule validation functions
└── index.ts        # Re-exports
```

### Model Convention

Models use `createdOn`/`updatedOn` (not `createdAt`/`updatedAt` — those are DB column names). Services map between the two.

```typescript
export const VenueSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  name: z.string(),
  // ...
});
export type Venue = z.infer<typeof VenueSchema>;
```

### DTO Convention

DTOs **derive from the model schema** using `.omit()`, `.extend()`, `.pick()`, and `.partial()` — never redeclare fields independently.

```typescript
// Input: omit system fields, add validation constraints
export const CreateVenueInputSchema = VenueSchema
  .omit({ id: true, createdOn: true, updatedOn: true })
  .extend({
    name: z.string().min(1).max(255),
    websiteUrl: z.string().url().max(500).nullable().optional(),
  });

// Partial for updates
export const UpdateVenueInputSchema = CreateVenueInputSchema.partial();

// Output: reuse model directly
export const VenueResponseSchema = VenueSchema;
```

### Current Entities

- **Location** — Embeddable value object (name, address, city, state, zip, lat, lng). Used as JSON in Event's `locationOverride`.
- **Venue** — Physical location with coordinates and website.
- **Event** — Core entity with title, dates, status (draft/published/cancelled), optional venue FK, optional JSON location override, series/recurrence support.
- **Tag** — Name + auto-generated slug. Many-to-many with Event via EventTag junction table.

## ServiceContext & the db/tx Discriminated Union

The `ServiceContext` (defined in `@erz/domain`) carries a `db` field that is a discriminated union:

```typescript
type DbClient = { _type: "db"; client: DB };
type TxClient = { _type: "tx"; client: DB };
type DatabaseClient = DbClient | TxClient;
```

- **Data-access functions** always use `ctx.db.client` to execute queries. They don't care whether it's a db or tx — same interface.
- **Services** check `ctx.db._type` when they need to decide whether to start a transaction.
- The `withTx` helper handles idempotent transaction wrapping:

```typescript
// If already in a tx, just runs fn. Otherwise starts a new transaction.
return withTx(ctx, async (txCtx) => {
  await someDataAccessFn(txCtx, ...);
});
```

## Service File Structure

Each service follows this layout:

```
packages/domain-services/src/services/<name>/
├── <Name>Service.ts          # PascalCase — imports methods, uses makeService
├── index.ts                  # Re-exports
└── methods/
    ├── create.ts
    ├── update.ts
    ├── remove.ts
    ├── getById.ts
    ├── list.ts
    └── to<Entity>.ts         # DB row → domain model mapper
```

The main service file composes methods using `makeService`:

```typescript
export const VenueService = {
  create: makeService("unauthed", { execute: create }),
  update: makeService("unauthed", { execute: update }),
  delete: makeService("unauthed", { execute: remove }),
  getById: makeService("unauthed", { execute: getById }),
  list: makeService("unauthed", { execute: list }),
};
```

- `"unauthed"` methods receive `UnauthedContext` (db only).
- `"authed"` methods receive `AuthedContext` (db + user).

### DB Row → Domain Model Mapping

Each service has a `to<Entity>.ts` mapper that converts DB rows to domain models:
- `createdAt` → `createdOn`
- `updatedAt` → `updatedOn`
- Decimal strings (lat/lng) → numbers
- Raw JSON → typed domain objects

## Data Access Conventions

- Every function takes `ctx: ServiceContext` as its first parameter.
- Dependencies (db connection, tx) are provided through the context — never imported directly.
- Organized by entity: `queries.ts` (reads) + `mutations.ts` (writes).
- Use Drizzle query builder for typed queries; raw SQL is acceptable for complex queries.

## REST API Route Conventions

Admin REST routes authenticate via bearer token:

```typescript
import { authenticateAdmin, unauthorized } from "@erz/api";

export async function GET(req: Request) {
  if (!authenticateAdmin(req)) return unauthorized();
  const db = await getDb();
  const ctx: UnauthedContext = { _type: "unauthed", db: { _type: "db", client: db } };
  const result = await SomeService.list.execute(ctx, {});
  return Response.json(result);
}
```

Routes are thin wrappers — authenticate, parse input, build context, call service, return JSON.

## Testing

- Tests use **vitest** with mocked data-access functions.
- Every service gets a `*.test.ts` file alongside its main service file.
- Data-access is mocked at the module level with `vi.mock("@erz/data-access")`.
- Test contexts are constructed with mock `TxClient` objects.
