require("dotenv").config();
const { Pool } = require("pg");


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});


pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client:", err.stack);

    return;
  }

  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      console.error("Error executing query:", err.stack);
      return;
    } else {
      console.log("PostgreSQL connected:", result.rows);
    }
  });
});


module.exports = pool;
