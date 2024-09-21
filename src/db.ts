import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function checkConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Connected to database.");
    connection.release();
  } catch (err) {
    if (err instanceof Error) {
      console.error("Database connection failed:", err.message);
    }
  }
}

checkConnection();

export default db;
