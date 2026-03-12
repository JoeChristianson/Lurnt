import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const ALLOWED_HOSTS = ["localhost", "127.0.0.1", "::1"];

async function truncateAllTables() {
  const host = process.env.MYSQL_HOST ?? new URL(process.env.DATABASE_URL ?? "").hostname;
  if (!ALLOWED_HOSTS.includes(host)) {
    console.error(`ABORTING: host "${host}" is not local. This script only runs against localhost.`);
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST ?? host,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE ?? new URL(process.env.DATABASE_URL ?? "").pathname.slice(1),
  });

  try {
    const [rows] = await connection.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'`,
    );

    const tables = (rows as Array<{ TABLE_NAME: string }>)
      .map((r) => r.TABLE_NAME)
      .filter((name) => name !== "__drizzle_migrations");

    if (tables.length === 0) {
      console.log("No tables to truncate.");
      return;
    }

    console.log(`Truncating ${tables.length} tables...`);

    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE \`${table}\``);
      console.log(`  truncated ${table}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Done.");
  } finally {
    await connection.end();
  }
}

truncateAllTables().catch((err) => {
  console.error(err);
  process.exit(1);
});