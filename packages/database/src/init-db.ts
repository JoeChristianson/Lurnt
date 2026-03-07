import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Load .env from the root of the monorepo
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function initializeDatabase() {
  const env = process.env;

  // Get connection params (without database name)
  const host = env.MYSQL_HOST;
  const user = env.MYSQL_USER;
  const password = env.MYSQL_PASSWORD;
  const database = env.MYSQL_DATABASE;
  const port = parseInt(env.MYSQL_PORT || "3306");

  if (!host || !user || !password || !database) {
    console.error("Missing required environment variables:");
    console.error("Required: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE");
    process.exit(1);
  }

  console.log(`Connecting to MySQL server at ${host}:${port}...`);

  let connection;
  try {
    // Connect WITHOUT specifying a database
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      connectTimeout: 60000,
    });

    console.log("Connected to MySQL server successfully!");

    // Check if database exists
    const [databases] = await connection.query(
      "SHOW DATABASES LIKE ?",
      [database]
    );

    if (Array.isArray(databases) && databases.length > 0) {
      console.log(`Database '${database}' already exists.`);
    } else {
      // Create the database
      console.log(`Creating database '${database}'...`);
      await connection.query(`CREATE DATABASE \`${database}\``);
      console.log(`Database '${database}' created successfully!`);
    }

    // Verify we can connect to the database
    await connection.query(`USE \`${database}\``);
    console.log(`Successfully connected to database '${database}'.`);

    await connection.end();
    console.log("\n✅ Database initialization complete!");
    console.log("\nNext steps:");
    console.log("1. Run migrations: pnpm db:migrate");
    console.log("2. Start your application: pnpm dev");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database initialization failed:", error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

initializeDatabase();
