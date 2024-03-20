const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL + (process.env.DATABASE_SSL ? "?ssl=true" : "");
const pool = new Pool({ connectionString })

export async function createSessionTable() {
  try {
    return await pool.query("CREATE TABLE IF NOT EXISTS session ( id SERIAL PRIMARY KEY, username VARCHAR (50) NOT NULL );");
  } catch (error) {
    throw new Error("Something went wrong creating the session table: " + error.message);
  }
}

export async function deleteSessionTable() {
  return await pool.query("DROP TABLE IF EXISTS session");
}

export async function addSession(username) {
  const insert = {
    text: "INSERT INTO session(username) VALUES($1)",
    values: [username]
  }
  const res = await pool.query(insert)
  return await pool.query("COMMIT");
}

export async function viewSessions() {
  try {
    const res = await pool.query("SELECT * FROM session");
    return res.rows;
  } catch (error) {
    throw new Error("Unable to view sessions: " + error.message);
  }
}
