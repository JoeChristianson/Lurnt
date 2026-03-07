import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import * as schema from "./schema";

// Load .env from the root of the monorepo
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const globalForDb = globalThis as unknown as {
  connection: mysql.Connection | undefined;
  db: ReturnType<typeof drizzle> | undefined;
};

// Parse DATABASE_URL or use individual connection params
function getConnectionConfig() {
  const env = process.env;

  // If individual params are provided, use those
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

  // Otherwise, parse DATABASE_URL
  if (env.DATABASE_URL) {
    const url = new URL(env.DATABASE_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: parseInt(url.port || "3306"),
      database: url.pathname.slice(1), // Remove leading '/'
      connectTimeout: 60000,
    };
  }

  throw new Error(
    "Database configuration not found. Provide either DATABASE_URL or MYSQL_* environment variables."
  );
}

// Lazy initialization function
async function getConnection() {
  if (!globalForDb.connection) {
    const config = getConnectionConfig();
    console.log(
      `Connecting to database at ${config.host}:${config.port}/${config.database}`
    );
    globalForDb.connection = await mysql.createConnection(config);
    console.log("Database connection established");
  }
  return globalForDb.connection;
}

// Initialize database connection
async function initDb() {
  if (!globalForDb.db) {
    const connection = await getConnection();
    globalForDb.db = drizzle(connection, { schema, mode: "default" });
  }
  return globalForDb.db;
}

// Export the db getter
export const getDb = initDb;

// Export schema for use in queries
export * from "./schema";
