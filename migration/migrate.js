const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const sqlFilePath = path.join(__dirname, "db.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

const statements = sql
  .split(";")
  .filter((statement) => statement.trim() !== "");

const executeStatements = (connection, statements) => {
  return new Promise((resolve, reject) => {
    let index = 0;

    const next = () => {
      if (index >= statements.length) {
        return resolve("SQL script executed successfully");
      }

      connection.query(statements[index], (err, results) => {
        if (err) {
          reject(`Error executing SQL statement: ${err.stack}`);
        } else {
          index++;
          next();
        }
      });
    };

    next();
  });
};

connection.connect(async (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }

  console.log("Connected to the database");

  try {
    const result = await executeStatements(connection, statements);
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    connection.end();
  }
});
