// @TODO: Fill in with actual DB TYPE
type DB = any;

// Discriminated union — services check _type to decide whether to open a tx;
// data-access always uses ctx.db.client (same drizzle query interface for both).
export type DbClient = { _type: "db"; client: DB };
export type TxClient = { _type: "tx"; client: DB };
export type DatabaseClient = DbClient | TxClient;

// Helper: wrap a db-backed context in a transaction.
// Usage in a service:
//   return withTx(ctx, async (txCtx) => { ... });
export async function withTx<TCtx extends { db: DatabaseClient }, R>(
  ctx: TCtx,
  fn: (txCtx: TCtx & { db: TxClient }) => Promise<R>,
): Promise<R> {
  if (ctx.db._type === "tx") {
    // Already inside a transaction — just run.
    return fn(ctx as TCtx & { db: TxClient });
  }
  return ctx.db.client.transaction(async (tx: DB) => {
    const txCtx = { ...ctx, db: { _type: "tx" as const, client: tx } };
    return fn(txCtx as TCtx & { db: TxClient });
  });
}

type BaseFields = {
  db: DatabaseClient;
};

type AuthedFields = {
  user: {
    userId: string;
    email: string;
    handle: string;
  };
};

export type UnauthedContext = {
  _type: "unauthed";
} & BaseFields;

export type AuthedContext = {
  _type: "authed";
} & BaseFields &
  AuthedFields;

export type ServiceContext = UnauthedContext | AuthedContext;
