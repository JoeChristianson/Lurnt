import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { readdir } from "fs/promises";

// Load .env from the root of the monorepo (only needed for local dev)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

function getConnectionConfig() {
  const env = process.env;

  if (env.MYSQL_HOST) {
    return {
      host: env.MYSQL_HOST,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      port: parseInt(env.MYSQL_PORT || "3306"),
      database: env.MYSQL_DATABASE,
      connectTimeout: 60000,
    };
  }

  if (env.DATABASE_URL) {
    const url = new URL(env.DATABASE_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: parseInt(url.port || "3306"),
      database: url.pathname.slice(1),
      connectTimeout: 60000,
    };
  }

  throw new Error(
    "Database configuration not found. Provide either DATABASE_URL or MYSQL_* environment variables.",
  );
}

async function runMigrations() {
  const isProduction = process.env.VERCEL === "1";
  const environment = isProduction ? "PRODUCTION" : "LOCAL";

  console.log(`[${environment}] Starting database migrations...`);

  const migrationsFolder = path.resolve(__dirname, "../drizzle");
  let migrationFiles: string[] = [];

  try {
    migrationFiles = await readdir(migrationsFolder);
    migrationFiles = migrationFiles.filter((file) => file.endsWith(".sql"));
  } catch {
    console.log(
      `[${environment}] No migrations folder found or no migrations to run.`,
    );
    process.exit(0);
  }

  if (migrationFiles.length === 0) {
    console.log(
      `[${environment}] No migration files found. Skipping migrations.`,
    );
    process.exit(0);
  }

  console.log(
    `[${environment}] Found ${migrationFiles.length} migration file(s)`,
  );

  let connection;
  try {
    const config = getConnectionConfig();
    console.log(
      `[${environment}] Connecting to database at ${config.host}:${config.port}/${config.database}`,
    );

    connection = await mysql.createConnection(config);
    console.log(`[${environment}] Database connection established`);

    const db = drizzle(connection);

    console.log(`[${environment}] Running migrations...`);
    await migrate(db, { migrationsFolder });

    console.log(`[${environment}] Migrations completed successfully!`);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error(`[${environment}] Migration failed:`, error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

runMigrations().catch((error) => {
  console.error("Unexpected error during migration:", error);
  process.exit(1);
});
